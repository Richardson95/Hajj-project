import { FAQS } from "../data/marketing";
import { HAJJ_PACKAGES } from "../data/packages";
import { PRODUCTS, VENDORS } from "../data/marketplace";
import { CHECKLIST } from "../data/guide";
import { ITINERARY } from "../data/itinerary";
import { PILGRIM_GROUP } from "../data/map";
import type { OpsVendor } from "./types";
import { DEMO_USER } from "../data/account";
import type { OpsState } from "./types";

/** Demo password for every seeded admin account. */
export const DEMO_ADMIN_PASSWORD = "admin2027";

/** Fields a vendor has before it has traded on HajjPath. */
export const NEW_VENDOR_DEFAULTS = {
  rating: 0,
  ratingCount: 0,
  verified: false,
  since: 2026,
  tone: "from-forest-700 to-forest-900",
  responseTime: "New on HajjPath",
  fulfilled: 0,
};

export const OPS_INITIAL_STATE: OpsState = {
  sessionAdminId: null,

  admins: [
    {
      id: "adm-01",
      name: "Aisha Bello",
      email: "admin@hajjpath.ng",
      password: DEMO_ADMIN_PASSWORD,
      role: "super-admin",
      addedAt: "2025-06-02T09:00:00.000Z",
      addedBy: "System",
    },
    {
      id: "adm-02",
      name: `${DEMO_USER.firstName} ${DEMO_USER.lastName}`,
      email: DEMO_USER.email,
      password: DEMO_ADMIN_PASSWORD,
      role: "super-admin",
      addedAt: "2025-09-20T10:30:00.000Z",
      addedBy: "Aisha Bello",
    },
    {
      id: "adm-03",
      name: "Tunde Okafor",
      email: "tunde.okafor@hajjpath.ng",
      password: DEMO_ADMIN_PASSWORD,
      role: "staff",
      addedAt: "2026-02-11T08:15:00.000Z",
      addedBy: "Aisha Bello",
    },
  ],

  users: [
    { id: "pu-01", name: "Halima Yusuf", email: "halima.yusuf@gmail.com", phone: "08061234590", state: "Kano", joinedAt: "2026-11-08T10:12:00.000Z", nin: "80123456712", passportNumber: "B20391847", kyc: "in-review", submittedAt: "2026-11-08T10:40:00.000Z" },
    { id: "pu-02", name: "Abdullahi Musa", email: "a.musa@yahoo.com", phone: "08139876543", state: "Kaduna", joinedAt: "2026-11-09T14:02:00.000Z", nin: "71234598760", passportNumber: "A09183746", kyc: "in-review", submittedAt: "2026-11-09T14:31:00.000Z" },
    { id: "pu-03", name: "Kafayat Lawal", email: "kafayat.lawal@outlook.com", phone: "08024567812", state: "Oyo", joinedAt: "2026-11-09T19:45:00.000Z", nin: "62345987105", passportNumber: "B11928374", kyc: "in-review", submittedAt: "2026-11-09T20:05:00.000Z" },
    { id: "pu-04", name: "Sani Garba", email: "sanigarba@gmail.com", phone: "07035551234", state: "Sokoto", joinedAt: "2026-11-10T07:30:00.000Z", nin: "90871234561", passportNumber: "A10293847", kyc: "in-review", submittedAt: "2026-11-10T07:52:00.000Z" },
    { id: "pu-05", name: "Maryam Abubakar", email: "maryam.abubakar@gmail.com", phone: "08097651234", state: "FCT", joinedAt: "2026-03-14T09:00:00.000Z", nin: "55512398740", passportNumber: "B09812734", kyc: "verified", submittedAt: "2026-03-14T09:20:00.000Z", reviewedAt: "2026-03-15T11:00:00.000Z" },
    { id: "pu-06", name: "Yusuf Olatunji", email: "y.olatunji@gmail.com", phone: "08031237788", state: "Lagos", joinedAt: "2025-12-02T16:20:00.000Z", nin: "44412398761", passportNumber: "A08127364", kyc: "verified", submittedAt: "2025-12-02T16:41:00.000Z", reviewedAt: "2025-12-03T10:15:00.000Z" },
    { id: "pu-07", name: "Fatima Danjuma", email: "fatima.danjuma@gmail.com", phone: "08051112299", state: "Niger", joinedAt: "2026-01-19T12:00:00.000Z", nin: "33398712456", passportNumber: "B10293845", kyc: "verified", submittedAt: "2026-01-19T12:30:00.000Z", reviewedAt: "2026-01-20T09:00:00.000Z" },
    { id: "pu-08", name: "Ibrahim Shehu", email: "ishehu@gmail.com", phone: "08164443210", state: "Katsina", joinedAt: "2026-10-28T08:10:00.000Z", nin: "22209871234", passportNumber: "A07162534", kyc: "rejected", submittedAt: "2026-10-28T08:30:00.000Z", reviewedAt: "2026-10-29T13:20:00.000Z", rejectionReason: "Passport data page photo was blurred. Asked to re-upload a clear image." },
    { id: "pu-09", name: "Zainab Abubakar", email: "zainab.ab@gmail.com", phone: "08127778811", state: "Kwara", joinedAt: "2026-04-11T10:00:00.000Z", nin: "11198273645", passportNumber: "B08172635", kyc: "verified", submittedAt: "2026-04-11T10:22:00.000Z", reviewedAt: "2026-04-12T08:45:00.000Z" },
    { id: "pu-10", name: "Musa Bello", email: "musa.bello@gmail.com", phone: "08038889900", state: "Bauchi", joinedAt: "2026-06-18T15:30:00.000Z", nin: "99912837465", passportNumber: "A06152433", kyc: "verified", submittedAt: "2026-06-18T15:50:00.000Z", reviewedAt: "2026-06-19T09:10:00.000Z" },
  ],

  plans: [
    { id: "op-01", userId: "pu-05", beneficiaryName: "Maryam Abubakar", packageId: "pkg-premium", travelYear: 2027, frequency: "monthly", amountPerCycle: 520_000, balance: 4_160_000, status: "active" },
    { id: "op-02", userId: "pu-06", beneficiaryName: "Yusuf Olatunji", packageId: "pkg-standard", travelYear: 2027, frequency: "monthly", amountPerCycle: 400_000, balance: 4_800_000, status: "active" },
    { id: "op-03", userId: "pu-06", beneficiaryName: "Rukayat Olatunji (mother)", packageId: "pkg-standard", travelYear: 2028, frequency: "quarterly", amountPerCycle: 900_000, balance: 1_800_000, status: "active" },
    { id: "op-04", userId: "pu-07", beneficiaryName: "Fatima Danjuma", packageId: "pkg-standard", travelYear: 2027, frequency: "weekly", amountPerCycle: 95_000, balance: 3_325_000, status: "paused" },
    { id: "op-05", userId: "pu-09", beneficiaryName: "Zainab Abubakar", packageId: "pkg-executive", travelYear: 2028, frequency: "monthly", amountPerCycle: 750_000, balance: 5_250_000, status: "active" },
    { id: "op-06", userId: "pu-10", beneficiaryName: "Musa Bello", packageId: "pkg-standard", travelYear: 2027, frequency: "monthly", amountPerCycle: 450_000, balance: 2_250_000, status: "active" },
    { id: "op-07", userId: "pu-10", beneficiaryName: "Hauwa Bello (wife)", packageId: "pkg-standard", travelYear: 2028, frequency: "monthly", amountPerCycle: 300_000, balance: 900_000, status: "active" },
  ],

  tickets: [
    {
      id: "tk-1042",
      name: "Fatima Danjuma",
      email: "fatima.danjuma@gmail.com",
      phone: "08051112299",
      topic: "I can no longer travel for Hajj",
      status: "open",
      createdAt: "2026-11-09T18:22:00.000Z",
      messages: [
        {
          id: "tm-1",
          from: "customer",
          author: "Fatima Danjuma",
          body: "Assalamu alaikum. My husband has fallen ill and I will not be able to travel in 2027 as planned. I paused my plan last month. Please advise what happens to the money I have saved so far.",
          at: "2026-11-09T18:22:00.000Z",
        },
      ],
    },
    {
      id: "tk-1041",
      name: "Yusuf Olatunji",
      email: "y.olatunji@gmail.com",
      topic: "An existing plan or deposit",
      status: "pending",
      assigneeId: "adm-03",
      createdAt: "2026-11-08T09:10:00.000Z",
      messages: [
        {
          id: "tm-2",
          from: "customer",
          author: "Yusuf Olatunji",
          body: "I paid ₦400,000 through Paystack on Friday but it has not shown on my mother's plan yet. Reference HP-TR-552901.",
          at: "2026-11-08T09:10:00.000Z",
        },
        {
          id: "tm-3",
          from: "admin",
          author: "Tunde Okafor",
          body: "Wa alaikum salam. The Paystack payment was matched to your own plan instead of your mother's. We are moving it across now and will confirm once it reflects.",
          at: "2026-11-08T11:45:00.000Z",
        },
      ],
    },
    {
      id: "tk-1040",
      name: "Sani Garba",
      email: "sanigarba@gmail.com",
      topic: "KYC / verification",
      status: "open",
      createdAt: "2026-11-10T08:05:00.000Z",
      messages: [
        {
          id: "tm-4",
          from: "customer",
          author: "Sani Garba",
          body: "I submitted my NIN and passport this morning. How long does the verification take? I want to start my plan this month.",
          at: "2026-11-10T08:05:00.000Z",
        },
      ],
    },
    {
      id: "tk-1039",
      name: "Rabiu Abdulkadir",
      email: "rabiu.travels@gmail.com",
      phone: "08033214455",
      topic: "Group or operator enquiry",
      status: "open",
      createdAt: "2026-11-07T13:40:00.000Z",
      messages: [
        {
          id: "tm-5",
          from: "customer",
          author: "Rabiu Abdulkadir",
          body: "We are a licensed operator in Kano with 120 pilgrims for 2027. We would like to onboard our group onto HajjPath. Who can we speak to?",
          at: "2026-11-07T13:40:00.000Z",
        },
      ],
    },
    {
      id: "tk-1035",
      name: "Maryam Abubakar",
      email: "maryam.abubakar@gmail.com",
      topic: "Sponsoring a family member",
      status: "closed",
      assigneeId: "adm-01",
      createdAt: "2026-10-30T10:00:00.000Z",
      messages: [
        {
          id: "tm-6",
          from: "customer",
          author: "Maryam Abubakar",
          body: "Can I add my father as a beneficiary on my account?",
          at: "2026-10-30T10:00:00.000Z",
        },
        {
          id: "tm-7",
          from: "admin",
          author: "Aisha Bello",
          body: "Yes. Open Family plans in the app and choose Add a plan, then select Parent as the relationship. He will need his own NIN and passport for verification.",
          at: "2026-10-30T12:20:00.000Z",
        },
      ],
    },
  ],

  vendors: [
    ...VENDORS.map(
      (v): OpsVendor => ({
        ...v,
        contact: `${v.name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@vendors.hajjpath.ng`,
        status: "approved",
        appliedAt: `${v.since}-01-01T00:00:00.000Z`,
      }),
    ),
    {
      id: "vnd-app-01",
      name: "Zamzam Fresh Kitchen",
      ...NEW_VENDOR_DEFAULTS,
      location: "Aziziyah, Makkah",
      contact: "orders@zamzamfresh.sa",
      categories: ["food"],
      status: "pending",
      appliedAt: "2026-11-06T11:00:00.000Z",
      note: "Nigerian and West African meals delivered to hotels in Aziziyah. Commercial registration and municipal food licence uploaded.",
    },
    {
      id: "vnd-app-02",
      name: "Haramain Mobile Hub",
      ...NEW_VENDOR_DEFAULTS,
      location: "Ajyad Street, Makkah",
      contact: "sales@haramainmobile.sa",
      categories: ["electronics"],
      status: "pending",
      appliedAt: "2026-11-08T15:30:00.000Z",
      note: "Local SIM cards, power banks and chargers. Commercial registration uploaded; VAT certificate pending.",
    },
    {
      id: "vnd-app-03",
      name: "Madinah Dates Emporium",
      ...NEW_VENDOR_DEFAULTS,
      location: "Quba Road, Madinah",
      contact: "info@madinahdates.sa",
      categories: ["food", "souvenirs"],
      status: "pending",
      appliedAt: "2026-11-09T09:45:00.000Z",
      note: "Ajwa and Sukkari dates with delivery to Madinah hotels. All documents uploaded.",
    },
  ],

  products: PRODUCTS,
  hiddenProducts: [],

  disputes: [
    {
      id: "dsp-301",
      orderId: "HP-ORD-88214",
      buyer: "Musa Bello",
      vendorName: "Al-Barakah Ihram House",
      amountSAR: 185,
      reason: "Received one Ihram set instead of the two ordered. Vendor has not replied for 30 hours.",
      openedAt: "2026-11-08T17:20:00.000Z",
      status: "open",
    },
    {
      id: "dsp-300",
      orderId: "HP-ORD-88107",
      buyer: "Zainab Abubakar",
      vendorName: "Adahi Livestock Cooperative",
      amountSAR: 720,
      reason: "Hady sacrifice confirmation certificate not received after the slaughter window closed.",
      openedAt: "2026-11-06T10:05:00.000Z",
      status: "open",
    },
    {
      id: "dsp-296",
      orderId: "HP-ORD-87650",
      buyer: "Yusuf Olatunji",
      vendorName: "Al-Barakah Ihram House",
      amountSAR: 95,
      reason: "Item arrived late to the Mina tent.",
      openedAt: "2026-10-21T08:00:00.000Z",
      status: "released",
      resolutionNote: "Delivered within the stated window per courier log. Funds released to vendor.",
    },
  ],

  packages: HAJJ_PACKAGES,

  faqs: FAQS.map((f, i) => ({ ...f, id: `faq-${String(i + 1).padStart(2, "0")}` })),

  announcements: [],

  sos: [
    {
      id: "osos-01",
      pilgrim: "Hajiya Amina Sule",
      group: "Al-Amanah Umrah Group Nov 2026",
      category: "heat",
      note: "Feeling faint after Asr at the Mataf, sitting near Gate 79.",
      location: "Masjid al-Haram, Gate 79",
      raisedAt: "2026-11-10T13:42:00.000Z",
      status: "dispatched",
      respondent: "Locating the nearest responder",
    },
    {
      id: "osos-02",
      pilgrim: "Alhaji Bashir Ahmed",
      group: "Al-Hidayah Umrah Group Nov 2026",
      category: "lost",
      note: "Separated from group after Isha. Phone at 12% battery.",
      location: "Ibrahim Al-Khalil Street, near Hilton",
      raisedAt: "2026-11-10T11:05:00.000Z",
      status: "acknowledged",
      respondent: "Group admin Rabiu Abdulkadir en route",
    },
    {
      id: "osos-03",
      pilgrim: "Hajiya Rakiya Danladi",
      group: "Al-Amanah Umrah Group Nov 2026",
      category: "medical",
      note: "Fall on the stairs, ankle swollen.",
      location: "Hotel Dar Al Eiman, Makkah",
      raisedAt: "2026-11-09T21:18:00.000Z",
      status: "resolved",
      respondent: "Red Crescent team 9 · treated on site",
    },
  ],

  checklist: CHECKLIST,
  group: PILGRIM_GROUP,
  itinerary: ITINERARY,

  audit: [
    { id: "au-03", at: "2026-11-09T16:02:00.000Z", admin: "Tunde Okafor", action: "Replied to ticket tk-1041" },
    { id: "au-02", at: "2026-11-09T10:15:00.000Z", admin: "Aisha Bello", action: "Approved KYC for Zainab Abubakar" },
    { id: "au-01", at: "2026-11-08T08:40:00.000Z", admin: "Aisha Bello", action: "Released escrow on dispute dsp-296" },
  ],
};
