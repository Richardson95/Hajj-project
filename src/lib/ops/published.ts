"use client";

import { useMemo } from "react";
import { ANNOUNCEMENTS } from "../data/comms";
import type { Announcement } from "../types";
import { useOps } from "./store";

/** Seeded broadcasts plus everything the operations team has published. */
export function useAllAnnouncements(): Announcement[] {
  const { announcements } = useOps();
  return useMemo(
    () => [
      ...announcements.map(
        (a): Announcement => ({
          id: a.id,
          title: a.title,
          body: a.body,
          author: a.author,
          authorRole: "HajjPath Operations",
          priority: a.priority,
          date: a.date,
          audience: "All HajjPath pilgrims",
          pinned: a.pinned,
        }),
      ),
      ...ANNOUNCEMENTS,
    ],
    [announcements],
  );
}
