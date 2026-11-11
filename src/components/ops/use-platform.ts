"use client";

import { useCallback, useMemo } from "react";
import { useApp } from "@/lib/store";
import { useOps } from "@/lib/ops/store";
import type { OpsPlan, OpsSosAlert, PlatformUser, SosStatus } from "@/lib/ops/types";
import type { KycStatus, PlanStatus, TravelYear } from "@/lib/types";

/**
 * The console works on seeded platform records plus the pilgrim account that
 * is live in this browser, so actions taken here (approving KYC, pausing a
 * plan, closing an SOS) visibly change the pilgrim app too.
 */

export interface UserRow extends PlatformUser {
  live?: boolean;
}

export interface PlanRow extends OpsPlan {
  ownerName: string;
  live?: boolean;
}

export interface SosRow extends OpsSosAlert {
  live?: boolean;
}

const LIVE_PREFIX = "live-";

export function usePlatformUsers(): UserRow[] {
  const { user } = useApp();
  const { users } = useOps();
  return useMemo(() => {
    const live: UserRow = {
      id: `${LIVE_PREFIX}${user.id}`,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      phone: user.phone,
      state: user.state,
      joinedAt: user.createdAt,
      nin: user.kyc.nin,
      passportNumber: user.kyc.passportNumber,
      kyc: user.kyc.status,
      submittedAt: user.kyc.submittedAt,
      reviewedAt: user.kyc.verifiedAt,
      live: true,
    };
    return [live, ...users];
  }, [user, users]);
}

export function usePlatformPlans(): PlanRow[] {
  const { user, plans: livePlans } = useApp();
  const { plans, users } = useOps();
  return useMemo(() => {
    const owner = `${user.firstName} ${user.lastName}`.trim();
    const live: PlanRow[] = livePlans.map((p) => ({
      id: p.id,
      userId: `${LIVE_PREFIX}${user.id}`,
      beneficiaryName: p.beneficiaryName,
      packageId: p.packageId,
      travelYear: p.travelYear,
      frequency: p.frequency,
      amountPerCycle: p.amountPerCycle,
      balance: p.balance,
      status: p.status,
      ownerName: owner,
      live: true,
    }));
    const seeded: PlanRow[] = plans.map((p) => ({
      ...p,
      ownerName: users.find((u) => u.id === p.userId)?.name ?? "Unknown",
    }));
    return [...live, ...seeded];
  }, [user, livePlans, plans, users]);
}

export function usePlatformSos(): SosRow[] {
  const { user, sosEvents } = useApp();
  const { sos, group } = useOps();
  return useMemo(() => {
    const pilgrim = `${user.firstName} ${user.lastName}`.trim();
    const live: SosRow[] = sosEvents.map((e) => ({
      id: e.id,
      pilgrim,
      group: group.name,
      category: e.category,
      note: e.note,
      location: e.location,
      raisedAt: e.raisedAt,
      status: e.status,
      respondent: e.respondent,
      live: true,
    }));
    return [...live, ...sos].sort(
      (a, b) => new Date(b.raisedAt).getTime() - new Date(a.raisedAt).getTime(),
    );
  }, [user, sosEvents, sos, group.name]);
}

/** Actions that route to the pilgrim store for live records and the ops store otherwise. */
export function usePlatformActions() {
  const app = useApp();
  const ops = useOps();

  const setKyc = useCallback(
    (row: UserRow, status: KycStatus, reason?: string) => {
      if (!row.live) {
        ops.setUserKyc(row.id, status, reason);
        return;
      }
      app.updateUser({
        kyc: {
          ...app.user.kyc,
          status,
          verifiedAt: status === "verified" ? new Date().toISOString() : undefined,
        },
      });
      ops.logAction(
        `${status === "verified" ? "Approved" : "Rejected"} KYC for ${row.name}${reason ? ` (${reason})` : ""}`,
      );
    },
    [app, ops],
  );

  const changePlan = useCallback(
    (row: PlanRow, next: { status: PlanStatus; travelYear: TravelYear }) => {
      if (!row.live) {
        ops.updatePlan(row.id, next);
        return;
      }
      const changes: string[] = [];
      if (next.status !== row.status) changes.push(next.status === "paused" ? "paused" : "resumed");
      if (next.travelYear !== row.travelYear) changes.push(`moved to ${next.travelYear}`);
      if (changes.length === 0) return;
      app.updatePlan(row.id, next);
      ops.logAction(`Plan for ${row.beneficiaryName} ${changes.join(" and ")}`);
    },
    [app, ops],
  );

  const respondSos = useCallback(
    (row: SosRow, status: SosStatus, respondent: string) => {
      if (!row.live) {
        ops.setSosStatus(row.id, status, respondent);
        return;
      }
      app.respondToSos(row.id, status, respondent.trim() || row.respondent);
      ops.logAction(
        `${status === "resolved" ? "Resolved" : "Acknowledged"} SOS from ${row.pilgrim}`,
      );
    },
    [app, ops],
  );

  return { setKyc, changePlan, respondSos };
}
