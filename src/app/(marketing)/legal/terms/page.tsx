import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms governing your use of HajjPath savings plans, the Makkah marketplace, and the pilgrimage companion features.",
};

export default function TermsPage() {
  return (
    <>
      <Badge tone="brand">Last updated 15 July 2026</Badge>
      <h1 className="mt-4">Terms of service</h1>
      <p>
        These terms govern your use of HajjPath, operated by HajjPath Technologies Limited
        (RC 7418205), a company registered in Nigeria. By creating an account you agree to
        them. Please read them alongside our{" "}
        <a href="/legal/privacy">privacy policy</a>.
      </p>

      <h2>1. What HajjPath does and does not do</h2>
      <p>
        HajjPath provides a structured savings facility for pilgrimage, together with
        planning, guidance, marketplace and safety tools for use before and during Hajj.
      </p>
      <p>
        <strong>HajjPath does not allocate Hajj seats.</strong> Seat allocation, visa
        issuance and airlift scheduling remain the exclusive responsibility of the National
        Hajj Commission of Nigeria (NAHCON) and the State Pilgrims Welfare Boards. Meeting
        your savings goal makes you eligible to apply; it does not guarantee a seat in any
        particular year.
      </p>

      <h2>2. Eligibility and verification</h2>
      <ul>
        <li>You must be at least 18 years old and a Nigerian citizen or resident.</li>
        <li>
          You must provide accurate identity information including your BVN, NIN and
          international passport details.
        </li>
        <li>
          Accounts that fail verification cannot hold funds. Where verification fails we
          will tell you which field to correct.
        </li>
        <li>
          You may open plans for other beneficiaries (a spouse, parent or child) provided
          you disclose the relationship truthfully.
        </li>
      </ul>

      <h2>3. Savings, custody and returns</h2>
      <ul>
        <li>
          Balances are held in a ring-fenced trust account with a licensed Nigerian bank,
          separate from HajjPath&apos;s own operating funds.
        </li>
        <li>
          Deposits may be placed in Shariah-screened Mudarabah pools. Any return is shared
          as profit and is not guaranteed. Losses in a pool are borne proportionally.
        </li>
        <li>
          HajjPath charges a quarterly custody fee, disclosed in your ledger before it is
          applied. No fee is charged on deposits themselves.
        </li>
        <li>
          Fares shown for Hajj packages are indicative and reconciled against the gazetted
          NAHCON figure each season. Differences are refunded or invoiced before departure.
        </li>
      </ul>

      <h2>4. Withdrawals</h2>
      <p>
        Your savings belong to you. Withdrawal requests are paid to the bank account tied
        to your BVN, normally within two business days. Fees already earned on completed
        quarters are retained. Withdrawals require an OTP sent to the phone number
        registered against your BVN.
      </p>

      <h2>5. Marketplace and escrow</h2>
      <ul>
        <li>
          HajjPath is a marketplace facilitator. Vendors are independent businesses
          responsible for the goods they supply.
        </li>
        <li>
          Payment is held in escrow and released to the vendor only after you confirm
          delivery, or automatically 72 hours after a delivery is marked complete and
          undisputed.
        </li>
        <li>
          Disputes are reviewed by HajjPath within one business day. Refunds are paid from
          the escrow float.
        </li>
        <li>
          Livestock and sacrifice (hady) orders are fulfilled through licensed Adahi
          channels at the appointed ritual time and cannot be cancelled after 8
          Dhul-Hijjah.
        </li>
      </ul>

      <h2>6. Safety features</h2>
      <p>
        Find Me, live location sharing and the SOS button are support tools, not emergency
        services. In a genuine emergency in the Kingdom you must also contact Saudi Red
        Crescent on 997 or Saudi security on 911. HajjPath cannot guarantee network
        coverage, GPS accuracy or response times in the Mashaer.
      </p>

      <h2>7. Acceptable use</h2>
      <ul>
        <li>Do not impersonate another person or submit identity documents that are not yours.</li>
        <li>Do not use HajjPath to launder funds or to finance anything unlawful.</li>
        <li>
          Do not share another pilgrim&apos;s location, photographs or contact details
          outside your group without their consent.
        </li>
        <li>Do not attempt to interfere with the platform, its data or other users.</li>
      </ul>

      <h2>8. Suspension and closure</h2>
      <p>
        We may suspend an account where we reasonably suspect fraud, impersonation or
        misuse. Where an account is suspended, the balance remains yours and is returned
        to your verified bank account once the matter is resolved. You may close your
        account at any time.
      </p>

      <h2>9. Liability</h2>
      <p>
        HajjPath is not liable for losses arising from events outside our reasonable
        control, including changes to Saudi regulations, airlift delays, NAHCON quota
        decisions, network outages, or the acts of independent vendors and operators. This
        does not limit liability that cannot lawfully be limited.
      </p>

      <h2>10. Changes and governing law</h2>
      <p>
        We will give at least 30 days&apos; notice before any material change to these
        terms. They are governed by the laws of the Federal Republic of Nigeria, and
        disputes are subject to the jurisdiction of the courts of Lagos State.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href="mailto:legal@hajjpath.ng">legal@hajjpath.ng</a> or to HajjPath
        Technologies Limited, 14 Kofo Abayomi Street, Victoria Island, Lagos.
      </p>
    </>
  );
}
