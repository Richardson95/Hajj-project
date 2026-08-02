"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHydrated } from "./client-hooks";
import { DEMO_ORDERS, productById } from "./data/marketplace";
import {
  DEMO_PLANS,
  DEMO_TRANSACTIONS,
  DEMO_USER,
  EMERGENCY_CONTACTS,
} from "./data/account";
import { GALLERY, JOURNAL_ENTRIES } from "./data/journey";
import { NOTIFICATIONS, SOS_HISTORY } from "./data/comms";
import { packageById } from "./data/packages";
import type {
  AppNotification,
  CartLine,
  EmergencyContact,
  GalleryItem,
  JournalEntry,
  Order,
  SavingsPlan,
  SosEvent,
  Transaction,
  TransactionType,
  User,
  UserRole,
} from "./types";

const STORAGE_KEY = "hajjpath.state.v2";

export interface AppState {
  authenticated: boolean;
  user: User;
  activeRole: UserRole;
  plans: SavingsPlan[];
  transactions: Transaction[];
  cart: CartLine[];
  orders: Order[];
  savedProducts: string[];
  checklistDone: string[];
  activityDone: string[];
  journal: JournalEntry[];
  gallery: GalleryItem[];
  notifications: AppNotification[];
  sosEvents: SosEvent[];
  emergencyContacts: EmergencyContact[];
}

const INITIAL_STATE: AppState = {
  authenticated: false,
  user: DEMO_USER,
  activeRole: "pilgrim",
  plans: DEMO_PLANS,
  transactions: DEMO_TRANSACTIONS,
  cart: [],
  orders: DEMO_ORDERS,
  savedProducts: ["prd-061"],
  checklistDone: ["cl-1", "cl-2", "cl-5", "cl-6", "cl-18", "cl-23"],
  activityDone: [],
  journal: JOURNAL_ENTRIES,
  gallery: GALLERY,
  notifications: NOTIFICATIONS,
  sosEvents: SOS_HISTORY,
  emergencyContacts: EMERGENCY_CONTACTS,
};

export interface NewPlanInput {
  beneficiaryName: string;
  relationship: SavingsPlan["relationship"];
  packageId: string;
  travelYear: SavingsPlan["travelYear"];
  frequency: SavingsPlan["frequency"];
  amountPerCycle: number;
  bankName: string;
  autoDebit: boolean;
  openingDeposit?: number;
}

interface AppActions {
  hydrated: boolean;
  login: (partial?: Partial<User>) => void;
  logout: () => void;
  setActiveRole: (role: UserRole) => void;
  updateUser: (patch: Partial<User>) => void;
  addPlan: (input: NewPlanInput) => SavingsPlan;
  updatePlan: (id: string, patch: Partial<SavingsPlan>) => void;
  deposit: (
    planId: string,
    amount: number,
    channel: Transaction["channel"],
    type?: TransactionType,
  ) => void;
  addToCart: (productId: string, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleSaved: (productId: string) => void;
  placeOrder: (deliverTo: string) => Order | null;
  toggleChecklist: (id: string) => void;
  toggleActivity: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void;
  removeJournalEntry: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, "id">) => void;
  removeGalleryItem: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  raiseSos: (category: SosEvent["category"], note: string, location: string) => SosEvent;
  resolveSos: (id: string) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (id: string) => void;
  resetDemo: () => void;
}

type Store = AppState & AppActions;

const AppContext = createContext<Store | null>(null);

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

function reference(): string {
  return `HP-TR-${Math.floor(100000 + Math.random() * 899999)}`;
}

/**
 * The persisted snapshot is read once and cached so it stays referentially
 * stable across renders. Reading happens after hydration, never during the
 * server render or the hydration pass, so markup always matches.
 */
let persistedCache: AppState | null = null;

