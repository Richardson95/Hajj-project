import type { ChecklistItem, GuideChapter, LanguageCode } from "../types";

export const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ha", label: "Hausa", native: "Hausa" },
  { code: "yo", label: "Yoruba", native: "Yorùbá" },
  { code: "ig", label: "Igbo", native: "Igbo" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

const ALL: LanguageCode[] = ["en", "ha", "yo", "ar"];

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: "ch-ihram",
    slug: "ihram",
    title: "Entering Ihram",
    arabicTitle: "الإحرام",
    stage: "Preparation",
    summary:
      "The sacred state that opens the pilgrimage — how to enter it, what it forbids, and the mistakes pilgrims most often make at the Miqat.",
    readMinutes: 7,
    audioLanguages: ALL,
    steps: [
      {
        id: "s-ih-1",
        order: 1,
        title: "Purify and prepare before the Miqat",
        body: "Take a full ghusl, trim the nails, and remove unwanted hair. Fragrance may be applied to the body — never to the Ihram cloth — but only before you make the intention.",
        obligation: "Sunnah",
        tip: "Do this at your hotel in Madinah. Facilities at Dhul-Hulayfah get very crowded.",
      },
      {
        id: "s-ih-2",
        order: 2,
        title: "Wear the Ihram garments",
        body: "Men wear two unstitched white sheets: the izar around the waist and the rida over the shoulders. Women wear ordinary modest clothing; the face and hands are left uncovered.",
        obligation: "Wajib",
      },
      {
        id: "s-ih-3",
        order: 3,
        title: "Pray two rak'ah",
        body: "Offer two units of prayer with the intention of Ihram, unless it falls in a time when voluntary prayer is discouraged.",
        obligation: "Sunnah",
      },
      {
        id: "s-ih-4",
        order: 4,
        title: "Declare the intention at the Miqat",
        body: "State clearly what you intend: Labbayk Allahumma Umratan for Umrah, or Labbayk Allahumma Hajjan for Hajj. The intention must be made before you cross the Miqat boundary.",
        obligation: "Fard",
        tip: "Crossing the Miqat without Ihram obligates a dam (compensatory sacrifice). If you are flying directly to Jeddah, enter Ihram on the aircraft before the announcement.",
      },
      {
        id: "s-ih-5",
        order: 5,
        title: "Observe the prohibitions",
        body: "While in Ihram avoid: cutting hair or nails, using scented products, hunting, marital relations and marriage contracts, and — for men — stitched clothing and covering the head.",
        obligation: "Fard",
      },
    ],
    duas: [
      {
        id: "d-talbiyah",
        title: "The Talbiyah",
        arabic:
          "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
        transliteration:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
        translation:
          "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Truly all praise, favour and sovereignty belong to You. You have no partner.",
        occasion: "Recited continuously from Ihram until the first pebble is thrown at Jamrat al-Aqabah.",
      },
    ],
  },
  {
    id: "ch-tawaf",
    slug: "tawaf",
    title: "Tawaf around the Ka'bah",
    arabicTitle: "الطواف",
    stage: "Makkah",
    summary:
      "Seven circuits of the House of Allah — the conditions of validity, the sunnah acts, and how to keep count in a crowd.",
    readMinutes: 9,
    audioLanguages: ALL,
    steps: [
      {
        id: "s-tw-1",
        order: 1,
        title: "Be in a state of purity",
        body: "Wudu is a condition for the validity of Tawaf. Renew it before you enter the Mataf, and know where the nearest ablution area is.",
        obligation: "Fard",
      },
      {
        id: "s-tw-2",
        order: 2,
        title: "Begin at the Black Stone",
        body: "Face the Hajar al-Aswad, say Bismillah Allahu Akbar and point toward it with the right hand. Kissing it is sunnah — never crowd or harm others to reach it.",
        obligation: "Fard",
      },
      {
        id: "s-tw-3",
        order: 3,
        title: "Circle seven times, anti-clockwise",
        body: "Keep the Ka'bah on your left. Each circuit begins and ends at the Black Stone line. Walk outside the Hijr Ismail — cutting through it invalidates the circuit.",
        obligation: "Fard",
        tip: "Use the HajjPath circuit counter, or move a ring between fingers. Miscounting is the single most common Tawaf error.",
      },
      {
        id: "s-tw-4",
        order: 4,
        title: "Idtiba' and Raml for men",
        body: "In the arrival Tawaf, men uncover the right shoulder throughout and walk briskly in the first three circuits. Both are sunnah, not obligations.",
        obligation: "Sunnah",
      },
      {
        id: "s-tw-5",
        order: 5,
        title: "Pray behind Maqam Ibrahim",
        body: "After the seventh circuit, pray two rak'ah behind the Station of Ibrahim if space allows — anywhere in the Haram is acceptable when it does not.",
        obligation: "Sunnah",
      },
      {
        id: "s-tw-6",
        order: 6,
        title: "Drink Zamzam",
        body: "Drink to your fill facing the qiblah, in three breaths, and supplicate — the water of Zamzam is for whatever it is drunk for.",
        obligation: "Sunnah",
      },
    ],
    duas: [
      {
        id: "d-corner",
        title: "Between the Yemeni corner and the Black Stone",
        arabic:
          "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration:
          "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
        translation:
          "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        occasion: "Recited in the final stretch of every circuit.",
      },
    ],
  },
  {
    id: "ch-sai",
    slug: "sai",
    title: "Sa'i between Safa and Marwah",
    arabicTitle: "السعي",
    stage: "Makkah",
    summary:
      "Retracing the search of Hajar عليها السلام — the seven trips, the green-light zone, and the du'a at each hill.",
    readMinutes: 6,
    audioLanguages: ALL,
    steps: [
      {
        id: "s-sa-1",
        order: 1,
        title: "Begin at Safa",
        body: "Approach Safa reciting: Innas-Safa wal-Marwata min sha'a'irillah. Face the Ka'bah, raise your hands and supplicate.",
        obligation: "Fard",
      },
      {
        id: "s-sa-2",
        order: 2,
        title: "Walk to Marwah — that is one trip",
        body: "Safa to Marwah counts as one, Marwah to Safa as the second. Seven trips end at Marwah, not Safa.",
        obligation: "Fard",
        tip: "If you finish at Safa you have counted six or eight. Recount before leaving the gallery.",
      },
      {
        id: "s-sa-3",
        order: 3,
        title: "Jog between the green markers",
        body: "Men increase their pace between the two green lights, recalling how Hajar ran through the valley. Women walk normally throughout.",
        obligation: "Sunnah",
      },
      {
        id: "s-sa-4",
        order: 4,
        title: "Exit Ihram with Halq or Taqsir",
        body: "For Umrah, cut the hair after Sa'i to leave Ihram. For Hajj Tamattu', this happens on the Day of Sacrifice instead.",
        obligation: "Wajib",
      },
    ],
    duas: [
      {
        id: "d-safa",
        title: "Standing on Safa and Marwah",
        arabic:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration:
          "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.",
        translation:
          "There is no god but Allah alone, without partner. His is the dominion and His is all praise, and He has power over all things.",
        occasion: "Said three times on each hill, with personal supplication in between.",
      },
    ],
  },
  {
    id: "ch-arafah",
    slug: "arafah",
    title: "The standing at Arafat",
    arabicTitle: "الوقوف بعرفة",
    stage: "Arafat",
    summary:
      "Hajj is Arafah. Everything you need for the single most important afternoon of the pilgrimage.",
    readMinutes: 8,
    audioLanguages: ALL,
    steps: [
      {
        id: "s-ar-1",
        order: 1,
        title: "Confirm you are inside the boundary",
        body: "The plain is marked by yellow boundary signs. Standing at Masjid Namirah's western section does not count — it lies outside Arafat.",
        obligation: "Fard",
        tip: "HajjPath shows a live boundary indicator on the map when you are within the Arafat perimeter.",
      },
      {
        id: "s-ar-2",
        order: 2,
        title: "Combine Dhuhr and Asr",
        body: "Both prayers are shortened to two rak'ah and prayed together at the time of Dhuhr, with a single adhan and two iqamahs.",
        obligation: "Sunnah",
      },
      {
        id: "s-ar-3",
        order: 3,
        title: "Stand and supplicate until sunset",
        body: "Face the qiblah, raise your hands and ask without restraint — for yourself, your parents, and those who asked you to pray for them. Do not fast on this day.",
        obligation: "Fard",
      },
      {
        id: "s-ar-4",
        order: 4,
        title: "Guard against heat exhaustion",
        body: "Temperatures exceed 45°C. Drink 250ml every half hour, use an umbrella, and report dizziness or cramping to a medic immediately.",
        obligation: "Wajib",
      },
      {
        id: "s-ar-5",
        order: 5,
        title: "Leave only after sunset",
        body: "Departing before the sun sets requires a compensatory sacrifice. Move calmly — the descent to Muzdalifah can take several hours.",
        obligation: "Wajib",
      },
    ],
    duas: [
      {
        id: "d-arafah",
        title: "The best supplication of Arafah",
        arabic:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration:
          "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir.",
        translation:
          "There is no god but Allah alone, without partner. His is the dominion, His is all praise, and He has power over all things.",
        occasion:
          "The Prophet ﷺ said: the best supplication is the supplication of the Day of Arafah, and the best that I and the prophets before me have said is this.",
      },
      {
        id: "d-forgiveness",
        title: "Seeking pardon",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni.",
        translation:
          "O Allah, You are Most Forgiving and You love forgiveness, so forgive me.",
        occasion: "Repeated throughout the standing, especially in the last hour before sunset.",
      },
    ],
  },
  {
    id: "ch-muzdalifah",
    slug: "muzdalifah",
    title: "The night at Muzdalifah",
    arabicTitle: "المزدلفة",
    stage: "Muzdalifah",
    summary:
      "Sleeping under the open sky, combining the night prayers, and gathering the pebbles for Jamarat.",
    readMinutes: 5,
    audioLanguages: ALL,
    steps: [
      {
        id: "s-mz-1",
        order: 1,
        title: "Pray Maghrib and Isha on arrival",
        body: "Combine both at the time of Isha — three rak'ah for Maghrib, two for Isha — with one adhan and two iqamahs. Do not pray them at Arafat.",
        obligation: "Sunnah",
      },
      {
        id: "s-mz-2",
        order: 2,
        title: "Collect your pebbles",
        body: "Seven for tomorrow at minimum; forty-nine or seventy in total is easier. Each should be about the size of a chickpea. Any clean pebble from the ground will do.",
        obligation: "Sunnah",
        tip: "Do not wash the pebbles — there is no basis for it, and it wastes water you will need.",
      },
      {
        id: "s-mz-3",
        order: 3,
        title: "Rest until Fajr",
        body: "Staying past midnight is obligatory for most pilgrims. The elderly, the sick and women may leave after the moon sets.",
        obligation: "Wajib",
      },
      {
        id: "s-mz-4",
        order: 4,
        title: "Stand at Mash'ar al-Haram",
        body: "After Fajr, face the qiblah and supplicate until the sky brightens, then move toward Mina before sunrise.",
        obligation: "Sunnah",
      },
    ],
    duas: [
      {
        id: "d-mashar",
        title: "At Mash'ar al-Haram",
        arabic: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
        transliteration:
          "Allahu Akbar, Allahu Akbar, la ilaha illallahu wallahu Akbar, Allahu Akbar wa lillahil-hamd.",
        translation:
          "Allah is the Greatest, Allah is the Greatest. There is no god but Allah, and Allah is the Greatest. Allah is the Greatest and to Allah belongs all praise.",
        occasion: "The Takbir recited at Muzdalifah and after every prayer during the days of Tashriq.",
      },
    ],
  },
  {
    id: "ch-jamarat",
    slug: "jamarat",
    title: "Stoning the Jamarat",
    arabicTitle: "رمي الجمرات",
    stage: "Jamarat",
    summary:
      "The order of the three pillars, the correct timing on each day, and the crowd-safety rules that save lives.",
    readMinutes: 8,
    audioLanguages: ALL,
    steps: [
      {
        id: "s-jm-1",
        order: 1,
        title: "Day of Sacrifice — Aqabah only",
        body: "On 10 Dhul-Hijjah throw seven pebbles at the large pillar alone. Say Allahu Akbar with each throw and stop the Talbiyah with the first.",
        obligation: "Wajib",
      },
      {
        id: "s-jm-2",
        order: 2,
        title: "Days of Tashriq — all three, in order",
        body: "On 11, 12 and (if staying) 13 Dhul-Hijjah, throw at Jamrat al-Sughra, then al-Wusta, then al-Aqabah — seven pebbles each, after Zawal only.",
        obligation: "Wajib",
      },
      {
        id: "s-jm-3",
        order: 3,
        title: "Supplicate after the first two",
        body: "Move to one side after Sughra and Wusta, face the qiblah, and supplicate at length. There is no standing du'a after Aqabah.",
        obligation: "Sunnah",
      },
      {
        id: "s-jm-4",
        order: 4,
        title: "Follow the one-way crowd flow",
        body: "Enter and exit by the assigned level and gate for your camp. Never move against the flow, never stop to take photographs on the bridge, and never bend to pick up a dropped item.",
        obligation: "Wajib",
        tip: "If you are elderly, ill or with young children you may appoint someone to throw on your behalf.",
      },
    ],
    duas: [
      {
        id: "d-jamarat",
        title: "With each pebble",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar.",
        translation: "Allah is the Greatest.",
        occasion: "Said once with every single pebble — twenty-one times each day of Tashriq.",
      },
    ],
  },
  {
    id: "ch-madinah",
    slug: "madinah",
    title: "Visiting Madinah",
    arabicTitle: "زيارة المدينة",
    stage: "Madinah",
    summary:
      "Etiquette in the Prophet's Mosque, the Rawdah permit process, and the sites worth your time.",
    readMinutes: 6,
    audioLanguages: ALL,
    steps: [
      {
        id: "s-md-1",
        order: 1,
        title: "Enter with the right foot",
        body: "Recite the mosque du'a on entering, then pray two rak'ah of greeting before anything else.",
        obligation: "Sunnah",
      },
      {
        id: "s-md-2",
        order: 2,
        title: "Send salutations at the noble grave",
        body: "Stand facing the grave, greet the Prophet ﷺ, then Abu Bakr and Umar رضي الله عنهما. Keep your voice low, do not linger, and do not touch the grilles.",
        obligation: "Sunnah",
      },
      {
        id: "s-md-3",
        order: 3,
        title: "Book your Rawdah slot on Nusuk",
        body: "Access to Riyad al-Jannah is by timed permit only, once per visit. Book as soon as your Madinah dates are confirmed — slots fill weeks ahead.",
        obligation: "Sunnah",
      },
      {
        id: "s-md-4",
        order: 4,
        title: "Forty consecutive prayers",
        body: "Praying forty prayers in the Prophet's Mosque without missing one is a widely-practised virtue — it is encouraged, not obligatory, so do not distress yourself over it.",
        obligation: "Sunnah",
      },
    ],
    duas: [
      {
        id: "d-entering-masjid",
        title: "On entering the mosque",
        arabic:
          "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allahummaftah li abwaba rahmatik.",
        translation: "O Allah, open for me the gates of Your mercy.",
        occasion: "Said while stepping in with the right foot.",
      },
    ],
  },
];

