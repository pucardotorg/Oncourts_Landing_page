// components/DetailedViewModal.tsx
import React, { useState } from "react";
import { dummyData } from "./DetailedViewData";
// import { Button } from "@/components/ui/button";

interface DetailedViewModalProps {
  onClose: () => void;
}

const DetailedViewModal: React.FC<DetailedViewModalProps> = ({ onClose }) => {
  const data = dummyData;

  const [showAll, setShowAll] = useState({
    complainants: false,
    complainantAdvocates: false,
    accused: false,
  });

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
      <div className="bg-white rounded-lg w-full max-w-7xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-xl font-bold text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="text-lg font-semibold mb-2 text-gray-700">
          Detailed View | <span className="text-teal">{data.caseTitle}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-y-2 bg-sandBg p-4 rounded-md text-sm">
          <div className="flex flex-col border-r pr-4">
            <span className="text-gray-500">Case Number</span>
            <span className="font-semibold text-black">{data.caseNumber}</span>
          </div>
          <div className="flex flex-col border-r pr-4 pl-2">
            <span className="text-gray-500">CNR Number</span>
            <span className="font-semibold text-black">{data.cnrNumber}</span>
          </div>
          <div className="flex flex-col border-r pr-4 pl-2">
            <span className="text-gray-500">Filing Number</span>
            <span className="font-semibold text-black">{data.filingNumber}</span>
          </div>
          <div className="flex flex-col border-r pr-4 pl-2">
            <span className="text-gray-500">Filing Date</span>
            <span className="font-semibold text-black">{data.filingDate}</span>
          </div>
          <div className="flex flex-col border-r pr-4 pl-2">
            <span className="text-gray-500">Registration Date</span>
            <span className="font-semibold text-black">{data.registrationDate}</span>
          </div>
          <div className="flex flex-col border-r pr-4 pl-2">
            <span className="text-gray-500">Magistrate</span>
            <span className="font-semibold text-black">{data.magistrate}</span>
          </div>
          <div className="flex flex-col pl-2">
            <span className="text-gray-500">Court Name</span>
            <span className="font-semibold text-black">{data.courtName}</span>
          </div>
        </div>

        <div className="mt-4 bg-sandBg p-4 rounded-md text-sm">
          <h2 className="text-gray-700 text-base font-semibold border-b pb-2 mb-3">
            Litigant Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="pr-2 border-r">
              <p className="font-semibold">Complainant/s</p>
              {renderList(data.complainants, showAll.complainants, "complainants")}
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

        <div className="mt-4 bg-sandBg p-4 rounded-md text-sm">
          <h2 className="text-gray-700 text-base font-semibold border-b pb-2 mb-3">
            Key Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 pr-4 border-r">
              <div className="flex justify-between">
                <span className="font-semibold text-black">Next Hearing Date</span>
                <span>{data.nextHearingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black">Purpose</span>
                <span>{data.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black">Last Hearing on</span>
                <span>{data.lastHearingDate}</span>
              </div>
            </div>
            <div className="space-y-2 pl-4">
              <div className="flex justify-between">
                <span className="font-semibold text-black">Case Stage</span>
                <span>{data.caseStage}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black">Appearance</span>
                <span className="text-red-600">{data.appearance}</span>
              </div>
            </div>
          </div>
        </div>


        <div className="mt-6 border rounded-md p-4 bg-white">
          {/* Order History Section */}
          <h2 className="text-lg font-semibold mb-3">Order History</h2>
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
              {data.orderHistory.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-2 py-2">{idx + 1}</td>
                  <td className="px-2 py-2">{item.date}</td>
                  <td className="px-2 py-2">{item.business}</td>
                  <td className="px-2 py-2 text-center">
                    <button className="px-3 border text-sm rounded-md bg-white border-gray-300 hover:bg-gray-100">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2 mb-6">
            <button className="text-blue-600 text-sm underline">See more Orders</button>
          </div>

          {/* Process Payment Pending Tasks Section */}
          <h2 className="text-lg font-semibold mb-3">Process Payment Pending Tasks</h2>
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
                  <td className="px-2 py-2 text-red-600">{task.daysRemaining}</td>
                  <td className="px-2 py-2">i</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DetailedViewModal;