function readPersisted(): AppState {
  if (persistedCache) return persistedCache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    persistedCache = raw
      ? { ...INITIAL_STATE, ...(JSON.parse(raw) as Partial<AppState>) }
      : INITIAL_STATE;
  } catch {
    /* corrupted payload — fall back to the seeded demo state */
    persistedCache = INITIAL_STATE;
  }
  return persistedCache;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const [edited, setEdited] = useState<AppState | null>(null);

  const state = edited ?? (hydrated ? readPersisted() : INITIAL_STATE);

  /* Persist every change. Writing to storage is a side effect with no setState. */
  useEffect(() => {
    if (!hydrated || !edited) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edited));
      persistedCache = edited;
    } catch {
      /* quota or private mode — the app still works, just without persistence */
    }
  }, [edited, hydrated]);

  const patch = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setEdited((prev) => updater(prev ?? readPersisted()));
    },
    [],
  );

  const login = useCallback<AppActions["login"]>(
    (partial) => {
      patch((prev) => ({
        ...prev,
        authenticated: true,
        user: partial ? { ...prev.user, ...partial } : prev.user,
      }));
    },
    [patch],
  );

  const logout = useCallback(() => {
    patch((prev) => ({ ...prev, authenticated: false, activeRole: "pilgrim" }));
  }, [patch]);

  const setActiveRole = useCallback<AppActions["setActiveRole"]>(
    (role) => patch((prev) => ({ ...prev, activeRole: role })),
    [patch],
  );

  const updateUser = useCallback<AppActions["updateUser"]>(
    (userPatch) =>
      patch((prev) => ({ ...prev, user: { ...prev.user, ...userPatch } })),
    [patch],
  );

  const addPlan = useCallback<AppActions["addPlan"]>(
    (input) => {
      const plan: SavingsPlan = {
        id: uid("pln"),
        ownerId: state.user.id,
        beneficiaryName: input.beneficiaryName,
        relationship: input.relationship,
        packageId: input.packageId,
        travelYear: input.travelYear,
        frequency: input.frequency,
        amountPerCycle: input.amountPerCycle,
        balance: input.openingDeposit ?? 0,
        startDate: new Date().toISOString(),
        autoDebit: input.autoDebit,
        status: "active",
        bankName: input.bankName,
        isPrimary: false,
      };
      patch((prev) => {
        const opening = input.openingDeposit ?? 0;
        const txns: Transaction[] = opening
          ? [
              {
                id: uid("txn"),
                planId: plan.id,
                type: "deposit",
                amount: opening,
                status: "successful",
                reference: reference(),
                channel: "Virtual Account",
                date: new Date().toISOString(),
                narration: `Opening deposit — ${plan.beneficiaryName}`,
              },
              ...prev.transactions,
            ]
          : prev.transactions;
        return {
          ...prev,
          plans: prev.plans.length === 0
            ? [{ ...plan, isPrimary: true }]
            : [...prev.plans, plan],
          transactions: txns,
        };
      });
      return plan;
    },
    [patch, state.user.id],
  );

  const updatePlan = useCallback<AppActions["updatePlan"]>(
    (id, planPatch) =>
      patch((prev) => ({
        ...prev,
        plans: prev.plans.map((p) => (p.id === id ? { ...p, ...planPatch } : p)),
      })),
    [patch],
  );

  const deposit = useCallback<AppActions["deposit"]>(
    (planId, amount, channel, type = "deposit") => {
      patch((prev) => {
        const plan = prev.plans.find((p) => p.id === planId);
        if (!plan || amount <= 0) return prev;
        const txn: Transaction = {
          id: uid("txn"),
          planId,
          type,
          amount,
          status: "successful",
          reference: reference(),
          channel,
          date: new Date().toISOString(),
          narration:
            type === "referral-bonus"
              ? "Referral reward credited"
              : `Contribution — ${plan.beneficiaryName}`,
        };
        const nextBalance = plan.balance + amount;
        const target = packageById(plan.packageId).priceNGN;
        const notifications: AppNotification[] =
          nextBalance >= target && plan.balance < target
            ? [
                {
                  id: uid("ntf"),
                  title: "Goal reached — you are eligible to apply",
                  body: `${plan.beneficiaryName} has fully funded the ${packageById(plan.packageId).name} package for ${plan.travelYear}.`,
                  kind: "savings",
                  date: new Date().toISOString(),
                  read: false,
                  href: "/app/savings",
                },
                ...prev.notifications,
              ]
            : prev.notifications;
        return {
          ...prev,
          plans: prev.plans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  balance: nextBalance,
                  status: nextBalance >= target ? "completed" : p.status,
                }
              : p,
          ),
          transactions: [txn, ...prev.transactions],
          notifications,
        };
      });
    },
    [patch],
  );

  const addToCart = useCallback<AppActions["addToCart"]>(
    (productId, qty = 1) =>
      patch((prev) => {
        const existing = prev.cart.find((l) => l.productId === productId);
        return {
          ...prev,
          cart: existing
            ? prev.cart.map((l) =>
                l.productId === productId ? { ...l, qty: l.qty + qty } : l,
              )
            : [...prev.cart, { productId, qty }],
        };
      }),
    [patch],
  );

  const setCartQty = useCallback<AppActions["setCartQty"]>(
    (productId, qty) =>
      patch((prev) => ({
        ...prev,
        cart:
          qty <= 0
            ? prev.cart.filter((l) => l.productId !== productId)
            : prev.cart.map((l) => (l.productId === productId ? { ...l, qty } : l)),
      })),
    [patch],
  );

  const removeFromCart = useCallback<AppActions["removeFromCart"]>(
    (productId) =>
      patch((prev) => ({
        ...prev,
        cart: prev.cart.filter((l) => l.productId !== productId),
      })),
    [patch],
  );

  const clearCart = useCallback(() => patch((prev) => ({ ...prev, cart: [] })), [patch]);

  const toggleSaved = useCallback<AppActions["toggleSaved"]>(
    (productId) =>
      patch((prev) => ({
        ...prev,
        savedProducts: prev.savedProducts.includes(productId)
          ? prev.savedProducts.filter((id) => id !== productId)
          : [...prev.savedProducts, productId],
      })),
    [patch],
  );

  const placeOrder = useCallback<AppActions["placeOrder"]>(
    (deliverTo) => {
      if (state.cart.length === 0) return null;
      const totalSAR = state.cart.reduce((sum, line) => {
        const product = productById(line.productId);
        return sum + (product ? product.priceSAR * line.qty : 0);
      }, 0);
      const order: Order = {
        id: uid("ord"),
        lines: state.cart,
        totalSAR,
        status: "escrow-held",
        placedAt: new Date().toISOString(),
        deliverTo,
        courier: "Assigning a rider",
        eta: "Confirmed within 30 minutes",
      };
      patch((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
        cart: [],
        notifications: [
          {
            id: uid("ntf"),
            title: "Order placed — funds held in escrow",
            body: `${order.lines.length} item(s) for delivery to ${deliverTo}. Payment releases only when you confirm delivery.`,
            kind: "order",
            date: order.placedAt,
            read: false,
            href: "/app/marketplace/orders",
          },
          ...prev.notifications,
        ],
      }));
      return order;
    },
    [patch, state.cart],
  );

  const toggleChecklist = useCallback<AppActions["toggleChecklist"]>(
    (id) =>
      patch((prev) => ({
        ...prev,
        checklistDone: prev.checklistDone.includes(id)
          ? prev.checklistDone.filter((x) => x !== id)
          : [...prev.checklistDone, id],
      })),
    [patch],
  );

  const toggleActivity = useCallback<AppActions["toggleActivity"]>(
    (id) =>
      patch((prev) => ({
        ...prev,
        activityDone: prev.activityDone.includes(id)
          ? prev.activityDone.filter((x) => x !== id)
          : [...prev.activityDone, id],
      })),
    [patch],
  );

  const addJournalEntry = useCallback<AppActions["addJournalEntry"]>(
    (entry) =>
      patch((prev) => ({
        ...prev,
        journal: [{ ...entry, id: uid("jrn") }, ...prev.journal],
      })),
    [patch],
  );

  const removeJournalEntry = useCallback<AppActions["removeJournalEntry"]>(
    (id) =>
      patch((prev) => ({ ...prev, journal: prev.journal.filter((j) => j.id !== id) })),
    [patch],
  );

  const addGalleryItem = useCallback<AppActions["addGalleryItem"]>(
    (item) =>
      patch((prev) => ({
        ...prev,
        gallery: [{ ...item, id: uid("gal") }, ...prev.gallery],
      })),
    [patch],
  );

  const removeGalleryItem = useCallback<AppActions["removeGalleryItem"]>(
    (id) =>
      patch((prev) => ({ ...prev, gallery: prev.gallery.filter((g) => g.id !== id) })),
    [patch],
  );

  const markNotificationRead = useCallback<AppActions["markNotificationRead"]>(
    (id) =>
      patch((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
      })),
    [patch],
  );

  const markAllNotificationsRead = useCallback(
    () =>
      patch((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      })),
    [patch],
  );

  const raiseSos = useCallback<AppActions["raiseSos"]>(
    (category, note, location) => {
      const event: SosEvent = {
        id: uid("sos"),
        category,
        note,
        location,
        raisedAt: new Date().toISOString(),
        status: "dispatched",
        respondent: "Locating the nearest responder",
      };
      patch((prev) => ({
        ...prev,
        sosEvents: [event, ...prev.sosEvents],
        notifications: [
          {
            id: uid("ntf"),
            title: "SOS dispatched",
            body: `Your alert was sent to ${prev.emergencyContacts.length} emergency contacts and the HajjPath support desk.`,
            kind: "system",
            date: event.raisedAt,
            read: false,
            href: "/app/sos",
          },
          ...prev.notifications,
        ],
      }));
      return event;
    },
    [patch],
  );

  const resolveSos = useCallback<AppActions["resolveSos"]>(
    (id) =>
      patch((prev) => ({
        ...prev,
        sosEvents: prev.sosEvents.map((e): SosEvent =>
          e.id === id
            ? { ...e, status: "resolved", respondent: "Marked safe by the pilgrim" }
            : e,
        ),
      })),
    [patch],
  );

  const addEmergencyContact = useCallback<AppActions["addEmergencyContact"]>(
    (contact) =>
      patch((prev) => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, { ...contact, id: uid("ec") }],
      })),
    [patch],
  );

  const removeEmergencyContact = useCallback<AppActions["removeEmergencyContact"]>(
    (id) =>
      patch((prev) => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
      })),
    [patch],
  );

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    persistedCache = INITIAL_STATE;
    setEdited(INITIAL_STATE);
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      hydrated,
      login,
      logout,
      setActiveRole,
      updateUser,
      addPlan,
      updatePlan,
      deposit,
      addToCart,
      setCartQty,
      removeFromCart,
      clearCart,
      toggleSaved,
      placeOrder,
      toggleChecklist,
      toggleActivity,
      addJournalEntry,
      removeJournalEntry,
      addGalleryItem,
      removeGalleryItem,
      markNotificationRead,
      markAllNotificationsRead,
      raiseSos,
      resolveSos,
      addEmergencyContact,
      removeEmergencyContact,
      resetDemo,
    }),
    [
      state,
      hydrated,
      login,
      logout,
      setActiveRole,
      updateUser,
      addPlan,
      updatePlan,
      deposit,
      addToCart,
      setCartQty,
      removeFromCart,
      clearCart,
      toggleSaved,
      placeOrder,
      toggleChecklist,
      toggleActivity,
      addJournalEntry,
      removeJournalEntry,
      addGalleryItem,
      removeGalleryItem,
      markNotificationRead,
      markAllNotificationsRead,
      raiseSos,
      resolveSos,
      addEmergencyContact,
      removeEmergencyContact,
      resetDemo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Store {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/** Cart totals, derived rather than stored so they can never drift. */
export function useCartSummary() {
  const { cart } = useApp();
  return useMemo(() => {
    const lines = cart
      .map((line) => {
        const product = productById(line.productId);
        return product ? { product, qty: line.qty } : null;
      })
      .filter((l): l is { product: NonNullable<ReturnType<typeof productById>>; qty: number } => l !== null);
    const itemCount = lines.reduce((n, l) => n + l.qty, 0);
    const subtotalSAR = lines.reduce((n, l) => n + l.product.priceSAR * l.qty, 0);
    const deliverySAR = subtotalSAR === 0 || subtotalSAR >= 200 ? 0 : 15;
    return {
      lines,
      itemCount,
      subtotalSAR,
      deliverySAR,
      totalSAR: subtotalSAR + deliverySAR,
    };
  }, [cart]);
}
