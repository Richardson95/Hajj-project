"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHydrated } from "../client-hooks";
import type {
  ChecklistItem,
  HajjPackage,
  ItineraryActivity,
  ItineraryDay,
  PilgrimGroup,
  Product,
} from "../types";
import { NEW_VENDOR_DEFAULTS, OPS_INITIAL_STATE } from "./seed";
import type {
  AdminAccount,
  AdminRole,
  AuditEntry,
  DisputeStatus,
  OpsAnnouncement,
  OpsFaq,
  OpsPlan,
  OpsState,
  OpsVendor,
  PlatformUser,
  SosStatus,
  SupportTicket,
  TicketStatus,
  VendorStatus,
} from "./types";

/**
 * Operations console store.
 *
 * Kept separate from the pilgrim store so an admin session and a pilgrim
 * session are independent, exactly as they would be with a real backend.
 * Everything here lives in this browser only; a production build replaces
 * these mutations with authenticated API calls and server-side role checks.
 */

const STORAGE_KEY = "hajjpath.ops.v1";

type Result = { ok: true } | { ok: false; error: string };

interface OpsActions {
  hydrated: boolean;
  currentAdmin: AdminAccount | null;
  isAdminEmail: (email: string) => boolean;
  adminLogin: (email: string, password: string) => Result;
  adminLogout: () => void;
  addAdmin: (input: { name: string; email: string; role: AdminRole; password: string }) => Result;
  removeAdmin: (id: string) => Result;
  logAction: (action: string) => void;
  setUserKyc: (id: string, status: PlatformUser["kyc"], reason?: string) => void;
  updatePlan: (id: string, patch: Partial<Pick<OpsPlan, "status" | "travelYear">>) => void;
  createTicket: (input: {
    name: string;
    email: string;
    phone?: string;
    topic: string;
    message: string;
  }) => SupportTicket;
  replyTicket: (id: string, body: string) => void;
  setTicketStatus: (id: string, status: TicketStatus) => void;
  assignTicket: (id: string, adminId: string | undefined) => void;
  setVendorStatus: (id: string, status: VendorStatus) => void;
  toggleProductHidden: (productId: string, productName: string) => void;
  resolveDispute: (id: string, outcome: Exclude<DisputeStatus, "open">, note: string) => void;
  updatePackage: (id: string, patch: Partial<Pick<HajjPackage, "priceNGN" | "highlight">>) => void;
  saveFaq: (faq: Omit<OpsFaq, "id"> & { id?: string }) => void;
  removeFaq: (id: string) => void;
  publishAnnouncement: (input: Omit<OpsAnnouncement, "id" | "date" | "author">) => void;
  removeAnnouncement: (id: string) => void;
  setSosStatus: (id: string, status: SosStatus, respondent?: string) => void;
  saveProduct: (product: Omit<Product, "id"> & { id?: string }) => void;
  deleteProduct: (id: string) => void;
  saveVendor: (vendor: Omit<OpsVendor, "id"> & { id?: string }) => void;
  saveChecklistItem: (item: Omit<ChecklistItem, "id"> & { id?: string }) => void;
  removeChecklistItem: (id: string) => void;
  updateGroup: (patch: Partial<PilgrimGroup>) => void;
  updateDay: (dayId: string, patch: Partial<Pick<ItineraryDay, "title" | "subtitle" | "gregorian" | "hijri">>) => void;
  saveActivity: (dayId: string, activity: Omit<ItineraryActivity, "id"> & { id?: string }) => void;
  removeActivity: (dayId: string, activityId: string) => void;
  resetOps: () => void;
}

type OpsStore = OpsState & OpsActions;

const OpsContext = createContext<OpsStore | null>(null);

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

let persistedCache: OpsState | null = null;

