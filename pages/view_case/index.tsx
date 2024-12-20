import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';

const ViewCase = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const { query } = router;
    const caseString = query.caseData;
    let caseType = '';
    let caseNumber = '';
    let year = '';
    if (typeof caseString === 'string') {
        [caseType, caseNumber, year] = caseString.split('/');
    }

    async function searchCaseSummary() {
        if (!caseNumber) {
            return;
        }

        setLoading(true);
        const API_ENDPOINT = "https://dristi-kerala-dev.pucar.org";
        const tenantID = "kl";
        const url = `${API_ENDPOINT}/openapi/v1/${tenantID}/case/${year}/${caseType}/${caseNumber}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const res = await response.json();
            const caseList = res["caseSummary"];
            setData(caseList);
        } catch (error) {
            console.error("Error:", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        searchCaseSummary();
    }, [caseNumber]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4 mx-8">
                <h2 className="text-2xl font-bold text-black text-center mx-auto">Case Details</h2>
                <div className="flex space-x-4">
                    <Link href="/search" className="underline py-2 px-4">Find another case details</Link>
                </div>
            </div>
            <div className="bg-gray-200 h-[50px] mx-6 rounded-t-md"></div>
            {!loading && data && (
                <div className="grid grid-cols-2 mx-6">
                    <div className="bg-white p-6 border border-gray-200">
                        <div className="grid gap-4 mb-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">CNR :</p>
                                <p className="font-semibold">{data["cnrNumber"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Petitioner :</p>
                                <p className="font-semibold">{data["complainant"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Petitioner Advocate :</p>
                                <p className="font-semibold">{data["advocateComplainant"] ?? "-"}</p>
                            </div>
                        </div>
                        <hr className="mb-1" />
                        <hr />
                        <div className="grid gap-4 mt-4 mb-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Filing Number :</p>
                                <p className="font-semibold">{data["filingNumber"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Registration No. :</p>
                                <p className="font-semibold">{data["registrationNumber"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Case Type :</p>
                                <p className="font-semibold">{data["caseType"] ?? "-"}</p>
                            </div>
                        </div>
                        <hr className="mb-1" />
                        <hr />
                        <div className="grid gap-4 mt-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Status :</p>
                                <p className="font-semibold">{data["status"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Stage / Type of Dsip :</p>
                                <p className="font-semibold">{data["subStage"] ?? "-"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 border border-gray-200 rounded-r-md">
                        <div className="grid gap-4 mb-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Judge :</p>
                                <p className="font-semibold">{data["judgeName"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Respondent :</p>
                                <p className="font-semibold">{data["respondent"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Respondent Advocate :</p>
                                <p className="font-semibold">{data["advocateRespondent"] ?? "-"}</p>
                            </div>
                        </div>
                        <hr className="mb-1" />
                        <hr />
                        <div className="grid gap-4 mt-4 mb-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Filing Date :</p>
                                <p className="font-semibold">{data["filingDate"] ? new Date(data["filingDate"]).toUTCString() : "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Registration Date :</p>
                                <p className="font-semibold">{data["registrationDate"] ? new Date(data["registrationDate"]).toUTCString() : "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">First Hearing date :</p>
                                <p className="font-semibold">{data["nextHearingDate"] ? new Date(data["nextHearingDate"]).toUTCString() : "-"}</p>
                            </div>
                        </div>
                        <hr className="mb-1" />
                        <hr />
                        <div className="grid gap-4 mt-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Judge :</p>
                                <p className="font-semibold">{data["judgeName"] ?? "-"}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p className="font-semibold text-[rgba(2,137,233,1)]">Act :</p>
                                <p className="font-semibold">S13338, NI Act</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-gray-200 h-[50px] mx-6 rounded-b-md"></div>
        </div>
    );
};

export default ViewCase;