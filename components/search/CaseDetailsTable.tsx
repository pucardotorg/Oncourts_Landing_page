import React from "react";
import { FiSearch } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CaseResult {
  caseTitle: string;
  caseNumber: string;
  nextHearingDate: string;
  purpose: string;
}

interface CaseDetailsTableProps {
  searchResults: CaseResult[];
  onViewCaseDetails: (caseNumber: string) => void;
  totalCount?: number;
  offset?: number;
  limit?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

const CaseDetailsTable: React.FC<CaseDetailsTableProps> = ({
  searchResults,
  onViewCaseDetails,
  totalCount = 0,
  offset = 0,
  limit = 10,
  onNextPage,
  onPrevPage,
}) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-['Inter'] font-semibold text-[22.2px] leading-[31.72px] tracking-[0%] text-[#0F172A]">
          Case Details
        </h2>
        <div className="relative text-base">
          <input
            type="text"
            placeholder="Search by case title"
            className="pl-10 pr-4 py-2 bg-[#F8FAFC] border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#334155]" />
        </div>
      </div>

      <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
        {searchResults.length > 0 && (
          <table className="min-w-full font-['Inter']">
            <thead className="bg-[#F8FAFC]">
              <tr className="font-['Inter'] font-semibold text-[#0F172A]">
                <th
                  scope="col"
                  className="p-4 text-left text-[18px] font-semibold text-[#0F172A] w-2/6 border-[#E2E8F0]"
                >
                  Case Title
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-[18px] font-semibold text-[#0F172A] w-1/6 border-[#E2E8F0]"
                >
                  Case Number
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-[18px] font-semibold text-[#0F172A] w-1/6 border-[#E2E8F0]"
                >
                  Next Hearing Date
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-[18px] font-semibold text-[#0F172A] w-1/6 border-[#E2E8F0]"
                >
                  Purpose
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-[18px] font-semibold text-[#0F172A] w-1/6"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={index} className="bg-white border-t border-[#E2E8F0]">
                  <td className="p-4 font-['Inter'] font-medium text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {result.caseTitle}
                  </td>
                  <td className="p-4 font-['Inter'] font-medium text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {result.caseNumber}
                  </td>
                  <td className="p-4 font-['Inter'] font-medium text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {result.nextHearingDate}
                  </td>
                  <td className="p-4 font-['Inter'] font-medium text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {result.purpose}
                  </td>
                  <td className="p-2 font-['Inter'] font-semibold text-[16px] leading-[18px] text-[#334155]">
                    <button
                      onClick={() => onViewCaseDetails(result.caseNumber)}
                      className="p-2 rounded-md border-2 text-teal-600 hover:text-teal-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls */}
      {totalCount > 0 && (
        <div className="flex items-center justify-end mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onPrevPage}
              disabled={offset === 0}
              className={`flex items-center justify-center w-8 h-8 rounded border border-[#CBD5E1] bg-[#F8FAFC] ${offset === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FiChevronLeft size={18} />
            </button>

            <div className="font-['Inter'] font-medium text-base text-gray-700">
              {offset + 1}-{Math.min(offset + limit, totalCount)} of{" "}
              {totalCount}
            </div>

            <button
              onClick={onNextPage}
              disabled={offset + limit >= totalCount}
              className={`flex items-center justify-center w-8 h-8 rounded border border-[#CBD5E1] bg-[#F8FAFC] ${offset + limit >= totalCount ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetailsTable;
