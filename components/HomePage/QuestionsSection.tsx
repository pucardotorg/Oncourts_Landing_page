import React, { useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import Link from "next/link";

interface QuestionProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => (
  <div className="border-b border-[#E5E5E5] last:border-b-0">
    <button
      className="w-full flex items-center justify-between py-6 text-left"
      onClick={onToggle}
    >
      <span className="font-sans font-medium text-[20px] leading-[28px] tracking-[0.01em] text-[#3A3A3A] pr-8">
        {question}
      </span>
      <span className="flex-shrink-0">
        {isOpen ? <svgIcons.upArrowIcon /> : <svgIcons.downArrowIcon />}
      </span>
    </button>
    {isOpen && (
      <div className="pb-6">
        <div className="font-sans text-[16px] leading-[24px] tracking-[0.01em] text-[#64748B]">
          {answer}
        </div>
      </div>
    )}
  </div>
);

const QuestionsSection: React.FC = () => {
  const { t } = useSafeTranslation();
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(0);

  const questions = [
    {
      id: 0,
      question: t("WHERE_CHECK_HEARING_DETAILS"),
      answer: (
        <div className="space-y-4 text-[#1E293B] text-[16px] leading-[24px]">
          <p>
            {t("WHERE_CHECK_HEARING_DETAILS_ANSWER_1")}
            <Link href="/search" className="text-[#0F766E] hover:underline">
              {t("CASE_SEARCH")}
            </Link>
            {t("WHERE_CHECK_HEARING_DETAILS_ANSWER_2")}
            <strong>{t("VIEW_DETAILS")}</strong>
            {t("WHERE_CHECK_HEARING_DETAILS_ANSWER_3")}
          </p>
        </div>
      ),
    },
    {
      id: 1,
      question:
        "How can I view tasks I need to complete to move my case forward?",
      answer: (
        <div className="space-y-4 text-[#1E293B] text-[16px] leading-[24px]">
          <p>
            You can access pending tasks by logging into the{" "}
            <Link href="/login" className="text-[#0F766E] hover:underline">
              ON Court portal
            </Link>{" "}
            and navigating to the &quot;All Pending Tasks&quot; section on the
            right-side panel in the homepage. Alternatively, you can use the{" "}
            <Link href="/search" className="text-[#0F766E] hover:underline">
              Case Search
            </Link>{" "}
            section under the Services tab to review pending payments, such as
            online fees or stamp and envelope submissions (applicable for RPAD
            channel only) related notices, summons, or warrants.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      question:
        "How can I check if my cases are scheduled for hearing on a specific day?",
      answer: (
        <div className="space-y-4 text-[#1E293B] text-[16px] leading-[24px]">
          <p>
            You can use the{" "}
            <Link
              href="/display-board"
              className="text-[#0F766E] hover:underline"
            >
              Display Board
            </Link>{" "}
            to view all cases listed for a chosen date. You can also search the
            cases by case number, case title or advocate name in this section.
          </p>
          <p>
            Alternatively, you can access the{" "}
            <Link href="/search" className="text-[#0F766E] hover:underline">
              Case Search
            </Link>{" "}
            section under the Services tab to check the next hearing dates for
            all your cases.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      question: "Can I join my hearing online?",
      answer: (
        <div className="space-y-4 text-[#1E293B] text-[16px] leading-[24px]">
          <p>
            Yes. You can join your hearing online by clicking the &apos;Join
            Hearing&apos; button available in the{" "}
            <Link
              href="/display-board"
              className="text-[#0F766E] hover:underline"
            >
              Display Board
            </Link>{" "}
            section of the website.
          </p>
          <p>
            You can also use the Display Board to check the live status of
            hearings and see which case is currently being heard.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      question: "What documents are required for e-filing?",
      answer: (
        <div className="space-y-6 text-[#1E293B] text-[16px] leading-[24px]">
          <p className="mb-4">List of documents required for e-filing:</p>
          <ol className="list-decimal pl-8 space-y-4">
            <li>
              <strong>Proof of identity:</strong> PAN Card, Aadhar card,
              Passport, Driving license, Voter ID, Ration card or Bank passbook
            </li>
            <li>
              <strong>Dishonored Cheque:</strong> A copy of the dishonored
              cheque on the basis which this case is being filed
            </li>
            <li>
              <strong>Cheque Return Memo:</strong> The document received from
              the bank that has the information that the cheque has bounced
            </li>
            <li>
              <strong>Legal Demand Notice:</strong> Any intimation you provided
              to the respondent to informing them that their cheque had bounced
              and they still owed you the cheque amount
            </li>
            <li>
              <strong>
                Postal acknowledgement (Issue of legal demand notice):
              </strong>{" "}
              The acknowledgement provided by the postal department when sending
              the letter/RPAD/anything else containing legal demand notice (see
              number 4 in the list) to the accused
            </li>
            <li>
              <strong>
                Postal acknowledgement (Delivery of legal demand notice):
              </strong>{" "}
              The acknowledgement provided by the postal department when the
              letter/RPAD/anything else containing legal demand notice (see
              number 4 in the list) is received by the accused
            </li>
            <li>
              <strong>Affidavit under section 223 of BNSS:</strong> Affidavit
              under section 223 of BNSS must be there in the infobox at the
              start of filing
            </li>
            <li>
              <strong>Any other document you deem necessary:</strong> Please
              include any additional documents you believe will strengthen your
              case and that will be crucial in substantiating your claims when
              filing the complaint
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 5,
      question: "What documents are required for Bail?",
      answer: (
        <div className="space-y-6 text-[#1E293B] text-[16px] leading-[24px]">
          <p className="mb-4">List of documents required for Bail:</p>
          <ol className="list-decimal pl-8 space-y-4">
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
      id: 6,
      question:
        "Are there videos or guides to help me understand how to use the platform (e.g., filing, application submission, payments)?",
      answer: (
        <div className="space-y-6 text-[#1E293B] text-[16px] leading-[24px]">
          <p>
            Yes. You can access step-by-step user guides and short video
            tutorials to learn how to file cases, submit applications, make
            payments, and more.
          </p>
          <p>
            These resources are available under the Support tab in the
            navigation menu. You can also use the direct links below:
          </p>
          <ol className="list-decimal pl-8 space-y-4">
            <li>
              User Guide for Advocates and Clerks:{" "}
              <Link
                href="/advocate-guide"
                className="text-[#0F766E] hover:underline"
              >
                Link
              </Link>
            </li>
            <li>
              Video tutorials for Advocates and Clerks:{" "}
              <Link
                href="/advocate-tutorials"
                className="text-[#0F766E] hover:underline"
              >
                Link
              </Link>
            </li>
          </ol>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full bg-white py-16">
      <div className="px-6 bg-[#F0FDFA]">
        <h2 className="font-libre font-normal text-[48px] leading-[56px] text-center text-[#3A3A3A] mb-12">
          {t("FREQUENTLY_ASKED_QUESTIONS")}
        </h2>
        <div className="max-w-[60%] mx-auto">
          {questions.map((q) => (
            <Question
              key={q.id}
              question={q.question}
              answer={q.answer}
              isOpen={openQuestionId === q.id}
              onToggle={() =>
                setOpenQuestionId(openQuestionId === q.id ? null : q.id)
              }
            />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <button
            className="flex items-center gap-2 px-8 py-4 border border-[#0F766E] rounded-xl text-[#0F766E] hover:bg-[#F1F5F9] transition-colors"
            onClick={() => window.open("/help", "_blank")}
          >
            <svgIcons.openInNewTabIcon />
            <span className="font-sans font-medium text-[16px] leading-[24px] tracking-[0.01em]">
              {t("HELP_AND_SUPPORT")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuestionsSection;
