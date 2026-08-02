import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How HajjPath collects, uses, stores and protects your identity documents, financial records and location data under the Nigeria Data Protection Act.",
};

export default function PrivacyPage() {
  return (
    <>
      <Badge tone="brand">Last updated 15 July 2026</Badge>
      <h1 className="mt-4">Privacy policy</h1>
      <p>
        HajjPath Technologies Limited (RC 7418205) is the data controller for the personal
        information described here. We process it under the Nigeria Data Protection Act
        2023 and, for users in Europe, the UK and EU GDPR.
      </p>

      <h2>1. What we collect</h2>
      <h3>Identity data</h3>
      <ul>
        <li>Name, date of birth, gender, state and city of residence</li>
        <li>Phone number and email address</li>
        <li>Bank Verification Number (BVN) and National Identity Number (NIN)</li>
        <li>International passport data page and passport photograph</li>
      </ul>

      <h3>Financial data</h3>
      <ul>
        <li>Savings plan details, contributions, balances and withdrawal history</li>
        <li>Virtual account number and settlement bank details</li>
        <li>Marketplace orders and escrow transactions</li>
      </ul>

      <h3>Journey data</h3>
      <ul>
        <li>Group membership, camp and room assignment, and pilgrim tag code</li>
        <li>Location, only while you have location sharing switched on</li>
        <li>Itinerary progress, checklist state, journal entries and gallery uploads</li>
        <li>SOS alerts, including position and the category of emergency</li>
      </ul>

      <h2>2. Why we process it</h2>
      <ul>
        <li>
          <strong>To verify identity</strong> — Nigerian financial regulation requires
          verified identity before an account can hold funds.
        </li>
        <li>
          <strong>To operate your savings plan</strong> — reconciling deposits, calculating
          progress and processing withdrawals.
        </li>
        <li>
          <strong>To keep you safe</strong> — routing SOS alerts, enabling Find Me inside
          your group, and reaching your emergency contacts.
        </li>
        <li>
          <strong>To fulfil marketplace orders</strong> — sharing only the delivery address
          and order contents with the vendor concerned.
        </li>
        <li>
          <strong>To meet legal obligations</strong> — anti-money-laundering checks, record
          keeping and lawful requests from regulators.
        </li>
      </ul>

      <h2>3. Who we share it with</h2>
      <ul>
        <li>
          <strong>KYC providers</strong> (VerifyMe, SmileID) — to validate your BVN and NIN.
          They receive only what is needed for the check.
        </li>
        <li>
          <strong>Payment partners</strong> (Paystack, Flutterwave, Moniepoint) and our
          custody bank — to operate your virtual account and settle transactions.
        </li>
        <li>
          <strong>Your group admin and operator</strong> — your name, tag code, welfare
          status and, if sharing is on, your position within the group.
        </li>
        <li>
          <strong>Marketplace vendors</strong> — your delivery location and order details
          only. Vendors never receive your BVN, NIN or savings information.
        </li>
        <li>
          <strong>NAHCON and State Pilgrims Boards</strong> — your compliance pack, and only
          when you choose to submit it.
        </li>
      </ul>
      <p>
        <strong>We do not sell personal data, ever</strong>, and we do not share it for
        third-party advertising.
      </p>

      <h2>4. Location data specifically</h2>
      <p>
        Location sharing is off by default and can be turned off at any time from your
        profile. When it is on, your position is visible only to members of your group code
        and to the HajjPath support desk. Position history is end-to-end encrypted and
        automatically deleted <strong>thirty days after you return</strong> from the
        pilgrimage.
      </p>

      <h2>5. How long we keep it</h2>
      <ul>
        <li>Identity and financial records: seven years after account closure, as required by law.</li>
        <li>Location history: thirty days after the end of your pilgrimage.</li>
        <li>Journal entries and gallery uploads: until you delete them or close your account.</li>
        <li>Support conversations: two years.</li>
      </ul>

      <h2>6. How we protect it</h2>
      <ul>
        <li>Encryption in transit (TLS 1.3) and at rest (AES-256).</li>
        <li>End-to-end encryption on group messaging and location sharing.</li>
        <li>Two-factor authentication, biometric unlock and device binding.</li>
        <li>Withdrawals require an OTP sent to your BVN-registered phone number.</li>
        <li>Role-based internal access with audit logging on every identity record.</li>
      </ul>

      <h2>7. Your rights</h2>
      <p>
        You may request access to your data, correction of anything inaccurate, deletion
        where we have no legal obligation to retain it, a portable export, or restriction
        of certain processing. You may also withdraw consent for optional processing such
        as location sharing and marketing messages.
      </p>
      <p>
        Write to <a href="mailto:privacy@hajjpath.ng">privacy@hajjpath.ng</a>. We respond
        within thirty days. If you are unsatisfied you may complain to the Nigeria Data
        Protection Commission.
      </p>

      <h2>8. Children</h2>
      <p>
        HajjPath accounts are for adults. Where a plan names a child as beneficiary, the
        adult account holder is responsible for that data and the child does not have their
        own login.
      </p>

      <h2>9. International transfers</h2>
      <p>
        Some processing takes place on servers outside Nigeria, including in the Kingdom of
        Saudi Arabia during the Hajj season, so that safety features work with acceptable
        latency. Transfers are covered by standard contractual clauses and equivalent
        safeguards.
      </p>

      <h2>10. Contact</h2>
      <p>
        Data Protection Officer, HajjPath Technologies Limited, 14 Kofo Abayomi Street,
        Victoria Island, Lagos ·{" "}
        <a href="mailto:privacy@hajjpath.ng">privacy@hajjpath.ng</a>
      </p>
    </>
  );
}