function readPersisted(): OpsState {
  if (persistedCache) return persistedCache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = { ...OPS_INITIAL_STATE, ...(JSON.parse(raw) as Partial<OpsState>) };
      /* Vendors saved by an earlier version may lack the storefront fields. */
      saved.vendors = saved.vendors.map((v) => ({ ...NEW_VENDOR_DEFAULTS, ...v }));
      persistedCache = saved;
    } else {
      persistedCache = OPS_INITIAL_STATE;
    }
  } catch {
    persistedCache = OPS_INITIAL_STATE;
  }
  return persistedCache;
}

const normalise = (email: string) => email.trim().toLowerCase();

function adminName(state: OpsState): string {
  return state.admins.find((a) => a.id === state.sessionAdminId)?.name ?? "System";
}

/** Returns the state with an audit entry prepended, attributed to the signed-in admin. */
function withAudit(state: OpsState, action: string): OpsState {
  const entry: AuditEntry = {
    id: uid("au"),
    at: new Date().toISOString(),
    admin: adminName(state),
    action,
  };
  return { ...state, audit: [entry, ...state.audit].slice(0, 200) };
}

export function OpsProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const [edited, setEdited] = useState<OpsState | null>(null);

  const state = edited ?? (hydrated ? readPersisted() : OPS_INITIAL_STATE);

  useEffect(() => {
    if (!hydrated || !edited) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edited));
      persistedCache = edited;
    } catch {
      /* quota or private mode — the console still works for this session */
    }
  }, [edited, hydrated]);

  const patch = useCallback((updater: (prev: OpsState) => OpsState) => {
    setEdited((prev) => updater(prev ?? readPersisted()));
  }, []);

  const currentAdmin = useMemo(
    () => state.admins.find((a) => a.id === state.sessionAdminId) ?? null,
    [state.admins, state.sessionAdminId],
  );

  const isAdminEmail = useCallback(
    (email: string) => state.admins.some((a) => normalise(a.email) === normalise(email)),
    [state.admins],
  );

  const adminLogin = useCallback<OpsActions["adminLogin"]>(
    (email, password) => {
      const current = edited ?? readPersisted();
      const admin = current.admins.find((a) => normalise(a.email) === normalise(email));
      if (!admin) return { ok: false, error: "This email is not on the HajjPath admin team." };
      if (admin.password !== password) return { ok: false, error: "Incorrect password." };
      patch((prev) => withAudit({ ...prev, sessionAdminId: admin.id }, "Signed in"));
      return { ok: true };
    },
    [edited, patch],
  );

  const adminLogout = useCallback(() => {
    patch((prev) => ({ ...withAudit(prev, "Signed out"), sessionAdminId: null }));
  }, [patch]);

  const addAdmin = useCallback<OpsActions["addAdmin"]>(
    (input) => {
      const current = edited ?? readPersisted();
      const me = current.admins.find((a) => a.id === current.sessionAdminId);
      if (me?.role !== "super-admin")
        return { ok: false, error: "Only a super admin can add people to the team." };
      if (current.admins.some((a) => normalise(a.email) === normalise(input.email)))
        return { ok: false, error: "That email is already on the admin team." };
      const account: AdminAccount = {
        id: uid("adm"),
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
        role: input.role,
        addedAt: new Date().toISOString(),
        addedBy: me.name,
      };
      patch((prev) =>
        withAudit(
          { ...prev, admins: [...prev.admins, account] },
          `Added ${account.name} as ${account.role === "super-admin" ? "a super admin" : "staff"}`,
        ),
      );
      return { ok: true };
    },
    [edited, patch],
  );

  const removeAdmin = useCallback<OpsActions["removeAdmin"]>(
    (id) => {
      const current = edited ?? readPersisted();
      const me = current.admins.find((a) => a.id === current.sessionAdminId);
      const target = current.admins.find((a) => a.id === id);
      if (!target) return { ok: false, error: "Admin not found." };
      if (me?.role !== "super-admin")
        return { ok: false, error: "Only a super admin can remove people from the team." };
      if (target.id === me.id) return { ok: false, error: "You cannot remove yourself." };
      const supers = current.admins.filter((a) => a.role === "super-admin");
      if (target.role === "super-admin" && supers.length <= 1)
        return { ok: false, error: "The team must keep at least one super admin." };
      patch((prev) =>
        withAudit(
          {
            ...prev,
            admins: prev.admins.filter((a) => a.id !== id),
            tickets: prev.tickets.map((t) =>
              t.assigneeId === id ? { ...t, assigneeId: undefined } : t,
            ),
          },
          `Removed ${target.name} from the admin team`,
        ),
      );
      return { ok: true };
    },
    [edited, patch],
  );

  const logAction = useCallback<OpsActions["logAction"]>(
    (action) => patch((prev) => withAudit(prev, action)),
    [patch],
  );

  const setUserKyc = useCallback<OpsActions["setUserKyc"]>(
    (id, status, reason) =>
      patch((prev) => {
        const user = prev.users.find((u) => u.id === id);
        if (!user) return prev;
        return withAudit(
          {
            ...prev,
            users: prev.users.map((u) =>
              u.id === id
                ? {
                    ...u,
                    kyc: status,
                    reviewedAt: new Date().toISOString(),
                    rejectionReason: status === "rejected" ? reason : undefined,
                  }
                : u,
            ),
          },
          `${status === "verified" ? "Approved" : "Rejected"} KYC for ${user.name}`,
        );
      }),
    [patch],
  );

  const updatePlan = useCallback<OpsActions["updatePlan"]>(
    (id, planPatch) =>
      patch((prev) => {
        const plan = prev.plans.find((p) => p.id === id);
        if (!plan) return prev;
        const changes = [
          planPatch.status && planPatch.status !== plan.status
            ? planPatch.status === "paused"
              ? "paused"
              : "resumed"
            : null,
          planPatch.travelYear && planPatch.travelYear !== plan.travelYear
            ? `moved to ${planPatch.travelYear}`
            : null,
        ].filter(Boolean);
        if (changes.length === 0) return prev;
        return withAudit(
          { ...prev, plans: prev.plans.map((p) => (p.id === id ? { ...p, ...planPatch } : p)) },
          `Plan for ${plan.beneficiaryName} ${changes.join(" and ")}`,
        );
      }),
    [patch],
  );

  const createTicket = useCallback<OpsActions["createTicket"]>(
    (input) => {
      const now = new Date().toISOString();
      const ticket: SupportTicket = {
        id: `tk-${Math.floor(1100 + Math.random() * 8900)}`,
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || undefined,
        topic: input.topic,
        status: "open",
        createdAt: now,
        messages: [
          { id: uid("tm"), from: "customer", author: input.name.trim(), body: input.message.trim(), at: now },
        ],
      };
      patch((prev) => ({ ...prev, tickets: [ticket, ...prev.tickets] }));
      return ticket;
    },
    [patch],
  );

  const replyTicket = useCallback<OpsActions["replyTicket"]>(
    (id, body) =>
      patch((prev) => {
        const author = adminName(prev);
        return withAudit(
          {
            ...prev,
            tickets: prev.tickets.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: "pending",
                    assigneeId: t.assigneeId ?? prev.sessionAdminId ?? undefined,
                    messages: [
                      ...t.messages,
                      { id: uid("tm"), from: "admin", author, body: body.trim(), at: new Date().toISOString() },
                    ],
                  }
                : t,
            ),
          },
          `Replied to ticket ${id}`,
        );
      }),
    [patch],
  );

  const setTicketStatus = useCallback<OpsActions["setTicketStatus"]>(
    (id, status) =>
      patch((prev) =>
        withAudit(
          { ...prev, tickets: prev.tickets.map((t) => (t.id === id ? { ...t, status } : t)) },
          `${status === "closed" ? "Closed" : status === "open" ? "Reopened" : "Updated"} ticket ${id}`,
        ),
      ),
    [patch],
  );

  const assignTicket = useCallback<OpsActions["assignTicket"]>(
    (id, adminId) =>
      patch((prev) => {
        const who = prev.admins.find((a) => a.id === adminId)?.name ?? "nobody";
        return withAudit(
          {
            ...prev,
            tickets: prev.tickets.map((t) => (t.id === id ? { ...t, assigneeId: adminId } : t)),
          },
          `Assigned ticket ${id} to ${who}`,
        );
      }),
    [patch],
  );

  const setVendorStatus = useCallback<OpsActions["setVendorStatus"]>(
    (id, status) =>
      patch((prev) => {
        const vendor = prev.vendors.find((v) => v.id === id);
        if (!vendor) return prev;
        const verb =
          status === "approved"
            ? vendor.status === "suspended"
              ? "Reinstated"
              : "Approved"
            : status === "suspended"
              ? "Suspended"
              : "Rejected";
        return withAudit(
          { ...prev, vendors: prev.vendors.map((v) => (v.id === id ? { ...v, status } : v)) },
          `${verb} vendor ${vendor.name}`,
        );
      }),
    [patch],
  );

  const toggleProductHidden = useCallback<OpsActions["toggleProductHidden"]>(
    (productId, productName) =>
      patch((prev) => {
        const hidden = prev.hiddenProducts.includes(productId);
        return withAudit(
          {
            ...prev,
            hiddenProducts: hidden
              ? prev.hiddenProducts.filter((p) => p !== productId)
              : [...prev.hiddenProducts, productId],
          },
          `${hidden ? "Relisted" : "Hid"} product ${productName}`,
        );
      }),
    [patch],
  );

  const resolveDispute = useCallback<OpsActions["resolveDispute"]>(
    (id, outcome, note) =>
      patch((prev) =>
        withAudit(
          {
            ...prev,
            disputes: prev.disputes.map((d) =>
              d.id === id ? { ...d, status: outcome, resolutionNote: note.trim() } : d,
            ),
          },
          `${outcome === "refunded" ? "Refunded buyer on" : "Released escrow on"} dispute ${id}`,
        ),
      ),
    [patch],
  );

  const updatePackage = useCallback<OpsActions["updatePackage"]>(
    (id, pkgPatch) =>
      patch((prev) => {
        const pkg = prev.packages.find((p) => p.id === id);
        if (!pkg) return prev;
        return withAudit(
          { ...prev, packages: prev.packages.map((p) => (p.id === id ? { ...p, ...pkgPatch } : p)) },
          `Updated package ${pkg.name}`,
        );
      }),
    [patch],
  );

  const saveFaq = useCallback<OpsActions["saveFaq"]>(
    (faq) =>
      patch((prev) => {
        if (faq.id) {
          return withAudit(
            {
              ...prev,
              faqs: prev.faqs.map((f) => (f.id === faq.id ? { ...f, ...faq, id: f.id } : f)),
            },
            `Edited FAQ "${faq.question}"`,
          );
        }
        return withAudit(
          { ...prev, faqs: [...prev.faqs, { ...faq, id: uid("faq") }] },
          `Added FAQ "${faq.question}"`,
        );
      }),
    [patch],
  );

  const removeFaq = useCallback<OpsActions["removeFaq"]>(
    (id) =>
      patch((prev) => {
        const faq = prev.faqs.find((f) => f.id === id);
        return withAudit(
          { ...prev, faqs: prev.faqs.filter((f) => f.id !== id) },
          `Removed FAQ "${faq?.question ?? id}"`,
        );
      }),
    [patch],
  );

  const publishAnnouncement = useCallback<OpsActions["publishAnnouncement"]>(
    (input) =>
      patch((prev) =>
        withAudit(
          {
            ...prev,
            announcements: [
              {
                ...input,
                id: uid("oann"),
                date: new Date().toISOString(),
                author: adminName(prev),
              },
              ...prev.announcements,
            ],
          },
          `Published announcement "${input.title}"`,
        ),
      ),
    [patch],
  );

  const removeAnnouncement = useCallback<OpsActions["removeAnnouncement"]>(
    (id) =>
      patch((prev) => {
        const ann = prev.announcements.find((a) => a.id === id);
        return withAudit(
          { ...prev, announcements: prev.announcements.filter((a) => a.id !== id) },
          `Removed announcement "${ann?.title ?? id}"`,
        );
      }),
    [patch],
  );

  const setSosStatus = useCallback<OpsActions["setSosStatus"]>(
    (id, status, respondent) =>
      patch((prev) => {
        const alert = prev.sos.find((s) => s.id === id);
        if (!alert) return prev;
        return withAudit(
          {
            ...prev,
            sos: prev.sos.map((s) =>
              s.id === id ? { ...s, status, respondent: respondent?.trim() || s.respondent } : s,
            ),
          },
          `${status === "resolved" ? "Resolved" : "Acknowledged"} SOS from ${alert.pilgrim}`,
        );
      }),
    [patch],
  );

  const saveProduct = useCallback<OpsActions["saveProduct"]>(
    (input) =>
      patch((prev) => {
        if (input.id) {
          return withAudit(
            {
              ...prev,
              products: prev.products.map((p) =>
                p.id === input.id ? { ...p, ...input, id: p.id } : p,
              ),
            },
            `Edited product ${input.name}`,
          );
        }
        const product: Product = { ...input, id: uid("prd") };
        return withAudit(
          { ...prev, products: [product, ...prev.products] },
          `Posted product ${product.name}`,
        );
      }),
    [patch],
  );

  const deleteProduct = useCallback<OpsActions["deleteProduct"]>(
    (id) =>
      patch((prev) => {
        const product = prev.products.find((p) => p.id === id);
        return withAudit(
          {
            ...prev,
            products: prev.products.filter((p) => p.id !== id),
            hiddenProducts: prev.hiddenProducts.filter((h) => h !== id),
          },
          `Deleted product ${product?.name ?? id}`,
        );
      }),
    [patch],
  );

  const saveVendor = useCallback<OpsActions["saveVendor"]>(
    (input) =>
      patch((prev) => {
        if (input.id) {
          return withAudit(
            {
              ...prev,
              vendors: prev.vendors.map((v) => (v.id === input.id ? { ...v, ...input, id: v.id } : v)),
            },
            `Edited vendor ${input.name}`,
          );
        }
        const vendor: OpsVendor = { ...input, id: uid("vnd") };
        return withAudit(
          { ...prev, vendors: [...prev.vendors, vendor] },
          `Added vendor ${vendor.name}`,
        );
      }),
    [patch],
  );

  const saveChecklistItem = useCallback<OpsActions["saveChecklistItem"]>(
    (input) =>
      patch((prev) => {
        if (input.id) {
          return withAudit(
            {
              ...prev,
              checklist: prev.checklist.map((c) => (c.id === input.id ? { ...c, ...input, id: c.id } : c)),
            },
            `Edited checklist item "${input.label}"`,
          );
        }
        return withAudit(
          { ...prev, checklist: [...prev.checklist, { ...input, id: uid("cl") }] },
          `Added checklist item "${input.label}"`,
        );
      }),
    [patch],
  );

  const removeChecklistItem = useCallback<OpsActions["removeChecklistItem"]>(
    (id) =>
      patch((prev) => {
        const item = prev.checklist.find((c) => c.id === id);
        return withAudit(
          { ...prev, checklist: prev.checklist.filter((c) => c.id !== id) },
          `Removed checklist item "${item?.label ?? id}"`,
        );
      }),
    [patch],
  );

  const updateGroup = useCallback<OpsActions["updateGroup"]>(
    (groupPatch) =>
      patch((prev) =>
        withAudit({ ...prev, group: { ...prev.group, ...groupPatch } }, "Updated group details"),
      ),
    [patch],
  );

  const updateDay = useCallback<OpsActions["updateDay"]>(
    (dayId, dayPatch) =>
      patch((prev) => {
        const day = prev.itinerary.find((d) => d.id === dayId);
        if (!day) return prev;
        return withAudit(
          {
            ...prev,
            itinerary: prev.itinerary.map((d) => (d.id === dayId ? { ...d, ...dayPatch } : d)),
          },
          `Edited itinerary day ${day.dayNumber}`,
        );
      }),
    [patch],
  );

  const saveActivity = useCallback<OpsActions["saveActivity"]>(
    (dayId, input) =>
      patch((prev) => {
        const day = prev.itinerary.find((d) => d.id === dayId);
        if (!day) return prev;
        const activities = input.id
          ? day.activities.map((a) => (a.id === input.id ? { ...a, ...input, id: a.id } : a))
          : [...day.activities, { ...input, id: uid("act") }];
        activities.sort((a, b) => a.time.localeCompare(b.time));
        return withAudit(
          {
            ...prev,
            itinerary: prev.itinerary.map((d) => (d.id === dayId ? { ...d, activities } : d)),
          },
          `${input.id ? "Edited" : "Added"} "${input.title}" on day ${day.dayNumber}`,
        );
      }),
    [patch],
  );

  const removeActivity = useCallback<OpsActions["removeActivity"]>(
    (dayId, activityId) =>
      patch((prev) => {
        const day = prev.itinerary.find((d) => d.id === dayId);
        if (!day) return prev;
        const activity = day.activities.find((a) => a.id === activityId);
        return withAudit(
          {
            ...prev,
            itinerary: prev.itinerary.map((d) =>
              d.id === dayId
                ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) }
                : d,
            ),
          },
          `Removed "${activity?.title ?? activityId}" from day ${day.dayNumber}`,
        );
      }),
    [patch],
  );

  const resetOps = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    persistedCache = OPS_INITIAL_STATE;
    setEdited(OPS_INITIAL_STATE);
  }, []);

  const value = useMemo<OpsStore>(
    () => ({
      ...state,
      hydrated,
      currentAdmin,
      isAdminEmail,
      adminLogin,
      adminLogout,
      addAdmin,
      removeAdmin,
      logAction,
      setUserKyc,
      updatePlan,
      createTicket,
      replyTicket,
      setTicketStatus,
      assignTicket,
      setVendorStatus,
      toggleProductHidden,
      resolveDispute,
      updatePackage,
      saveFaq,
      removeFaq,
      publishAnnouncement,
      removeAnnouncement,
      setSosStatus,
      saveProduct,
      deleteProduct,
      saveVendor,
      saveChecklistItem,
      removeChecklistItem,
      updateGroup,
      updateDay,
      saveActivity,
      removeActivity,
      resetOps,
    }),
    [
      state,
      hydrated,
      currentAdmin,
      isAdminEmail,
      adminLogin,
      adminLogout,
      addAdmin,
      removeAdmin,
      logAction,
      setUserKyc,
      updatePlan,
      createTicket,
      replyTicket,
      setTicketStatus,
      assignTicket,
      setVendorStatus,
      toggleProductHidden,
      resolveDispute,
      updatePackage,
      saveFaq,
      removeFaq,
      publishAnnouncement,
      removeAnnouncement,
      setSosStatus,
      saveProduct,
      deleteProduct,
      saveVendor,
      saveChecklistItem,
      removeChecklistItem,
      updateGroup,
      updateDay,
      saveActivity,
      removeActivity,
      resetOps,
    ],
  );

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps(): OpsStore {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used inside <OpsProvider>");
  return ctx;
}