export function chapterBySlug(slug: string): GuideChapter | undefined {
  return GUIDE_CHAPTERS.find((c) => c.slug === slug);
}

export const ALL_DUAS = GUIDE_CHAPTERS.flatMap((c) => c.duas);

export const CHECKLIST: ChecklistItem[] = [
  { id: "cl-1", label: "International passport (valid 6+ months)", group: "Documents" },
  { id: "cl-2", label: "Hajj visa & NAHCON pilgrim card", group: "Documents" },
  { id: "cl-3", label: "Yellow fever & meningitis certificates", group: "Documents", note: "Meningococcal ACWY is mandatory for Saudi entry" },
  { id: "cl-4", label: "Printed HajjPath itinerary & group code", group: "Documents" },
  { id: "cl-5", label: "Passport photographs (8 copies)", group: "Documents" },

  { id: "cl-6", label: "Two sets of Ihram cloth", group: "Ihram & Clothing", note: "One to wear, one spare — they get soiled quickly" },
  { id: "cl-7", label: "Ihram belt with zip pockets", group: "Ihram & Clothing" },
  { id: "cl-8", label: "Seamless slippers or sandals", group: "Ihram & Clothing" },
  { id: "cl-9", label: "Lightweight prayer mat", group: "Ihram & Clothing" },
  { id: "cl-10", label: "Umbrella (white, UV-coated)", group: "Ihram & Clothing" },
  { id: "cl-11", label: "Modest abaya & headscarves", group: "Ihram & Clothing", note: "For women pilgrims" },

  { id: "cl-12", label: "Prescription medicines with doctor's note", group: "Health" },
  { id: "cl-13", label: "Oral rehydration salts (10 sachets)", group: "Health" },
  { id: "cl-14", label: "Unscented soap, shampoo & toothpaste", group: "Health", note: "Scented products are forbidden in Ihram" },
  { id: "cl-15", label: "Blister plasters & antiseptic cream", group: "Health" },
  { id: "cl-16", label: "Face masks and hand sanitiser", group: "Health" },
  { id: "cl-17", label: "Anti-inflammatory & anti-diarrhoeal tablets", group: "Health" },

  { id: "cl-18", label: "Saudi Riyal cash (small denominations)", group: "Money" },
  { id: "cl-19", label: "Dollar-denominated debit card", group: "Money" },
  { id: "cl-20", label: "HajjPath wallet funded for marketplace orders", group: "Money" },

  { id: "cl-21", label: "Power bank (20,000mAh) & universal adapter", group: "Essentials", note: "Saudi uses Type G sockets, 220V" },
  { id: "cl-22", label: "Saudi SIM or roaming bundle", group: "Essentials" },
  { id: "cl-23", label: "HajjPath Find Me tag & lanyard", group: "Essentials" },
  { id: "cl-24", label: "Refillable water bottle", group: "Essentials" },
  { id: "cl-25", label: "Small drawstring bag for pebbles", group: "Essentials" },
  { id: "cl-26", label: "Nail clipper & scissors (checked luggage)", group: "Essentials" },
];

export const CHECKLIST_GROUPS = [
  "Documents",
  "Ihram & Clothing",
  "Health",
  "Money",
  "Essentials",
] as const;
