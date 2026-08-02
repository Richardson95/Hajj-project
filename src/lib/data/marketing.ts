export interface Faq {
  question: string;
  answer: string;
  group: "Savings" | "Compliance" | "In Makkah" | "Account";
}

export const FAQS: Faq[] = [
  {
    group: "Savings",
    question: "How much do I need to start saving with HajjPath?",
    answer:
      "There is no minimum opening deposit. You choose a travel year, pick a package, and HajjPath calculates the weekly, monthly or quarterly contribution that gets you there. Pilgrims saving for 2028 typically start from ₦68,000 a month.",
  },
  {
    group: "Savings",
    question: "What happens if I miss a contribution?",
    answer:
      "Nothing punitive. Your goal tracker recalculates the amount needed for the remaining cycles and shows you the new figure. You can top up at any time, pause the plan for up to three months, or move to a later travel year without losing a single naira.",
  },
  {
    group: "Savings",
    question: "Can I withdraw my money if my plans change?",
    answer:
      "Yes. Your savings belong to you. Withdrawal requests are processed within two business days to the bank account tied to your BVN. Only the fees already earned on completed quarters are retained.",
  },
  {
    group: "Savings",
    question: "Can I save for my parents or my spouse?",
    answer:
      "That is what Family Plans are for. One account can run several plans, each with its own beneficiary, package and travel year. Diaspora Nigerians use this to fund a parent's pilgrimage from abroad while the parent tracks progress on their own phone.",
  },
  {
    group: "Compliance",
    question: "Is HajjPath Shariah compliant?",
    answer:
      "Deposits are held in non-interest-bearing custody accounts with our Islamic banking partners and invested only in Shariah-screened Mudarabah pools. Returns are shared as profit, never as fixed interest, and the structure is reviewed by an independent Shariah advisory board each year.",
  },
  {
    group: "Compliance",
    question: "Why do you need my BVN and NIN?",
    answer:
      "Nigerian financial regulations require verified identity before an account can hold funds. Your BVN and NIN are checked once through a licensed KYC provider, encrypted at rest, and never shared with vendors, travel operators or other pilgrims.",
  },
  {
    group: "Compliance",
    question: "Who actually holds my money?",
    answer:
      "HajjPath never touches your balance. Funds sit in a dedicated trust account with a licensed Nigerian bank, ring-fenced from the company's own operating accounts and reconciled daily.",
  },
  {
    group: "In Makkah",
    question: "Does the app work without mobile data in Makkah?",
    answer:
      "The essentials do. Your itinerary, ritual guides, du'ās, checklist, camp details and offline maps are cached to your device before departure. Live features such as Find Me and the marketplace need a connection, so we bundle a Saudi data SIM in the travel-tech category.",
  },
  {
    group: "In Makkah",
    question: "How does the Find Me feature work?",
    answer:
      "Every pilgrim gets a lanyard tag carrying a QR code and a Bluetooth beacon. Anyone who finds a lost pilgrim can scan the tag with any phone to reach the group admin instantly, and group members can see each other on a live map inside their shared group code.",
  },
  {
    group: "In Makkah",
    question: "Are marketplace vendors verified?",
    answer:
      "Every vendor is physically inspected in Makkah or Madinah, holds a valid Saudi commercial registration, and is re-verified each season. Payments are held in escrow and released to the vendor only after you confirm delivery.",
  },
  {
    group: "Account",
    question: "Do I still need to register with NAHCON or my State Board?",
    answer:
      "Yes. HajjPath prepares and funds your pilgrimage; the seat allocation itself remains with NAHCON and the State Pilgrims Welfare Boards. Once your goal is met, the app hands you a compliance pack with everything those bodies ask for.",
  },
  {
    group: "Account",
    question: "How is my account secured?",
    answer:
      "Two-factor authentication, biometric unlock, device binding and end-to-end encryption on chats and location sharing. Withdrawals additionally require an OTP sent to the phone number registered against your BVN.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  tone: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I had been promising myself Hajj since 2009. Setting ₦95,000 aside every week felt small enough to actually do — and eighteen months later the app told me I was eligible to apply. I cried in my shop.",
    name: "Halimah Adetunji",
    role: "Trader · Ikeja, Lagos",
    initials: "HA",
    tone: "from-gold-500 to-gold-700",
  },
  {
    quote:
      "I live in Manchester and my mother lives in Kano. I fund her plan from here and she watches the tracker fill up on her own phone. She calls me every month to tell me the number.",
    name: "Abdulganiyu Salami",
    role: "Diaspora sponsor · United Kingdom",
    initials: "AS",
    tone: "from-forest-600 to-forest-800",
  },
  {
    quote:
      "Forty-eight pilgrims, one screen. I can see who is still in the tent, who is at the Jamarat and who needs help — before they think to call me. Last season we lost nobody, not even for an hour.",
    name: "Alhaji Kabiru Sule",
    role: "Group Admin · Al-Amanah Travels",
    initials: "KS",
    tone: "from-forest-700 to-forest-900",
  },
  {
    quote:
      "My shop is forty minutes from the Haram, so pilgrims never found me. Now I take twenty orders a day and the money is guaranteed by escrow. Business has tripled since 2024.",
    name: "Yusuf Al-Barakah",
    role: "Vendor · Ibrahim Al-Khalil Street, Makkah",
    initials: "YA",
    tone: "from-amber-600 to-amber-800",
  },
  {
    quote:
      "The audio guide in Hausa changed everything for my father. He is seventy-three and could never follow the English booklets. He performed every rite without once asking me what to do next.",
    name: "Fatimah Oyelaran",
    role: "Pilgrim · Ilorin, Kwara",
    initials: "FO",
    tone: "from-teal-600 to-teal-800",
  },
  {
    quote:
      "I collapsed from the heat near the Jamarat and pressed the SOS button. A medic reached me in under four minutes because she could see exactly where I was standing.",
    name: "Musa Bello",
    role: "Pilgrim · Kaduna",
    initials: "MB",
    tone: "from-sky-600 to-sky-800",
  },
];

export const IMPACT_STATS = [
  { value: "38,400+", label: "Pilgrims saving", detail: "Across 34 states and 11 countries" },
  { value: "₦14.2bn", label: "Held in trust", detail: "Ring-fenced with licensed Nigerian banks" },
  { value: "99.2%", label: "Goals met on time", detail: "Among plans started 18+ months out" },
  { value: "4 min", label: "Median SOS response", detail: "From alert raised to responder on scene" },
];

export const COMPLIANCE_POINTS = [
  {
    title: "Shariah-screened by design",
    body: "Non-interest custody accounts and Mudarabah profit-sharing pools, reviewed annually by an independent Shariah advisory board.",
  },
  {
    title: "Funds held in trust, never on our books",
    body: "Balances sit in a ring-fenced trust account with a licensed Nigerian bank and are reconciled daily against the ledger you see in the app.",
  },
  {
    title: "Verified identity on every account",
    body: "BVN and NIN validation through a licensed KYC provider means the person saving, the person travelling and the person on the manifest are the same person.",
  },
  {
    title: "Encrypted location and messaging",
    body: "Find Me positions and group chats are end-to-end encrypted, visible only inside your group code, and purged thirty days after you return.",
  },
];

export const PARTNER_LOGOS = [
  "NAHCON",
  "State Pilgrims Boards",
  "Jaiz Bank",
  "Lotus Bank",
  "TAJBank",
  "Paystack",
  "VerifyMe",
  "Adahi",
];
