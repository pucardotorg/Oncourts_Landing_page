import React, { useState, useEffect, useRef } from "react";
import { dummyData } from "./DetailedViewData";
import { InboxSearchResponse, OrderDetails } from "../../types/search";
import { downloadAsPDF } from "../../utils/downloadPdf";

interface DetailedViewModalProps {
  onClose: () => void;
  caseId?: string;
  filingNumber?: string;
  courtId?: string;
}

const DetailedViewModal: React.FC<DetailedViewModalProps> = ({
  onClose,
  filingNumber,
  courtId,
}) => {
  const data = dummyData;
  const modalContentRef = useRef<HTMLDivElement>(null);

  // State for order history data from API
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showAll, setShowAll] = useState({
    complainants: false,
    complainantAdvocates: false,
    accused: false,
  });

  // Lock body scrolling when modal is open
  useEffect(() => {
    // Save the current overflow value
    const originalOverflow = document.body.style.overflow;

    // Disable scrolling on the body
    document.body.style.overflow = "hidden";

    // Restore the original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // PDF configuration options
  const pdfConfig = {
    scale: 2,
    format: "a4",
    quality: 0.95,
    filename: `Case_Details_${data.caseNumber || "Report"}.pdf`,
    loading: {
      text: "Generating PDF...",
      subtext: "This may take a moment",
    },
  };

  // Fetch order history data from API
  useEffect(() => {
    const fetchOrderHistory = async () => {
      // Only fetch if we have the required parameters
      if (!filingNumber || !courtId) return;

      try {
        setLoading(true);
        setError(null);

        // Use centralized API endpoint from config
        const response = await fetch("/api/case/inbox-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filingNumber,
            courtId,
            forOrders: true, // We want orders, not payment tasks
            forPaymentTask: false,
            tenantId: "kl",
            limit: 10,
            offset: 0,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }

        const responseData: InboxSearchResponse = await response.json();
        setOrderHistory(responseData.orderDetailsList || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [filingNumber, courtId]); // Dependency array - refetch when these values change

  const renderList = (
    list: string[],
    show: boolean,
    key: "complainants" | "complainantAdvocates" | "accused"
  ) => {
    const visibleItems = show ? list : list.slice(0, 2);
    return (
      <>
        {visibleItems.map((item, idx) => (
          <p key={idx}>{item}</p>
        ))}
        {list.length > 2 && (
          <button
            className="text-blue-600 text-xs underline mt-1"
            onClick={() =>
              setShowAll((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          >
            {show ? "View Less" : "View All"}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="font-roboto fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalContentRef}
        className="bg-white rounded-lg w-[80%] relative overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="sticky top-0 z-50 bg-white border-b-2 border-[#E2E8F0] px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-[#0F172A]">
            Detailed View |{" "}
            <span className="text-[#0F766E]">{data.caseTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-[#334155] border-2 border-[#E2E8F0] rounded-md text-sm hover:bg-teal-700 transition"
              onClick={() => downloadAsPDF(pdfConfig, modalContentRef)}
              title="Download as PDF"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </button>
            <button
              className="text-3xl font-medium text-gray-700 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-y-2 bg-sandBg p-4 rounded-md text-sm">
            <div className="flex flex-col border-r pr-4">
              <span className="text-sm font-base text-[#77787B]">Case Number</span>
              <span className="text-[16px] font-bold text-[#0B0C0C]">
                {data.caseNumber}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">CNR Number</span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">{data.cnrNumber}</span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">Filing Number</span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {data.filingNumber}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">Filing Date</span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {data.filingDate}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">Registration Date</span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {data.registrationDate}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">Magistrate</span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {data.magistrate}
              </span>
            </div>
            <div className="flex flex-col pl-2">
              <span className="text-sm font-base text-[#77787B]">Court Name</span>
              <span className="text-[16px] font-bold text-[#0B0C0C]">{data.courtName}</span>
            </div>
          </div>

          <div className="bg-sandBg p-4 rounded-md text-sm">
            <h2 className="text-[#334155] text-xl font-semibold border-b pb-2 mb-3">
              Litigant Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="pr-2 border-r">
                <p className="text-[16px] font-bold">Complainant/s</p>
                {renderList(
                  data.complainants,
                  showAll.complainants,
                  "complainants"
                )}
              </div>
              <div className="pr-2 border-r">
                <p className="font-semibold">Complainant advocate/s</p>
                {renderList(
                  data.complainantAdvocates,
                  showAll.complainantAdvocates,
                  "complainantAdvocates"
                )}
              </div>
              <div className="pr-2 border-r">
                <p className="font-semibold">Accused</p>
                {renderList(data.accused, showAll.accused, "accused")}
              </div>
              <div>
                <p className="font-semibold">Accused Advocate/s</p>
                <p>{data.accusedAdvocates || "NA"}</p>
              </div>
            </div>
          </div>

          <div className="bg-sandBg p-4 rounded-md text-sm">
            <h2 className="text-[#334155] text-xl font-semibold border-b pb-2 mb-3">
              Key Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 pr-4 border-r">
                <div className="flex justify-between">
                  <span className="flex-1 font-semibold text-black">
                    Next Hearing Date
                  </span>
                  <span className="flex-1">{data.nextHearingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex-1 font-semibold text-black">
                    Purpose
                  </span>
                  <span className="flex-1">{data.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex-1 font-semibold text-black">
                    Last Hearing on
                  </span>
                  <span className="flex-1">{data.lastHearingDate}</span>
                </div>
              </div>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between">
                  <span className="flex-1 font-semibold text-black">
                    Case Stage
                  </span>
                  <span className="flex-1">{data.caseStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex-1 font-semibold text-black">
                    Process payment pending
                  </span>
                  <button
                    onClick={() => {
                      const taskSection = document.getElementById(
                        "pendingTasksSection"
                      );
                      taskSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 text-left text-red-600 underline hover:text-red-700"
                  >
                    {data.appearance}
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4 bg-white">
            {/* Order History Section */}
            <h2 className="text-lg font-semibold mb-3">Order History</h2>
            {loading ? (
              <div className="text-center py-4">Loading order history...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
              <>
                {orderHistory.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="px-2 py-1">S.no</th>
                        <th className="px-2 py-1">Date</th>
                        <th className="px-2 py-1">Business Of The Day</th>
                        <th className="px-2 py-1 text-center">View Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-2 py-2">{idx + 1}</td>
                          <td className="px-2 py-2">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2">{item.businessOfTheDay}</td>
                          <td className="px-2 py-2 text-center">
                            <button className="px-3 border text-sm rounded-md bg-white border-gray-300 hover:bg-gray-100">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4">
                    No order history available
                  </div>
                )}
              </>
            )}

            <div className="mt-2 mb-6">
              <button className="text-blue-600 text-sm underline">
                See more Orders
              </button>
            </div>

            {/* Process Payment Pending Tasks Section */}
            <div id="pendingTasksSection">
              <h2 className="text-lg font-semibold mb-3">
                Process Payment Pending Tasks
              </h2>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="px-2 py-1">S.no</th>
                    <th className="px-2 py-1">Task</th>
                    <th className="px-2 py-1">Due Date</th>
                    <th className="px-2 py-1">Days Remaining</th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.pendingTasks.map((task, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="px-2 py-2">{idx + 1}</td>
                      <td className="px-2 py-2">{task.task}</td>
                      <td className="px-2 py-2">{task.dueDate}</td>
                      <td className="px-2 py-2 text-red-600">
                        {task.daysRemaining}
                      </td>
                      <td className="px-2 py-2">i</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedViewModal;
