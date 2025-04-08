import React, { useState } from "react";
import ListItem from "./ListItem";
import { announcementData } from "../../data/announcements";
import router from "next/router";
import Image from "next/image";

const NoticeAndCauseListSection: React.FC = () => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

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

  const getDates = () => {
    const now = new Date();
    const hours = now.getHours();

    // Format date to YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    let firstDate, secondDate;

    if (hours < 17) {
      firstDate = formatDate(now);
      secondDate = formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
    } else {
      firstDate = formatDate(new Date(now.getTime() + 24 * 60 * 60 * 1000));
      secondDate = formatDate(now);
    }

    return [
      { title: "Daily Roster", date: firstDate },
      { title: "Daily Roster", date: secondDate },
    ];
  };
  const items = getDates();

  return (
    <div className="flex space-x-8 mx-2 p-8">
      <div className="w-1/2 space-y-4">
        <h2 className="text-teal font-bold text-xl mb-4">Cause Lists</h2>
        {/* <p className="text-center">No Causelists</p> */}
        {items.map((item, index) => (
          <ListItem key={index} title={item.title} date={item.date} />
        ))}
        {/* {[...Array(5)].map((_, index) => {
              const date = getDateOffset(index);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 mb-2 bg-white rounded-[5px] border border-teal shadow-md mx-16"
                >
                  <div className="flex flex-col items-start space-y-1">
                    <span className="font-medium text-teal">Daily Roster</span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Image
                        src="/images/search.svg"
                        alt="Search Icon"
                        width={24}
                        height={24}
                      />
                      {date}
                    </span>
                  </div>
                  <button
                    className="py-1 px-3 bg-darkGrey text-white"
                    onClick={() => fetchRosterData(date)}
                  >
                    Download
                  </button>
                </div>
              );
            })} */}
      </div>
      <div className="w-1/2 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-teal font-bold text-xl">
            Notice Board / Announcements
          </h2>
          {currentAnnouncements.length === 0 ? (
            <p></p>
          ) : (
            <button
              className="py-1 px-4 bg-white border border-teal rounded-[5px]"
              onClick={() => router.push("/announcements")}
            >
              View All
            </button>
          )}
        </div>
        <div>
          {currentAnnouncements.length === 0 ? (
            <p></p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {currentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 mb-4 bg-white rounded-[5px] border border-teal shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-2">
                      <span className="bg-teal text-white px-2 py-1 rounded-md text-sm">
                        {announcement.type}
                      </span>
                    </div>
                    <button className="py-1 px-3 border border-darkgrey rounded-md">
                      <a
                        href={`/ announcement / announcement - ${announcement.id}.pdf`}
                        download
                        target="_blank"
                        className="flex items-center text-teal"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm flex items-center space-x-2">
                    <Image
                      src="/images/search.svg"
                      alt="Search Icon"
                      width={24}
                      height={24}
                    />
                    {announcement.date ? (
                      <span>Date: {announcement.date}</span>
                    ) : null}
                  </p>
                  <h3 className="font-bold text-black mt-2">
                    {announcement.heading}
                  </h3>
                  <p className="text-teal text-sm mt-1">
                    {announcement.description}
                  </p>
                </div>
              ))}
            </div>
          )}
          {currentAnnouncements.length === 0 ? (
            <p className="text-center">No announcements</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeAndCauseListSection;
