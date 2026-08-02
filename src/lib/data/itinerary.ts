import type { ItineraryDay } from "../types";

/**
 * The 1448 AH / 2027 CE itinerary for the Al-Amanah group.
 * Hijri dates are provisional until the crescent of Dhul-Hijjah is sighted.
 */
export const ITINERARY: ItineraryDay[] = [
  {
    id: "day-01",
    dayNumber: 1,
    gregorian: "2027-04-20",
    hijri: "13 Shawwal 1448",
    stage: "Preparation",
    title: "Departure from Lagos",
    subtitle: "Murtala Muhammed International → Prince Mohammad bin Abdulaziz, Madinah",
    activities: [
      {
        id: "a-101",
        time: "06:00",
        title: "Report at Hajj Terminal",
        description:
          "Present your e-passport, yellow card and HajjPath boarding pass at the NAHCON desk. Luggage limit is 32kg checked plus 7kg cabin.",
        category: "travel",
        location: "Hajj Camp, Ikeja, Lagos",
        durationMins: 180,
      },
      {
        id: "a-102",
        time: "10:30",
        title: "Departure prayer & take-off",
        description:
          "Recite the travel du'a as the aircraft begins to move. Flight time to Madinah is approximately 7 hours 40 minutes.",
        category: "ritual",
        location: "Gate C4",
        durationMins: 460,
        obligation: "Sunnah",
      },
      {
        id: "a-103",
        time: "21:40",
        title: "Arrival & immigration",
        description:
          "Biometrics are captured on arrival. Your group admin collects the room manifest — keep your HajjPath tag visible at all times.",
        category: "travel",
        location: "Madinah Airport, Terminal 1",
        durationMins: 120,
      },
    ],
  },
  {
    id: "day-02",
    dayNumber: 2,
    gregorian: "2027-04-21",
    hijri: "14 Shawwal 1448",
    stage: "Madinah",
    title: "First prayers at Masjid an-Nabawi",
    subtitle: "Settling into the city of the Prophet ﷺ",
    activities: [
      {
        id: "a-201",
        time: "04:20",
        title: "Fajr in the Prophet's Mosque",
        description:
          "Enter with the right foot, sending salutations upon the Prophet ﷺ. A prayer here carries the reward of a thousand elsewhere.",
        category: "ritual",
        location: "Masjid an-Nabawi, Gate 21",
        durationMins: 90,
        obligation: "Fard",
      },
      {
        id: "a-202",
        time: "09:00",
        title: "Rawdah visit (Nusuk permit)",
        description:
          "Your timed Rawdah slot is booked through the Nusuk app. Arrive fifteen minutes early at the assigned gate with your permit QR code.",
        category: "ritual",
        location: "Riyad al-Jannah",
        durationMins: 60,
        obligation: "Sunnah",
      },
      {
        id: "a-203",
        time: "16:00",
        title: "Group orientation briefing",
        description:
          "Meet your Mutawwif, confirm emergency numbers, and register your Find Me tag with the group.",
        category: "briefing",
        location: "Hotel Anwar Al Madinah, Hall B",
        durationMins: 75,
      },
    ],
  },
  {
    id: "day-03",
    dayNumber: 3,
    gregorian: "2027-04-24",
    hijri: "17 Shawwal 1448",
    stage: "Madinah",
    title: "Ziyarah of the historic sites",
    subtitle: "Quba · Uhud · Masjid al-Qiblatayn",
    activities: [
      {
        id: "a-301",
        time: "07:30",
        title: "Masjid Quba",
        description:
          "The first mosque built in Islam. Praying two rak'ah here carries the reward of an accepted Umrah.",
        category: "ritual",
        location: "Quba, 5km south of Madinah",
        durationMins: 90,
        obligation: "Sunnah",
      },
      {
        id: "a-302",
        time: "10:00",
        title: "Mount Uhud & the martyrs' cemetery",
        description:
          "Reflect on the sacrifice of Sayyiduna Hamzah رضي الله عنه and the seventy companions buried here.",
        category: "ritual",
        location: "Jabal Uhud",
        durationMins: 75,
      },
      {
        id: "a-303",
        time: "12:30",
        title: "Masjid al-Qiblatayn",
        description:
          "The mosque of two qiblahs, where the direction of prayer was turned toward the Ka'bah.",
        category: "ritual",
        location: "Northwest Madinah",
        durationMins: 45,
      },
    ],
  },
  {
    id: "day-04",
    dayNumber: 4,
    gregorian: "2027-04-28",
    hijri: "21 Shawwal 1448",
    stage: "Makkah",
    title: "Ihram at Dhul-Hulayfah & Umrah",
    subtitle: "Entering the sacred state and performing Umrah al-Tamattu'",
    activities: [
      {
        id: "a-401",
        time: "08:00",
        title: "Ghusl and Ihram at the Miqat",
        description:
          "Bathe, apply fragrance before (not after) Ihram, wear the two white sheets, then pray two rak'ah and declare your intention for Umrah.",
        category: "ritual",
        location: "Masjid Dhul-Hulayfah (Abyar Ali)",
        durationMins: 90,
        obligation: "Fard",
      },
      {
        id: "a-402",
        time: "09:45",
        title: "Talbiyah on the road to Makkah",
        description:
          "Raise the Talbiyah continuously: Labbayk Allahumma labbayk. The journey takes roughly six hours by coach.",
        category: "travel",
        location: "Highway 15 · Madinah to Makkah",
        durationMins: 360,
        obligation: "Sunnah",
      },
      {
        id: "a-403",
        time: "17:00",
        title: "Tawaf al-Umrah",
        description:
          "Seven circuits of the Ka'bah beginning at the Black Stone, with idtiba' and raml for men in the first three rounds.",
        category: "ritual",
        location: "Masjid al-Haram, Mataf",
        durationMins: 90,
        obligation: "Fard",
      },
      {
        id: "a-404",
        time: "19:00",
        title: "Sa'i and Taqsir",
        description:
          "Seven trips between Safa and Marwah, then trim the hair to exit Ihram. You are now free of Ihram restrictions until 8 Dhul-Hijjah.",
        category: "ritual",
        location: "Mas'a Gallery",
        durationMins: 90,
        obligation: "Fard",
      },
    ],
  },
  {
    id: "day-05",
    dayNumber: 5,
    gregorian: "2027-04-29",
    hijri: "22 Shawwal 1448",
    stage: "Makkah",
    title: "Days of worship in Makkah",
    subtitle: "29 April – 13 May · voluntary Tawaf, study circles and rest",
    activities: [
      {
        id: "a-501",
        time: "Daily",
        title: "Five prayers in the Haram",
        description:
          "Aim for the first row when you can, but never at the cost of harming another pilgrim. Hydrate between every prayer.",
        category: "ritual",
        location: "Masjid al-Haram",
        durationMins: 240,
        obligation: "Fard",
      },
      {
        id: "a-502",
        time: "Daily",
        title: "Voluntary Tawaf",
        description:
          "Nafl Tawaf is the greeting of the Haram and is available to you at any hour. Nights after Isha are the least crowded.",
        category: "ritual",
        location: "Mataf / first floor",
        durationMins: 75,
        obligation: "Sunnah",
      },
      {
        id: "a-503",
        time: "16:30",
        title: "Ritual rehearsal with the Mutawwif",
        description:
          "Walk through the five days of Hajj step by step. Bring your HajjPath checklist and your questions.",
        category: "briefing",
        location: "Aziziyah residence, Block C",
        durationMins: 90,
      },
      {
        id: "a-504",
        time: "Ongoing",
        title: "Assemble your Mina kit",
        description:
          "Unscented soap, a light prayer mat, rehydration salts, a power bank and 70 pebbles collected in a small pouch.",
        category: "free",
        location: "Aziziyah",
        durationMins: 60,
      },
    ],
  },
  {
    id: "day-06",
    dayNumber: 6,
    gregorian: "2027-05-14",
    hijri: "8 Dhul-Hijjah 1448",
    stage: "Mina",
    title: "Yawm at-Tarwiyah — the day of quenching",
    subtitle: "Ihram for Hajj and the move to the tent city",
    activities: [
      {
        id: "a-601",
        time: "05:30",
        title: "Enter Ihram for Hajj",
        description:
          "Ghusl, wear Ihram at your residence, and declare: Labbayk Allahumma Hajjan. Women wear ordinary modest dress.",
        category: "ritual",
        location: "Aziziyah residence",
        durationMins: 60,
        obligation: "Fard",
      },
      {
        id: "a-602",
        time: "07:30",
        title: "Transfer to Mina",
        description:
          "Board the assigned Mashaer bus. Note your camp number — Muassasah C, Street 56, Tent 214 — and save it offline in HajjPath.",
        category: "travel",
        location: "Mina camp, Street 56",
        durationMins: 120,
        obligation: "Sunnah",
      },
      {
        id: "a-603",
        time: "12:15",
        title: "Five prayers shortened in Mina",
        description:
          "Dhuhr, Asr, Maghrib, Isha and the following Fajr are prayed in Mina, each shortened to two rak'ah without combining.",
        category: "ritual",
        location: "Tent 214",
        durationMins: 600,
        obligation: "Sunnah",
      },
      {
        id: "a-604",
        time: "21:00",
        title: "Rest and hydration check",
        description:
          "Sleep early — tomorrow is the longest day of the pilgrimage. Drink at least three litres of water before dawn.",
        category: "rest",
        location: "Tent 214",
        durationMins: 420,
      },
    ],
  },
  {
    id: "day-07",
    dayNumber: 7,
    gregorian: "2027-05-15",
    hijri: "9 Dhul-Hijjah 1448",
    stage: "Arafat",
    title: "Yawm Arafah — the day Hajj is made",
    subtitle: "Standing at Arafat, then the night of Muzdalifah",
    activities: [
      {
        id: "a-701",
        time: "05:00",
        title: "Fajr in Mina, then move to Arafat",
        description:
          "Depart after sunrise reciting the Talbiyah. The plain of Arafat opens at the Namirah boundary — confirm you are inside it.",
        category: "travel",
        location: "Mina → Arafat",
        durationMins: 150,
        obligation: "Sunnah",
      },
      {
        id: "a-702",
        time: "12:20",
        title: "Khutbah, then Dhuhr and Asr combined",
        description:
          "Listen to the Arafah sermon, then pray Dhuhr and Asr shortened and combined at the time of Dhuhr.",
        category: "ritual",
        location: "Masjid Namirah",
        durationMins: 90,
        obligation: "Sunnah",
      },
      {
        id: "a-703",
        time: "14:00",
        title: "Wuquf — the standing",
        description:
          "This is the pillar of Hajj. Face the qiblah, raise your hands and supplicate without pause until sunset. Do not fast today.",
        category: "ritual",
        location: "Plain of Arafat",
        durationMins: 300,
        obligation: "Fard",
      },
      {
        id: "a-704",
        time: "19:10",
        title: "Departure to Muzdalifah",
        description:
          "Leave only after the sun has fully set, calmly and without haste. Pray Maghrib and Isha combined on arrival.",
        category: "travel",
        location: "Arafat → Muzdalifah",
        durationMins: 180,
        obligation: "Wajib",
      },
      {
        id: "a-705",
        time: "22:30",
        title: "Night under the open sky",
        description:
          "Gather seven pebbles for tomorrow — the rest can be collected in Mina. Sleep until Fajr; the elderly may leave after midnight.",
        category: "rest",
        location: "Muzdalifah",
        durationMins: 400,
        obligation: "Wajib",
      },
    ],
  },
  {
    id: "day-08",
    dayNumber: 8,
    gregorian: "2027-05-16",
    hijri: "10 Dhul-Hijjah 1448",
    stage: "Jamarat",
    title: "Yawm an-Nahr — the day of sacrifice",
    subtitle: "Four rites in one day: stoning, sacrifice, shaving, Tawaf",
    activities: [
      {
        id: "a-801",
        time: "06:30",
        title: "Stone Jamrat al-Aqabah",
        description:
          "Seven pebbles at the large pillar only, saying Allahu Akbar with each throw. Stop the Talbiyah with the first pebble.",
        category: "ritual",
        location: "Jamarat Bridge, Level 3",
        durationMins: 90,
        obligation: "Wajib",
      },
      {
        id: "a-802",
        time: "08:30",
        title: "Hady — the sacrifice",
        description:
          "Your ram has been prepaid through the Adahi scheme. Confirmation lands in HajjPath the moment it is performed on your behalf.",
        category: "ritual",
        location: "Adahi abattoir, Muaisim",
        durationMins: 30,
        obligation: "Wajib",
      },
      {
        id: "a-803",
        time: "09:30",
        title: "Halq or Taqsir",
        description:
          "Men shave the head completely (preferred) or trim; women cut a fingertip length. You now leave Ihram partially.",
        category: "ritual",
        location: "Licensed barber, Mina",
        durationMins: 45,
        obligation: "Wajib",
      },
      {
        id: "a-804",
        time: "15:00",
        title: "Tawaf al-Ifadah and Sa'i",
        description:
          "The second pillar of Hajj. After this Tawaf and Sa'i all Ihram restrictions lift, including marital relations.",
        category: "ritual",
        location: "Masjid al-Haram",
        durationMins: 180,
        obligation: "Fard",
      },
      {
        id: "a-805",
        time: "21:00",
        title: "Return to Mina for the night",
        description:
          "Spending the nights of Tashriq in Mina is obligatory. Your bus bay is marked in the HajjPath map.",
        category: "travel",
        location: "Makkah → Mina",
        durationMins: 120,
        obligation: "Wajib",
      },
    ],
  },
  {
    id: "day-09",
    dayNumber: 9,
    gregorian: "2027-05-17",
    hijri: "11 Dhul-Hijjah 1448",
    stage: "Jamarat",
    title: "First day of Tashriq",
    subtitle: "Stoning all three pillars after Zawal",
    activities: [
      {
        id: "a-901",
        time: "14:30",
        title: "Stone the three Jamarat",
        description:
          "Sughra, then Wusta, then Aqabah — seven pebbles each, in that order, only after the sun has passed its zenith. Supplicate after the first two.",
        category: "ritual",
        location: "Jamarat Bridge",
        durationMins: 150,
        obligation: "Wajib",
      },
      {
        id: "a-902",
        time: "18:00",
        title: "Dhikr and rest in the tent",
        description:
          "These are days of remembrance and eating. Recite the Takbir at-Tashriq after every obligatory prayer.",
        category: "rest",
        location: "Tent 214",
        durationMins: 300,
        obligation: "Sunnah",
      },
    ],
  },
  {
    id: "day-10",
    dayNumber: 10,
    gregorian: "2027-05-18",
    hijri: "12 Dhul-Hijjah 1448",
    stage: "Jamarat",
    title: "Second day of Tashriq — Nafar Awwal",
    subtitle: "Depart Mina before sunset, or stay for the third day",
    activities: [
      {
        id: "a-1001",
        time: "14:30",
        title: "Stone the three Jamarat",
        description:
          "The same order and count as yesterday. Afternoon and late evening are the calmest windows.",
        category: "ritual",
        location: "Jamarat Bridge",
        durationMins: 150,
        obligation: "Wajib",
      },
      {
        id: "a-1002",
        time: "17:30",
        title: "Nafar Awwal decision point",
        description:
          "Leaving Mina before sunset today ends your stoning obligation. Your group has chosen Nafar Thani — one more night in Mina.",
        category: "briefing",
        location: "Tent 214",
        durationMins: 30,
      },
    ],
  },
  {
    id: "day-11",
    dayNumber: 11,
    gregorian: "2027-05-19",
    hijri: "13 Dhul-Hijjah 1448",
    stage: "Jamarat",
    title: "Third day of Tashriq — Nafar Thani",
    subtitle: "Final stoning and return to Makkah",
    activities: [
      {
        id: "a-1101",
        time: "13:45",
        title: "Final stoning of the three Jamarat",
        description:
          "Your last twenty-one pebbles. Take a moment at the pillar to thank Allah for completing the rites.",
        category: "ritual",
        location: "Jamarat Bridge",
        durationMins: 120,
        obligation: "Wajib",
      },
      {
        id: "a-1102",
        time: "17:00",
        title: "Return to Makkah accommodation",
        description:
          "Camp is struck and luggage moves ahead of you. Check your tent for belongings before boarding.",
        category: "travel",
        location: "Mina → Makkah",
        durationMins: 150,
      },
    ],
  },
  {
    id: "day-12",
    dayNumber: 12,
    gregorian: "2027-05-22",
    hijri: "16 Dhul-Hijjah 1448",
    stage: "Makkah",
    title: "Tawaf al-Wada and departure",
    subtitle: "The farewell circuit, then home",
    activities: [
      {
        id: "a-1201",
        time: "02:00",
        title: "Tawaf al-Wada",
        description:
          "Seven final circuits with no Sa'i. This must be your last act in Makkah before leaving the Haram boundary.",
        category: "ritual",
        location: "Masjid al-Haram",
        durationMins: 120,
        obligation: "Wajib",
      },
      {
        id: "a-1202",
        time: "09:00",
        title: "Luggage weigh-in and Zamzam allocation",
        description:
          "Each pilgrim receives one sealed 5-litre Zamzam container at the airport. Do not pack it in your own luggage.",
        category: "travel",
        location: "Hotel lobby",
        durationMins: 120,
      },
      {
        id: "a-1203",
        time: "14:30",
        title: "Departure to Jeddah & flight home",
        description:
          "Your Al-Hajji badge unlocks in HajjPath once the group manifest is confirmed landed in Nigeria.",
        category: "travel",
        location: "King Abdulaziz International, Hajj Terminal",
        durationMins: 600,
      },
    ],
  },
];

export const STAGE_ORDER = [
  "Preparation",
  "Madinah",
  "Makkah",
  "Mina",
  "Arafat",
  "Muzdalifah",
  "Jamarat",
] as const;
