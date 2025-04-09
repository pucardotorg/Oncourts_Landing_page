import { useState } from "react";

type Feature = {
  [key: string]: string | number;
};

type FeaturesTableProps = {
  data: Feature[];
  heading: string;
};

const rowsOptions = [4, 8, 12];

const FeaturesTable: React.FC<FeaturesTableProps> = ({ data, heading }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(4);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIdx, startIdx + rowsPerPage);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="w-full">
      <h2 className="text-[#007E7E] text-lg sm:text-xl font-semibold mt-8 sm:mt-12 mb-4 text-left underline">
        {heading}
      </h2>
      <div className="bg-white rounded-md shadow overflow-x-auto overflow-hidden border-[1.6px] border-[#D4D4D4]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F7F7F8]">
            <tr className="text-sm font-medium text-gray-700">
              {columns.map((col) => (
                <th key={col} className="px-4 py-4 capitalize">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((feature, rowIdx) => (
              <tr key={feature.id ?? rowIdx} className="border-b text-sm">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-4">
                    {feature[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-6 py-3 bg-[#F7F7F8]">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-sm bg-[#F7F7F8]"
            >
              {rowsOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "bg-[#F7F7F8] text-black"
                  : "bg-[#007E7E] text-white"
              }`}
            >
              ← Prev
            </button>

            {currentPage > 1 && (
              <div
                className="bg-[#F7F7F8] text-black h-[30px] w-[30px] flex items-center justify-center rounded cursor-pointer"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {currentPage - 1}
              </div>
            )}

            <div className="bg-[#007E7E] text-white h-[30px] w-[30px] flex items-center justify-center rounded">
              {currentPage}
            </div>

            {currentPage < totalPages && (
              <div
                className="bg-[#F7F7F8] text-black h-[30px] w-[30px] flex items-center justify-center rounded cursor-pointer"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {currentPage + 1}
              </div>
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "bg-[#F7F7F8] text-black"
                  : "bg-[#007E7E] text-white"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesTable;
