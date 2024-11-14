import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    announcementData
} from '../../data/announcements';
import router from "next/router";
import Link from "next/link";
const Hero = () => {

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastAnnouncement = currentPage * itemsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - itemsPerPage;
    const currentAnnouncements = announcementData.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
        const date = new Date().toLocaleDateString('en-GB', options);
        setCurrentDate(date);
    }, []);

    const getDateOffset = (daysOffset) => {
        const date = new Date();
        date.setDate(date.getDate() - daysOffset);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(announcementData.length / itemsPerPage);

    const fetchRosterData = async (date) => {
        const months = {
            "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
            "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
        };
    
        const [day, month, year] = date.split(" ");
        const newDate = `${year}-${months[month]}-${day.padStart(2, '0')}`;
        console.log(newDate)
        try {
            const response = await fetch('https://dristi-kerala-uat.pucar.org/scheduler/causelist/v1/_download?_=1730882648559', {
                method: 'POST',
                headers: {
                    'authority': 'dristi-kerala-uat.pucar.org',
                    'accept': 'application/pdf',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'content-type': 'application/json',
                    'origin': 'https://dristi-kerala-uat.pucar.org',
                    'referer': 'https://dristi-kerala-uat.pucar.org/digit-ui/employee/hearings/',
                    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Linux"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                },
                body: JSON.stringify({
                    tenantId: 'kl',
                    Criteria: {
                        courtId: 'KLKM52',
                        searchDate: newDate,
                        judgeIds: [],
                        caseIds: [],
                    },
                    RequestInfo: {
                        apiId: 'Rainmaker',
                        authToken: '6929440b-59c8-41fc-be33-3fd7a6dc90df',
                        userInfo: {
                            id: 143,
                            uuid: 'c1c4a708-afd6-4c9c-91a5-fd6c8517fb39',
                            userName: 'uatJudge01',
                            name: 'uatJudge01',
                            mobileNumber: '1002335566',
                            type: 'EMPLOYEE',
                            roles: [
                                { "name": "HEARING_VIEWER", "code": "HEARING_VIEWER", "tenantId": "kl" },
                                { "name": "DEPOSITION_EDITOR", "code": "DEPOSITION_EDITOR", "tenantId": "kl" },
                                { "name": "WORKFLOW_ABANDON", "code": "WORKFLOW_ABANDON", "tenantId": "kl" },
                                { "name": "ORDER_ESIGN", "code": "ORDER_ESIGN", "tenantId": "kl" },
                                { "name": "Workflow Admin", "code": "WORKFLOW_ADMIN", "tenantId": "kl" },
                                { "name": "DEPOSITION_PUBLISHER", "code": "DEPOSITION_PUBLISHER", "tenantId": "kl" },
                                { "name": "TASK_APPROVER", "code": "TASK_APPROVER", "tenantId": "kl" },
                                { "name": "HEARING_START", "code": "HEARING_START", "tenantId": "kl" },
                                { "name": "HEARING_APPROVER", "code": "HEARING_APPROVER", "tenantId": "kl" },
                                { "name": "ORDER_VIEWER", "code": "ORDER_VIEWER", "tenantId": "kl" },
                                { "name": "SUBMISSION_RESPONDER", "code": "SUBMISSION_RESPONDER", "tenantId": "kl" },
                                { "name": "ORDER_REASSIGN", "code": "ORDER_REASSIGN", "tenantId": "kl" },
                                { "name": "CASE_EDITOR", "code": "CASE_EDITOR", "tenantId": "kl" },
                                { "name": "APPLICATION_APPROVER", "code": "APPLICATION_APPROVER", "tenantId": "kl" },
                                { "name": "TASK_CREATOR", "code": "TASK_CREATOR", "tenantId": "kl" },
                                { "name": "HEARING_DATE_REQUESTOR", "code": "HEARING_DATE_REQUESTOR", "tenantId": "kl" },
                                { "name": "Employee", "code": "EMPLOYEE", "tenantId": "kl" },
                                { "name": "ORDER_DELETE", "code": "ORDER_DELETE", "tenantId": "kl" },
                                { "name": "CASE_VIEWER", "code": "CASE_VIEWER", "tenantId": "kl" },
                                { "name": "APPLICATION_REJECTOR", "code": "APPLICATION_REJECTOR", "tenantId": "kl" },
                                { "name": "TASK_EDITOR", "code": "TASK_EDITOR", "tenantId": "kl" },
                                { "name": "ORDER_APPROVER", "code": "ORDER_APPROVER", "tenantId": "kl" },
                                { "name": "HEARING_CLOSER", "code": "HEARING_CLOSER", "tenantId": "kl" },
                                { "name": "ORDER_CREATOR", "code": "ORDER_CREATOR", "tenantId": "kl" },
                                { "name": "JUDGE_ROLE", "code": "JUDGE_ROLE", "tenantId": "kl" },
                                { "name": "CASE_APPROVER", "code": "CASE_APPROVER", "tenantId": "kl" },
                                { "name": "DEPOSITION_CREATOR", "code": "DEPOSITION_CREATOR", "tenantId": "kl" },
                                { "name": "SUBMISSION_APPROVER", "code": "SUBMISSION_APPROVER", "tenantId": "kl" },
                                { "name": "TASK_UPDATOR", "code": "TASK_UPDATOR", "tenantId": "kl" },
                                { "name": "TASK_VIEWER", "code": "TASK_VIEWER", "tenantId": "kl" },
                                { "name": "HEARING_SCHEDULER", "code": "HEARING_SCHEDULER", "tenantId": "kl" }
                            ],
                            active: true,
                            tenantId: 'kl',
                            permanentCity: null
                        },
                        msgId: '1730882648558|en_IN',
                        plainAccessRequest: {},
                    },
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = 'downloaded-file.pdf';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                console.log("Failed to fetch roster data.");
            }
        } catch (err) {
            console.error("Error fetching roster data:", err);
        }
    };

    return (
        <div>
            <div className="relative w-full">
                <div className="w-full h-64 relative">
                    <Image
                        src="/images/base.jpg"
                        alt="Base Image"
                        layout="fill"
                        objectFit="cover"
                        height={600}
                    />
                    <div className="absolute mt-12 top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                        <div className="mb-4">
                            <Image
                                src="/images/small_img.png"
                                alt="Small Image"
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                        </div>
                        <h2 className="text-2xl font-bold">24X7 Open & Networked Courts</h2>
                        <p className="mt-2 text-base">
                            The Kerala High Court is launching a new court, called 24x7 ON Courts,
                            with a transformed dispute resolution experience for all users. The 24x7 ON Courts
                            advance the vision outlined in Phase III of the Supreme Court eCourts policy.
                        </p>
                    </div>
                </div>
                <div className="flex space-x-4 p-8">
                    <div className="flex-1 flex space-x-4 p-4 rounded-[15px] border border-teal">
                        <a
                            href="/litigant-advocate"
                            className="flex-1 flex flex-col items-start space-y-2 p-4 rounded-[15px] border border-teal"
                        >
                            <span className="font-semibold text-lg">Login as Litigant/Advocate</span>
                            <span className="text-gray-600">
                                To perform actions and see details of a case you&apos;re involved in
                            </span>
                        </a>

                        <a
                            href="/case-number"
                            className="flex-1 flex flex-col items-start space-y-2 p-4 rounded-[15px] border border-teal"
                        >
                            <span className="font-semibold text-lg">Login as Officers/Court Staff</span>
                            <span className="text-gray-600">
                                To perform actions as a member of the court
                            </span>
                        </a>
                    </div>

                    <div className="flex justify-center items-center h-full p-4">
                        <div className="flex-1 p-4 rounded-[15px] border border-teal">
                            <Link href="/search">
                                <a className="flex flex-col items-center space-y-2 p-4 text-center">
                                    <span className="font-semibold text-lg">Search for a Case</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-8 mx-2 p-8">
                    <div className="w-1/2">
                        <h2 className="text-teal font-bold text-xl mb-4">Cause List</h2>
                        {[...Array(5)].map((_, index) => {
                            const date = getDateOffset(index);
                            return (
                                <div key={index} className="flex items-center justify-between p-4 mb-4 bg-white rounded-[5px] border border-teal shadow-md">
                                    <div className="flex flex-col items-start space-y-1">
                                        <span className="font-medium text-teal">Daily Roster</span>
                                        <span className="text-sm text-gray-600 flex items-center">
                                            <Image
                                                src="/images/search.svg"
                                                alt="Icon"
                                                width={24}
                                                height={24}
                                            />
                                            {date}
                                        </span>
                                    </div>
                                    <button className="py-1 px-3 bg-darkGrey text-white" id='btn' onClick={() => fetchRosterData(date)}>
                                        Download
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-1/2 mb-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-teal font-bold text-xl">Notice Board / Announcements</h2>
                            <button className="py-1 px-4 bg-white border border-teal rounded-[5px]" onClick={() => window.location.href = "/announcements"}>
                                View All
                            </button>
                        </div>
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                {currentAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="p-4 mb-4 bg-white rounded-[5px] border border-teal shadow-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex space-x-2">
                                                <span className="bg-teal text-white px-2 py-1 rounded-md text-sm">Tags</span>
                                            </div>
                                            <button className="py-1 px-3 border border-darkgrey rounded-md">
                                                Download
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-sm flex items-center space-x-2">
                                            <Image src="/images/search.svg" alt="Icon" width={24} height={24} />
                                            <span>Date: {announcement.date}</span>
                                        </p>
                                        <h3 className="font-bold text-black mt-2">{announcement.heading}</h3>
                                        <p className="text-teal text-sm mt-1">{announcement.description}</p>
                                    </div>
                                ))}
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

                </div>
                <div className="bg-[rgba(0,126,126,0.1)]">
                    <div className="flex flex-col items-center mt-16 mb-4">
                        <h2 className="text-teal font-bold text-xl mb-4 pt-8">Support</h2>
                        <p className="text-center text-darkGrey mb-8">
                            ON Courts are designed to realize the vision of taking courts to people and offer multiple benefits.
                        </p>
                        <div className="flex gap-6">
                            <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
                                <h3 className="font-bold text-black mb-4">Resources</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex space-x-2">
                                        <Image
                                            src="/images/search.svg"
                                            alt="Icon"
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-gray-600">On-Boarding Guide</span>
                                    </div>
                                    <Image
                                        src="/images/search.svg"
                                        alt="Icon"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <hr className="my-4" />
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex space-x-2">
                                        <Image
                                            src="/images/search.svg"
                                            alt="Icon"
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-gray-600">XX Doc</span>
                                    </div>
                                    <Image
                                        src="/images/search.svg"
                                        alt="Icon"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <hr className="my-4" />
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex space-x-2">
                                        <Image
                                            src="/images/search.svg"
                                            alt="Icon"
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-teal">OnCourt Youtube</span>
                                    </div>
                                    <Image
                                        src="/images/search.svg"
                                        alt="Icon"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                            </div>
                            <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
                                <h3 className="font-bold text-black mb-4">Grievance Redressal</h3>
                                <p className="text-gray-600 mb-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                                </p>
                                <div className="flex justify-center items-center">
                                    <button className="py-2 px-4 border-2 border-darkGrey rounded-[5px] text-teal">
                                        Click here to Submit the Grievance
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between space-x-6 px-6 mx-auto max-w-screen-xl p-8">
                        <div className="w-1/2 px-28">
                            <h2 className="font-bold text-darkGrey">Contact Us</h2>
                            <p className="text-gray-600 mt-2">
                                If you have any questions or need assistance, please feel free to contact us through the channels provided below.
                            </p>
                        </div>
                        <div className="w-1/2 px-40">
                            <div className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src="/images/search.svg"
                                        alt="Icon"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="text-teal font-bold">Helpline: 123-456-7890</span>
                                </div>
                                <hr className="my-2 border-teal" />
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src="/images/search.svg"
                                        alt="Icon"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="text-teal font-bold">oncourt@gmail.com</span>
                                </div>
                                <hr className="my-2 border-teal" />
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src="/images/search.svg"
                                        alt="Icon"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="text-teal font-bold">
                                        Available from 9:30 - 18:00 IST <br />
                                        Our Opening Hours Mon. - Fri.
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

export default Hero;
