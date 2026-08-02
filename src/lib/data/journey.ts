import type { GalleryItem, JournalEntry, Referral } from "../types";

export const GALLERY: GalleryItem[] = [
  {
    id: "gal-01",
    type: "photo",
    caption: "First sight of the Ka'bah after Isha",
    location: "Masjid al-Haram, Makkah",
    date: "2026-07-11T20:40:00.000Z",
    tone: "from-forest-700 via-forest-800 to-forest-950",
    icon: "kaaba",
  },
  {
    id: "gal-02",
    type: "photo",
    caption: "Dawn over the Prophet's Mosque",
    location: "Masjid an-Nabawi, Madinah",
    date: "2026-07-05T04:35:00.000Z",
    tone: "from-gold-400 via-gold-600 to-forest-900",
    icon: "mosque",
  },
  {
    id: "gal-03",
    type: "video",
    caption: "Talbiyah on the coach to Makkah",
    location: "Highway 15",
    date: "2026-07-09T11:20:00.000Z",
    tone: "from-sky-700 via-forest-800 to-forest-950",
    icon: "video",
    durationSec: 47,
  },
  {
    id: "gal-04",
    type: "photo",
    caption: "Our tent on Street 56",
    location: "Mina",
    date: "2026-07-16T17:05:00.000Z",
    tone: "from-teal-700 via-forest-800 to-forest-950",
    icon: "tent",
  },
  {
    id: "gal-05",
    type: "photo",
    caption: "The plain at Arafat before Dhuhr",
    location: "Arafat",
    date: "2026-07-17T11:50:00.000Z",
    tone: "from-amber-600 via-amber-800 to-forest-950",
    icon: "sun",
  },
  {
    id: "gal-06",
    type: "photo",
    caption: "Pebbles gathered under the sky",
    location: "Muzdalifah",
    date: "2026-07-17T22:15:00.000Z",
    tone: "from-indigo-800 via-forest-900 to-forest-950",
    icon: "mountain",
  },
  {
    id: "gal-07",
    type: "video",
    caption: "Walking to the Jamarat with the group",
    location: "Jamarat Bridge, Level 3",
    date: "2026-07-18T06:45:00.000Z",
    tone: "from-rose-700 via-forest-800 to-forest-950",
    icon: "video",
    durationSec: 62,
  },
  {
    id: "gal-08",
    type: "photo",
    caption: "Zamzam after Tawaf al-Ifadah",
    location: "Masjid al-Haram",
    date: "2026-07-18T16:30:00.000Z",
    tone: "from-sky-600 via-sky-800 to-forest-950",
    icon: "droplets",
  },
  {
    id: "gal-09",
    type: "photo",
    caption: "Ajwa dates from the Madinah farms",
    location: "Quba Road, Madinah",
    date: "2026-07-06T14:10:00.000Z",
    tone: "from-amber-700 via-orange-800 to-forest-950",
    icon: "gift",
  },
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "jrn-01",
    title: "The night I finally saw it",
    body: "We came through King Abdulaziz Gate just after Isha and I could not move. Twenty-two years of intention, of counting and recounting, of asking Allah for a way — and then it was simply there in front of me. I did not have a single word of the du'a I had rehearsed. I only wept. Halimah held my arm until I could walk again.",
    date: "2026-07-11T22:15:00.000Z",
    stage: "Makkah",
    mood: "humbled",
    shared: true,
  },
  {
    id: "jrn-02",
    title: "What Madinah teaches you about patience",
    body: "Our Rawdah permit came for 09:00 and we queued for two hours. Nobody complained. An elderly man from Kano gave up his slot for a woman who had come alone from Sokoto. I have never seen generosity look so ordinary.",
    date: "2026-07-05T13:00:00.000Z",
    stage: "Madinah",
    mood: "reflective",
    shared: true,
  },
  {
    id: "jrn-03",
    title: "Arafat — the longest afternoon of my life",
    body: "Forty-six degrees, no shade worth the name, and the best hours I have ever spent. I asked for my mother, for my children, for the people who told me to pray for them and for the ones who were too shy to ask. When the sun finally set, I felt lighter than I have felt in years.",
    date: "2026-07-17T20:00:00.000Z",
    stage: "Arafat",
    mood: "grateful",
    shared: false,
  },
  {
    id: "jrn-04",
    title: "Small mercies in Mina",
    body: "A Bangladeshi brother in the next tent noticed my blistered feet and gave me his spare sandals without a word of shared language between us. Tuwo from the Nigerian kitchen tasted like home. Little kindnesses carry you through the days of Tashriq.",
    date: "2026-07-19T21:30:00.000Z",
    stage: "Mina",
    mood: "joyful",
    shared: true,
  },
];

export const REFERRALS: Referral[] = [
  { id: "ref-01", name: "Musa Bello", joinedAt: "2026-06-18T00:00:00.000Z", status: "saving", rewardNGN: 15_000 },
  { id: "ref-02", name: "Yakubu Danladi", joinedAt: "2026-05-02T00:00:00.000Z", status: "saving", rewardNGN: 15_000 },
  { id: "ref-03", name: "Zainab Abubakar", joinedAt: "2026-04-11T00:00:00.000Z", status: "registered", rewardNGN: 5_000 },
  { id: "ref-04", name: "Abdulganiyu Salami", joinedAt: "2026-03-27T00:00:00.000Z", status: "saving", rewardNGN: 15_000 },
  { id: "ref-05", name: "Hauwa Mohammed", joinedAt: "2026-02-14T00:00:00.000Z", status: "invited", rewardNGN: 0 },
];

export const MOOD_META: Record<
  JournalEntry["mood"],
  { label: string; tone: string }
> = {
  grateful: {
    label: "Grateful",
    tone: "bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-200",
  },
  reflective: {
    label: "Reflective",
    tone: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  joyful: {
    label: "Joyful",
    tone: "bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-200",
  },
  humbled: {
    label: "Humbled",
    tone: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  },
};
