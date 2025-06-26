import React, { useState, useEffect, useRef, useCallback } from "react";
import { downloadAsPDF } from "../../utils/downloadPdf";
import {
  CaseResult,
  InboxSearchResponse,
  OrderDetails,
  PartyInfo,
  PaymentTask,
} from "../../types";
import { FiInfo } from "react-icons/fi";

interface DetailedViewModalProps {
  onClose: () => void;
  caseResult: CaseResult;
}

const DetailedViewModal: React.FC<DetailedViewModalProps> = ({
  onClose,
  caseResult,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const tenantId = "kl";

  // State for order history data from API
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([]);
  const [paymentTasks, setPaymentTasks] = useState<PaymentTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIconId, setHoveredIconId] = useState<string | null>(null);

  const [showAll, setShowAll] = useState({
    complainants: false,
    complainantAdvocates: false,
    accuseds: false,
    accusedAdvocates: false,
  });

  // State for orders pagination
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [currentOrderPage, setCurrentOrderPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;
  const initialOrdersToShow = 2;

  // State for payment tasks pagination
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [currentTaskPage, setCurrentTaskPage] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const tasksPerPage = 10;
  const [magistrateName, setMagistrateName] = useState("");
  const [complainants, setComplainants] = useState<PartyInfo[]>([]);
  const [complainantAdvocates, setComplainantAdvocates] = useState<PartyInfo[]>(
    []
  );
  const [accuseds, setAccuseds] = useState<PartyInfo[]>([]);
  const [accusedAdvocates, setAccusedAdvocates] = useState<PartyInfo[]>([]);

  const formatDate = (dateStr?: string | number) => {
    try {
      const date = new Date(dateStr || "");
      return (
        date.getDate() +
        "-" +
        date.toLocaleString("default", { month: "long" }) +
        "-" +
        date.getFullYear()
      );
    } catch {
      return String(dateStr);
    }
  };

  useEffect(() => {
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
    filename: `Case_Details_Report"}.pdf`,
    loading: {
      text: "Generating PDF...",
      subtext: "This may take a moment",
    },
  };

  // Fetch magistrate/judge name from API
  const getMagistrateName = useCallback(async () => {
    if (!caseResult.courtId) return;

    try {
      const response = await fetch(
        `/api/case/magistrate?tenantId=${tenantId}&courtId=${caseResult.courtId}`
      );

      if (!response.ok) {
        console.error("Failed to fetch magistrate data:", response.statusText);
      }

      const data = await response.json();
      setMagistrateName(data.name || "");
    } catch (error) {
      console.error("Error fetching magistrate name:", error);
    }
  }, [caseResult]);

  const getCitizenDetails = useCallback(() => {
    if (!caseResult) {
      console.warn("caseResult is undefined in getCitizenDetails");
      return;
    }
    const complainantAdvocateDetails = Array.isArray(caseResult.advocates)
      ? caseResult.advocates.filter(
          (advocate) => advocate.entityType === "complainant"
        )
      : [];

    const accusedAdvocateDetails = Array.isArray(caseResult.advocates)
      ? caseResult.advocates.filter(
          (advocate) => advocate.entityType === "accused"
        )
      : [];

    const complainantDetails = Array.isArray(caseResult.litigants)
      ? caseResult.litigants.filter(
          (litigant) => litigant.entityType === "complainant"
        )
      : [];

    const accusedDetails = Array.isArray(caseResult.litigants)
      ? caseResult.litigants.filter(
          (litigant) => litigant.entityType === "accused"
        )
      : [];

    setComplainantAdvocates(complainantAdvocateDetails || []);
    setAccusedAdvocates(accusedAdvocateDetails || []);
    setComplainants(complainantDetails || []);
    setAccuseds(accusedDetails || []);
  }, [caseResult]);

  // Fetch order history data from API
  const fetchOrderHistory = useCallback(
    async (page = 0, initialLoad = false) => {
      if (!caseResult.filingNumber || !caseResult.courtId) return;
      try {
        if (initialLoad) {
          setLoading(true);
        }
        setError(null);

        const offset = page * ordersPerPage;
        const limit = initialLoad ? initialOrdersToShow : ordersPerPage;

        const payload = {
          filingNumber: caseResult.filingNumber,
          courtId: caseResult.courtId,
          forOrders: true,
          forPaymentTask: false,
          tenantId,
          limit: Number(limit),
          offset: Number(offset),
        };

        const response = await fetch("/api/case/orders-tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }

        const responseData: InboxSearchResponse = await response.json();

        // When getting initial data or first page, save total count for pagination
        if (initialLoad || page === 0) {
          setTotalOrders(responseData.totalCount || 0);
        }

        // Update order history based on current state
        setOrderHistory(responseData.orderDetailsList || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching order history:", err);
      } finally {
        if (initialLoad) {
          setLoading(false);
        }
      }
    },
    [caseResult, ordersPerPage]
  );

  // Fetch payment tasks from API
  const fetchPaymentTasks = useCallback(
    async (page = 0, initialLoad = false) => {
      if (!caseResult.filingNumber || !caseResult.courtId) return;

      try {
        if (initialLoad) {
          setLoading(true);
        }
        setError(null);

        const offset = page * tasksPerPage;
        const limit = tasksPerPage;

        const payload = {
          filingNumber: caseResult.filingNumber,
          courtId: caseResult.courtId,
          forOrders: false,
          forPaymentTask: true,
          tenantId,
          limit: Number(limit),
          offset: Number(offset),
        };

        const response = await fetch("/api/case/orders-tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment tasks");
        }

        const responseData: InboxSearchResponse = await response.json();

        // When getting initial data or first page, save total count for pagination
        if (initialLoad || page === 0) {
          setTotalTasks(responseData.totalCount || 0);
        }

        // Update payment tasks based on current state
        setPaymentTasks(responseData.paymentTasks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching payment tasks:", err);
      } finally {
        if (initialLoad) {
          setLoading(false);
        }
      }
    },
    [caseResult, tasksPerPage]
  );

  useEffect(() => {
    fetchOrderHistory(0, true);
    fetchPaymentTasks(0, true);
    getMagistrateName();
    getCitizenDetails();
  }, [
    fetchOrderHistory,
    getMagistrateName,
    getCitizenDetails,
    fetchPaymentTasks,
  ]);

  const renderList = (
    list: PartyInfo[],
    show: boolean,
    key:
      | "complainants"
      | "complainantAdvocates"
      | "accuseds"
      | "accusedAdvocates"
  ) => {
    const visibleItems = show ? list : list.slice(0, 2);
    return (
      <>
        {visibleItems.map((item, idx) => (
          <p className="text-[16px] font-normal" key={idx}>
            {item.name}
          </p>
        ))}
        {list.length > 2 && (
          <button
            className="text-[#006FD5] text-sm underline mt-1"
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

  const openFileInNewTab = async (orderId: string): Promise<void> => {
    if (!orderId) {
      console.error("Order ID is required");
      return;
    }

    try {
      // Direct API call to get the file
      const response = await fetch(
        `/api/case/downloadFile?tenantId=${tenantId}&orderId=${orderId}`
      );

      if (!response.ok) {
        throw new Error(`File download failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 5000);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="font-roboto fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalContentRef}
        className="bg-white rounded-lg w-[70%] relative overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="sticky top-0 z-50 bg-white border-b-2 border-[#E2E8F0] px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-[#0F172A]">
            Detailed View |{" "}
            <span className="text-[#0F766E]">{caseResult.caseTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-[#334155] border-2 border-[#E2E8F0] rounded-md text-sm hover:bg-teal-700 transition"
              onClick={() => downloadAsPDF(pdfConfig, modalContentRef)}
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

        <div className="overflow-y-auto px-6 pt-4 pb-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-y-2 bg-[#F7F5F3] p-4 rounded-md text-sm">
            <div className="flex flex-col border-r pr-4">
              <span className="text-sm font-base text-[#77787B]">
                Case Number
              </span>
              <span className="text-[16px] font-bold text-[#0B0C0C]">
                {caseResult.stNumber || caseResult.cmpNumber}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">
                CNR Number
              </span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {caseResult.cnrNumber}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">
                Filing Number
              </span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {caseResult.filingNumber}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">
                Filing Date
              </span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {formatDate(caseResult.filingDate)}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">
                Registration Date
              </span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {formatDate(caseResult.registrationDate)}
              </span>
            </div>
            <div className="flex flex-col border-r pr-4 pl-2">
              <span className="text-sm font-base text-[#77787B]">
                Magistrate
              </span>
              <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                {magistrateName}
              </span>
            </div>
            <div className="flex flex-col pl-2">
              <span className="text-sm font-base text-[#77787B]">
                Court Name
              </span>
              <span className="text-[16px] font-bold text-[#0B0C0C]">
                {caseResult.courtName}
              </span>
            </div>
          </div>

          <div className="bg-[#F7F5F3] p-6 rounded-md text-sm">
            <h2 className="text-[#334155] text-xl font-semibold border-b pb-2 mb-3">
              Litigant Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="pr-2 border-r">
                <p className="text-[16px] font-bold text-[#0A0A0A]">
                  Complainant/s
                </p>
                {renderList(complainants, showAll.complainants, "complainants")}
              </div>
              <div className="pr-2 border-r">
                <p className="text-[16px] font-bold text-[#0A0A0A]">
                  Complainant advocate/s
                </p>
                {renderList(
                  complainantAdvocates,
                  showAll.complainantAdvocates,
                  "complainantAdvocates"
                )}
              </div>
              <div className="pr-2 border-r">
                <p className="text-[16px] font-bold text-[#0A0A0A]">Accused</p>
                {renderList(accuseds, showAll.accuseds, "accuseds")}
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#0A0A0A]">
                  Accused Advocate/s
                </p>
                {renderList(
                  accusedAdvocates,
                  showAll.accusedAdvocates,
                  "accusedAdvocates"
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#F7F5F3] p-6 rounded-md text-sm">
            <h2 className="text-[#334155] text-xl font-semibold border-b pb-2 mb-3">
              Key Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 pr-4 border-r">
                <div className="flex justify-between gap-4">
                  <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                    Next Hearing Date
                  </span>
                  <span className="flex-1 text-[16px]">
                    {formatDate(caseResult.nextHearingDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                    Purpose
                  </span>
                  <span className="flex-1 text-[16px]">
                    {caseResult.purpose}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                    Last Hearing on
                  </span>
                  <span className="flex-1 text-[16px]">
                    {formatDate(caseResult.lastHearingDate)}
                  </span>
                </div>
              </div>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between gap-4">
                  <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                    Case Stage
                  </span>
                  <span className="flex-1 text-[16px]">
                    {caseResult.caseStage}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                    Process payment pending
                  </span>
                  <button
                    onClick={() => {
                      const taskSection = document.getElementById(
                        "pendingTasksSection"
                      );
                      taskSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 text-[16px] text-left text-[#DC2626] underline hover:text-red-700"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-6 bg-white">
            {/* Order History Section */}
            <h2 className="text-xl font-bold mb-3">Order History</h2>
            {loading ? (
              <div className="text-center py-4">Loading order history...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
              <>
                {orderHistory.length > 0 ? (
                  <>
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-sm font-bold text-[#0B0C0C] border-b border-[#BBBBBD]">
                          <th className="px-2 py-1">S.no</th>
                          <th className="px-2 py-1">Date</th>
                          <th className="px-2 py-1">Business Of The Day</th>
                          <th className="px-2 py-1 text-center">View Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Show orders - either initial 2 or full paginated view */}
                        {orderHistory.map((item, idx) => (
                          <tr
                            key={idx}
                            className="text-sm font-normal text-[#0A0A0A] border-b border-[#E8E8E8]"
                          >
                            <td className="px-2 py-2">
                              {showAllOrders
                                ? currentOrderPage * ordersPerPage + idx + 1
                                : idx + 1}
                            </td>
                            <td className="px-2 py-2">
                              {formatDate(item.date)}
                            </td>
                            <td className="px-2 py-2">
                              {item.businessOfTheDay}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <button
                                className="px-2 py-1 border text-sm text-[#334155] font-medium rounded-md bg-[#F8FAFC] border-[#CBD5E1] hover:bg-gray-100"
                                onClick={() => openFileInNewTab(item.orderId)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination controls - only show if in expanded view */}
                    {showAllOrders && totalOrders > ordersPerPage && (
                      <div className="flex items-center justify-center mt-4 space-x-2">
                        <button
                          onClick={() => {
                            const newPage = Math.max(0, currentOrderPage - 1);
                            setCurrentOrderPage(newPage);
                            fetchOrderHistory(newPage);
                          }}
                          disabled={currentOrderPage === 0}
                          className={`px-2 py-1 border rounded ${currentOrderPage === 0 ? "text-gray-400" : "text-blue-600"}`}
                        >
                          Previous
                        </button>
                        <span className="text-sm">
                          Page {currentOrderPage + 1} of{" "}
                          {Math.ceil(totalOrders / ordersPerPage)}
                        </span>
                        <button
                          onClick={() => {
                            const newPage = Math.min(
                              Math.ceil(totalOrders / ordersPerPage) - 1,
                              currentOrderPage + 1
                            );
                            setCurrentOrderPage(newPage);
                            fetchOrderHistory(newPage);
                          }}
                          disabled={
                            currentOrderPage >=
                            Math.ceil(totalOrders / ordersPerPage) - 1
                          }
                          className={`px-2 py-1 border rounded ${currentOrderPage >= Math.ceil(totalOrders / ordersPerPage) - 1 ? "text-gray-400" : "text-blue-600"}`}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    No order history available
                  </div>
                )}
              </>
            )}

            {/* Only show 'See more Orders' button if there are more than initial orders to show */}
            {!showAllOrders && orderHistory.length > 0 && (
              <div className="mt-2 mb-8">
                <button
                  onClick={() => {
                    setShowAllOrders(true);
                    setCurrentOrderPage(0);
                    fetchOrderHistory(0);
                  }}
                  className="text-[#1D4ED8] text-sm underline"
                >
                  See more Orders
                </button>
              </div>
            )}

            {/* Show 'Show less' button when in expanded view */}
            {showAllOrders && orderHistory.length > 0 && (
              <div className="mt-2 mb-6">
                <button
                  onClick={() => {
                    setShowAllOrders(false);
                    setCurrentOrderPage(0);
                  }}
                  className="text-[#1D4ED8] text-sm underline"
                >
                  Show less
                </button>
              </div>
            )}

            {/* Process Payment Pending Tasks Section */}
            <div id="pendingTasksSection">
              <h2 className="text-xl font-bold mb-3">
                Process Payment Pending Tasks
              </h2>
              {loading ? (
                <div className="text-center py-4">Loading payment tasks...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <>
                  {paymentTasks.length > 0 ? (
                    <>
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-gray-600 border-b border-[#BBBBBD]">
                            <th className="px-2 py-1">S.no</th>
                            <th className="px-2 py-1">Task</th>
                            <th className="px-2 py-1">Due Date</th>
                            <th className="px-2 py-1">Days Remaining</th>
                            <th className="px-2 py-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentTasks.map((task, idx) => (
                            <tr key={idx} className="border-b border-[#E8E8E8]">
                              <td className="px-2 py-2">
                                {showAllTasks
                                  ? currentTaskPage * tasksPerPage + idx + 1
                                  : idx + 1}
                              </td>
                              <td className="px-2 py-2 font-medium">
                                {task.task}
                              </td>
                              <td className="px-2 py-2">
                                {formatDate(task.dueDate)}
                              </td>
                              <td className="px-2 py-2 text-red-600 font-medium">
                                {`${task.daysRemaining} Days`}
                              </td>
                              <td className="px-2 py-2 text-right">
                                <div className="relative">
                                  <button
                                    className="w-6 h-6 flex items-center justify-center"
                                    onMouseEnter={() =>
                                      setHoveredIconId(task.id)
                                    }
                                    onMouseLeave={() => setHoveredIconId(null)}
                                  >
                                    <FiInfo
                                      className="text-[#334155]"
                                      size={14}
                                    />
                                  </button>
                                  {hoveredIconId === task.id && (
                                    <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#3A3A3A] text-white text-center text-sm rounded-md w-48 z-10">
                                      Login to the portal to make the online
                                      payment
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Removed static login message, now shown on icon hover */}

                      {/* Pagination controls - only show if in expanded view */}
                      {showAllTasks && totalTasks > tasksPerPage && (
                        <div className="flex items-center justify-center mt-4 space-x-2">
                          <button
                            onClick={() => {
                              const newPage = Math.max(0, currentTaskPage - 1);
                              setCurrentTaskPage(newPage);
                              fetchPaymentTasks(newPage);
                            }}
                            disabled={currentTaskPage === 0}
                            className={`px-2 py-1 border rounded ${currentTaskPage === 0 ? "text-gray-400" : "text-blue-600"}`}
                          >
                            Previous
                          </button>
                          <span className="text-sm">
                            Page {currentTaskPage + 1} of{" "}
                            {Math.ceil(totalTasks / tasksPerPage)}
                          </span>
                          <button
                            onClick={() => {
                              const newPage = Math.min(
                                Math.ceil(totalTasks / tasksPerPage) - 1,
                                currentTaskPage + 1
                              );
                              setCurrentTaskPage(newPage);
                              fetchPaymentTasks(newPage);
                            }}
                            disabled={
                              currentTaskPage >=
                              Math.ceil(totalTasks / tasksPerPage) - 1
                            }
                            className={`px-2 py-1 border rounded ${currentTaskPage >= Math.ceil(totalTasks / tasksPerPage) - 1 ? "text-gray-400" : "text-blue-600"}`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      No payment tasks pending
                    </div>
                  )}

                  {/* Only show 'See more Tasks' button if there are more than 2 tasks */}
                  {!showAllTasks && totalTasks > 2 && (
                    <div className="mt-2 mb-6">
                      <button
                        onClick={() => {
                          setShowAllTasks(true);
                          setCurrentTaskPage(0);
                          fetchPaymentTasks(0);
                        }}
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                      >
                        See more Tasks
                      </button>
                    </div>
                  )}

                  {/* Show 'Show less' button when in expanded view */}
                  {showAllTasks && (
                    <div className="mt-2 mb-6">
                      <button
                        onClick={() => {
                          setShowAllTasks(false);
                          setCurrentTaskPage(0);
                        }}
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                      >
                        Show less
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedViewModal;
