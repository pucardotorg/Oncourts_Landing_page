import React from "react";
import { useRouter } from "next/router";

const MultipleCase = (data) => {
    const cases = data["data"]
    const router = useRouter();

    const handleViewClick = (caseItem) => {
        const caseNo=caseItem.caseNumber
        router.push({
            pathname: "/view_case",
            query: { caseData: caseNo },
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Case Table</h1>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left border-b">Serial Number</th>
                        <th className="px-4 py-2 text-left border-b">Case Number</th>
                        <th className="px-4 py-2 text-left border-b">Case Title</th>
                        <th className="px-4 py-2 text-left border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cases &&
                        cases.map((caseItem, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{caseItem.caseNumber}</td>
                                <td className="px-4 py-2">{caseItem.caseTitle}</td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleViewClick(caseItem)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default MultipleCase;