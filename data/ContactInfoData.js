import Link from "next/link";
import { APP_URLS } from "../lib/config";

export const contactInfoData = [
  {
    icon: "PhoneIcon",
    title: "Helpline Number:",
    content: "047 - 42919099",
    href: "callto:oncourt@gmail.com",
  },
  {
    icon: "HelpDeskIcon",
    title: "",
    content: "In-person Helpdesk at 24x7 ON Court, Kollam",
  },
  {
    icon: "ClockIcon",
    title: "Availability:",
    content: "10:00 - 17:00 IST",
    subContent: "Monday - Saturday except 2nd Saturday",
  },
  {
    icon: "EmailIcon",
    title: "Email:",
    content: "oncourtkollam@keralacourts.in",
    href: "mailto:oncourtkollam@keralacourts.in",
  },
];

export const faqs = [
  {
    question:
      "Where can I check the proceedings of the last hearing and the next hearing date?",
    answer: (
      <div>
        <p>
          You can find these details in the{" "}
          <Link href="/search" className="text-[#1D4ED8] underline">
            Case Search
          </Link>{" "}
          section under the Services tab on the ON Court website.
        </p>
        <p className="mt-2">
          Just enter your case number, CNR, or name to view the next hearing
          date, case stage, past orders and pending process payment tasks.
        </p>
        <p className="mt-2">
          You can access this from your mobile browser as well — no login
          needed!
        </p>
      </div>
    ),
  },
  {
    question:
      "Where can I see tasks I need to complete for my case to move forward?",
    answer: (
      <p>
        You can access pending tasks by logging into the ON Court portal and
        navigating to the All Pending Tasks section on the right-side panel in
        the homepage. Alternatively, you can use the{" "}
        <Link href="/search" className="text-[#1D4ED8] underline">
          Case Search
        </Link>{" "}
        section under the Services tab to review pending payments, such as
        online fees or stamp and envelope submissions (applicable for RPAD
        channel only) related to notices, summons, or warrants.
      </p>
    ),
  },
  {
    question:
      "How can I check if my cases are scheduled for hearing on a specific day?",
    answer: (
      <p>
        You can use the{" "}
        <Link href="/display-board" className="text-[#1D4ED8] underline">
          Display Board
        </Link>{" "}
        to view all cases listed for a chosen date. You can also search the
        cases by case number, case title or advocate name in this section.
        Alternatively, you can access the{" "}
        <Link href="/search" className="text-[#1D4ED8] underline">
          Case Search
        </Link>{" "}
        section under the Services tab to check the next hearing dates for all
        your cases.
      </p>
    ),
  },
  {
    question: "Can I join my hearing online?",
    answer: (
      <p>
        Yes. You can join your hearing online by clicking the Join Hearing
        button available in the Display Board section of the website. You can
        also use the{" "}
        <Link href="/display-board" className="text-[#1D4ED8] underline">
          Display Board
        </Link>{" "}
        to check the live status of hearings and see which case is currently
        being heard.
      </p>
    ),
  },
  {
    question: "What documents are required for e-filing?",
    answer: (
      <div>
        <p>List of documents required for e-filing:</p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>
            <span className="font-semibold">Proof of identity:</span> PAN Card,
            Aadhar card, Passport, Driving license, Voter ID, Ration card or
            Bank passbook
          </li>
          <li>
            <span className="font-semibold">Dishonored Cheque:</span> A copy of
            the dishonored cheque on the basis which this case is being filed
          </li>
          <li>
            <span className="font-semibold">Cheque Return Memo:</span> The
            document received from the bank that has the information that the
            cheque has bounced
          </li>
          <li>
            <span className="font-semibold">Legal Demand Notice:</span> Any
            intimation you provided to the respondent informing them that their
            cheque had bounced and they still owed you the cheque amount
          </li>
          <li>
            <span className="font-semibold">
              Postal acknowledgement (Issue of legal demand notice):
            </span>{" "}
            The acknowledgement provided by the postal department when sending
            the letter/RPAD/anything else containing legal demand notice (see
            number 4 in the list) to the accused.
          </li>
          <li>
            <span className="font-semibold">
              Postal acknowledgement (Delivery of legal demand notice):
            </span>{" "}
            The acknowledgement provided by the postal department when the
            letter/RPAD/anything else containing legal demand notice (see number
            4 in the list) is received by the accused
          </li>
          <li>
            <span className="font-semibold">
              Affidavit under section 223 of BNSS:
            </span>{" "}
            Affidavit under section 223 of BNSS must be there in the infobox at
            the start of filing.
          </li>
          <li>
            <span className="font-semibold">
              Any other document you deem necessary:
            </span>{" "}
            Please include any additional documents you believe will strengthen
            your case and that will be crucial in substantiating your claims
            when filing the complaint.
          </li>
        </ol>
      </div>
    ),
  },
  {
    question: "What documents are required for Bail?",
    answer: (
      <div>
        <p>List of documents required for Bail:</p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>Bail Application (System generated)</li>
          <li>ID proofs for surety(s)</li>
          <li>Tax receipts for surety(s)</li>
          <li>Affidavits for surety(s) (System Generated)</li>
          <li>Bail Bond</li>
          <li>Any other document you deem necessary</li>
        </ol>
      </div>
    ),
  },
  {
    question:
      "Are there videos or guides to help me understand how to use the platform (e.g., filing, application submission, payments)?",
    answer: (
      <div>
        <p>
          Yes. You can access step-by-step user guides and short video tutorials
          to learn how to file cases, submit applications, make payments, and
          more.
        </p>
        <p className="mt-2">
          These resources are available under the Support tab in the navigation
          menu. You can also use the direct links below:
        </p>
        <div className="mt-2">
          <ol className="list-decimal pl-6 mt-2 space-y-1">
            <li>
              <Link
                href="https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=sharing"
                className="text-[#1D4ED8] hover:underline block"
              >
                User Guide for Advocates and Clerks
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[#1D4ED8] hover:underline block">
                Video tutorials for Advocates and Clerks
              </Link>
            </li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    question: "How can I report an issue or request for support online?",
    answer: (
      <p>
        You can use the 24x7 ON Courts{" "}
        <Link
          href="https://forms.gle/uCSgGiqGiMQYjjgeA"
          className="text-[#1D4ED8] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support Form
        </Link>{" "}
        to report any issue or request a feature. The support team monitors all
        submissions and shares updates on the resolution with the concerned.
      </p>
    ),
  },
  {
    question: "How can I update my email ID on the portal?",
    answer: (
      <p>
        To update your email ID,{" "}
        <Link
          href={`${APP_URLS.CITIZEN_APP}`}
          className="text-[#1D4ED8] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          log in
        </Link>{" "}
        to the portal and click the profile icon at the top right corner of the
        homepage. Select Edit Profile, enter your email ID in the space
        provided, and click Continue to save.
      </p>
    ),
  },
  {
    question:
      "What should I do if I encounter an error message on the website?",
    answer: (
      <div>
        <p>
          You can attempt to refresh the page. If the issue persists, you can
          clear your browser cache and cookies by pressing Ctrl + Shift +
          Delete, selecting Cached Images and Files, and clicking Clear Data.
        </p>
        <p className="mt-2">
          If the problem continues, you can contact the ON Court Helpdesk using
          the following contact details:
        </p>
        <p className="mt-2">
          Phone Support: Call +91 474 2919099 (Monday to Saturday, 10:00 AM –
          5:00 PM)
        </p>
      </div>
    ),
  },
  {
    question: "How is my data protected on the platform?",
    answer: (
      <p>
        All personal and case-related data is securely stored and protected
        through authenticated, role-based access. Personally Identifiable
        Information (PII) is encrypted before storage, and the platform
        undergoes regular security audits to ensure compliance with data
        protection standards.
      </p>
    ),
  },
];
