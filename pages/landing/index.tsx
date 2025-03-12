import React, { useState } from "react";
import Image from "next/image";
import { announcementData } from "../../data/announcements";
import router from "next/router";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
const Hero = () => {
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
      secondDate = formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)); // Yesterday
    } else {
      firstDate = formatDate(new Date(now.getTime() + 24 * 60 * 60 * 1000)); // Tomorrow
      secondDate = formatDate(now);
    }

    return [
      { title: "Daily Roaster", date: firstDate },
      { title: "Daily Roaster", date: secondDate },
    ];
  };
  const items = getDates();

  return (
    <div>
      <div className="relative w-full">
        <div className="w-full h-96 relative">
          <Image
            src="/images/base.jpeg"
            alt="Base Image"
            objectFit="contain"
            layout="fill"
          // className="w-full relative"
          />
          {/* <div className="absolute mt-12 top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h2 className="text-2xl font-bold text-black bg-white p-2">
              24X7 Open & Networked Courts
            </h2>
            <p className="mt-2 text-black font-semibold bg-white p-2">
              The Kerala High Court is launching a new court, called 24x7 ON
              Courts, with a <br />
              transformed dispute resolution experience for all users. The 24x7
              ON Courts advance
              <br /> the vision outlined in Phase III of the Supreme Court
              eCourts policy.
            </p>
          </div> */}
        </div>
        <div className="flex space-x-4 p-8 gap-5">
          <a
            href="https://oncourts.kerala.gov.in/digit-ui/citizen/dristi/home/login"
            className="flex-1 flex items-center space-x-4 pl-3 rounded-[10px] border border-teal bg-teal text-white"
            target="/"
          >
            <Image
              src="/images/order.svg"
              alt="Logo"
              width={40}
              height={40}
            />
            <div className="flex-1">
              <span className="block font-semibold text-base" style={{ fontSize: '18px' }}>
                Login as Litigant/Advocate
              </span>
              <span className="block text-sm">
                To perform actions and see details of a case you&apos;re involved in
              </span>
            </div>
            <div className="relative w-[320px] h-[200px]">
              <Image
                src="/images/image.png"
                alt="Logo"
                layout="fill"
                objectFit="cover"
                className="rounded-r-[10px]"
              />
            </div>
          </a>

          <a
            href="https://oncourts.kerala.gov.in/digit-ui/employee/user/login"
            className="flex-1 flex items-center space-x-4 pl-3 rounded-[10px] border border-teal bg-white text-teal"
            target="/"
          >
            <Image
              src="/images/order_teal.svg"
              alt="Logo"
              width={40}
              height={40}
            />
            <div className="flex-1">
              <span className="block font-semibold text-base" style={{ fontSize: '18px' }}>
                Login as Officers/Court Staff
              </span>
              <span className="block text-sm">
                To perform actions as a member of the court
              </span>
            </div>
            <div className="relative w-[320px] h-[200px]">
              <Image
                src="/images/img1.jpeg"
                alt="Logo"
                layout="fill"
                objectFit="cover"
                className="rounded-r-[10px]"
              />
            </div>
          </a>
        </div>





        <div className="flex space-x-8 mx-2 p-8">
          <div className="w-1/2 space-y-4">
            <h2 className="text-teal font-bold text-xl mb-4">Cause Lists</h2>
            <p className="text-center">No Causelists</p>
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
        <div className="bg-[rgba(0,126,126,0.1)]">
          <div className="flex flex-col items-center mt-16 mb-4">
            <h2 className="text-teal font-bold text-xl mb-4 pt-8">Support</h2>
            <p className="text-center text-darkGrey mb-8">
              ON Courts are designed to realize the vision of taking courts to
              people and offer multiple benefits.
            </p>
            <div className="flex gap-6">
              <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
                <h3 className="font-bold text-black mb-4">Resources</h3>
                <div className="flex items-center justify-between mb-4">
                  <a
                    href="https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex space-x-2"
                  >
                    <Image
                      src="/images/boarding.svg"
                      alt="Boarding Icon"
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-600">Advocate User Guide</span>
                  </a>

                </div>
                <hr className="my-4" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <Image
                      src="/images/boarding.svg"
                      alt="Search Icon"
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-600">Standard Operating Procedures (SOPs) - Coming soon</span>
                  </div>
                </div>
                <hr className="my-4" />
                <Link href="https://www.youtube.com/playlist?list=PL2HnAXES1w-ShQIq8DAhvqeYe-uLCAr6F" className="block">
                  <div className="flex items-center justify-between mb-4 cursor-pointer">
                    <div className="flex space-x-2">
                      <Image
                        src="/images/youtube.svg"
                        alt="Youtube Icon"
                        width={24}
                        height={24}
                      />
                      <span className="text-teal">24x7 ON Court Training Videos || Advocates</span>
                    </div>
                    <Image
                      src="/images/arrow.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                  </div>
                </Link>
                <hr className="my-4" />
                <Link href="https://www.youtube.com/watch?v=EDDAkm4FvBc" className="block">
                  <div className="flex items-center justify-between mb-4 cursor-pointer">
                    <div className="flex space-x-2">
                      <Image
                        src="/images/youtube.svg"
                        alt="Youtube Icon"
                        width={24}
                        height={24}
                      />
                      <span className="text-teal">24X7 ON Court Launch Video</span>
                    </div>
                    <Image
                      src="/images/arrow.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                  </div>
                </Link>
              </div>
              <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
                <h3 className="font-bold text-black mb-4">
                  Support
                </h3>
                <p className="text-gray-600 mb-4">

                </p>
                <div className="flex justify-center items-center">
                  <a
                    href="https://forms.gle/uCSgGiqGiMQYjjgeA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="py-2 px-4 border-2 border-darkGrey rounded-[5px] text-teal">
                      Click here to Submit the Grievance
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between space-x-6 px-6 mx-auto max-w-screen-xl p-8">
            <div className="w-1/2 px-28">
              <h2 className="font-bold text-darkGrey">Contact Us</h2>
              <p className="text-gray-600 mt-2">
                If you have any questions or need assistance, please feel free
                to contact us through the channels provided below.
              </p>
            </div>
            <div className="w-1/2 px-40">
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/phone.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal font-bold">
                    Helpline: <a href="callto:oncourt@gmail.com">0474 2919099</a>
                  </span>
                </div>
                <hr className="my-2 border-teal" />
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/email.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal font-bold"><a href="mailto:oncourtkollam@keralacourts.in">oncourtkollam@keralacourts.in</a></span>
                </div>
                <hr className="my-2 border-teal" />
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/time.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal font-bold">
                    Available from 10:00 - 17:00 IST <br />
                    Monday - Saturday (except 2nd)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListItem = ({ title, date }: { title: string; date: string }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch("/api/_download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId: "kl",
          Criteria: {
            courtId: "KLKM52",
            searchDate: date,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `causelist-${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      alert("Failed to download.");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border rounded-lg shadow-md bg-white">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          Date : {date}
        </p>
      </div>
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
  );
};

export default Hero;
