import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { announcementData } from "../../data/announcements";

const AnnouncementsComponent = () => {
  const [timePeriod, setTimePeriod] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [downloadingId, setDownloadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = rowsPerPage;

  const indexOfLastAnnouncement = currentPage * itemsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - itemsPerPage;
  const currentAnnouncements = announcementData.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(announcementData.length / itemsPerPage);

  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);
      const response = await fetch(`/announcement/announcement-${id}.pdf`);
      if (!response.ok) throw new Error("File not found");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `announcement-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert(`Failed to download file ${error}`);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!announcementData?.length) {
    return <div className="text-center py-4">No announcements found</div>;
  }

  const handleHamburgerClick = () => {
    alert("Hamburger menu clicked!");
  };

  const handleClear = () => {
    setTimePeriod(null);
    setSelectedType("");
  };

  const handleApply = () => {
    alert("Filters Applied");
  };

  // const handlePageChange = (direction) => {
  //   if (direction === "prev" && currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   } else if (direction === "next") {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-3xl">Announcements</h2>
      </div>
      <div className="mb-6">
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 pl-10 pr-4 border-b-2 border-darkGray outline-none bg-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image
              src="/images/search.svg"
              alt="Search Icon"
              width={16}
              height={16}
            />
          </div>
          <button
            onClick={handleHamburgerClick}
            className="text-teal text-xl ml-4 border-2 border-darkGrey px-2 py-2"
          >
            &#9776;
          </button>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="w-2/5 pr-4 relative">
            <label className="text-gray-700 font-medium text-sm">
              Time Period
            </label>
            <div className="mt-2 relative">
              <div className="absolute left-3 top-2/3 transform -translate-y-1/2">
                <Image
                  src="/images/search.svg"
                  alt="Search Icon"
                  width={16}
                  height={16}
                />
              </div>
              <DatePicker
                selected={timePeriod}
                onChange={(date: Date | null) => setTimePeriod(date)}
                className="w-full py-2 pl-10 pr-4 border-b-2 border-gray-500 outline-none bg-transparent"
                placeholderText="All Time"
              />
            </div>
          </div>

          <div className="w-2/5 pl-4">
            <label className="text-gray-700 font-medium text-sm">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-4 border-b-2 border-gray-500 outline-none bg-transparent"
            >
              <option value="Judge">Judge</option>
              <option value="Type1">Type 1</option>
              <option value="Type2">Type 2</option>
              <option value="Type3">Type 3</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 w-1/5 pl-4">
            <button
              onClick={handleClear}
              className="py-2 px-6 rounded-[10px] border border-gray-500 text-gray-700 bg-white"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="py-2 px-6 rounded-[10px] bg-gray-100 text-teal bg-gray-100 border-b-1 border-darkGray"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100">
                SI. No.
              </th>
              <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100 w-1/2">
                Titles
              </th>
              <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100">
                Date
              </th>
              <th className="px-4 py-2 border-b-2 border-darkGrey text-left bg-gray-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAnnouncements.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-2 border-b border-darkGrey">
                  {row.id}.
                </td>
                <td className="px-4 py-2 border-b border-darkGrey w-1/2">
                  {row.description}
                </td>
                <td className="px-4 py-2 border-b border-darkGrey">
                  {row.date ? row.date : ""}
                </td>
                <td className="px-4 py-2 border-b border-darkGrey">
                  <button
                    onClick={() => handleDownload(row.id)}
                    className="flex items-center text-teal"
                    disabled={downloadingId === row.id}
                  >
                    <span className="mr-2">
                      {downloadingId === row.id ? "Downloading..." : "Download"}
                    </span>
                    <Image
                      src="/images/search.svg"
                      alt="Download Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center bg-gray-100">
        <div className="flex items-center">
          <label htmlFor="rowsPerPage" className="text-teal mr-2 p-2">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="py-2 px-4 bg-transparent outline-none"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="py-1 px-3 border border-darkgrey rounded-md text-darkgrey"
            disabled={currentPage === 1}
          >
            &#8592; Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`py-1 px-3 ${currentPage === index + 1 ? "bg-teal text-white" : "border border-darkgrey text-darkgrey"} rounded-md`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="py-1 px-3 border border-darkgrey rounded-md text-darkgrey"
            disabled={currentPage === totalPages}
          >
            Next &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsComponent;
