import type { HajjPackage } from "../types";

/**
 * Indicative NAHCON-benchmarked Hajj fares. Figures are illustrative and are
 * refreshed each season once the national Hajj fare is gazetted.
 */
export const HAJJ_PACKAGES: HajjPackage[] = [
  {
    id: "pkg-standard",
    name: "Baytullah Standard",
    tier: "Standard",
    priceNGN: 8_750_000,
    operator: "State Pilgrims Welfare Board",
    nights: { makkah: 26, madinah: 8 },
    hotelDistance: "1.8km from Masjid al-Haram · shuttle provided",
    inclusions: [
      "Return economy flight (Lagos / Kano / Abuja)",
      "Visa, NAHCON levy & Saudi service fees",
      "Shared accommodation (4 per room)",
      "Mina & Arafat tents — Muassasah category C",
      "Full-board feeding in Makkah & Madinah",
      "Group Mutawwif and Nigerian medical team",
    ],
    highlight: "Most subscribed plan",
  },
  {
    id: "pkg-premium",
    name: "Sakinah Premium",
    tier: "Premium",
    priceNGN: 11_400_000,
    operator: "Al-Amanah Travels & Tours",
    nights: { makkah: 24, madinah: 8 },
    hotelDistance: "600m from Masjid al-Haram · walking distance",
    inclusions: [
      "Return flight with 46kg luggage allowance",
      "Visa, NAHCON levy & Saudi service fees",
      "Triple-share 4-star accommodation",
      "Upgraded Mina tent, category B with cooling",
      "Buffet feeding & daily Zamzam allocation",
      "Dedicated Hausa / Yoruba speaking guide",
      "Airport-to-hotel private transfer",
    ],
  },
  {
    id: "pkg-executive",
    name: "Kiswah Executive",
    tier: "Executive",
    priceNGN: 15_900_000,
    operator: "Al-Amanah Travels & Tours",
    nights: { makkah: 22, madinah: 7 },
    hotelDistance: "Haram-view tower · direct courtyard access",
    inclusions: [
      "Return business-class flight",
      "Visa, NAHCON levy & Saudi service fees",
      "Double-share 5-star Haram-view rooms",
      "VIP Mina camp, category A with en-suite",
      "À la carte feeding & 24/7 concierge",
      "Private scholar-led ritual guidance",
      "Ziyarah tour of Makkah & Madinah sites",
      "Priority Jamarat access via upper level",
    ],
    highlight: "Best for elderly pilgrims",
  },
];

export function packageById(id: string): HajjPackage {
  return HAJJ_PACKAGES.find((p) => p.id === id) ?? HAJJ_PACKAGES[0];
}
