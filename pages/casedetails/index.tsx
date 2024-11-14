import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CaseDetails = () => {
    const router = useRouter();
    const [data, setData] = useState({});

    useEffect(() => {
        if (router.isReady) {
          const queryData = router.query.data;
          if (typeof queryData === 'string') { 
            try {
              const parsedData = JSON.parse(queryData);
              console.log(parsedData)
              setData(parsedData)
            } catch (error) {
              console.error("Error parsing data:", error);
            }
          }
        }
      }, [router.isReady, router.query.data]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4 mx-8">
                <h2 className="text-2xl font-bold text-black">Case Details</h2>
                <div className="flex space-x-4">
                    <button className="py-2 px-4 bg-teal text-white rounded-md">
                        Download
                    </button>
                    <Link href="/search">
                        <a className="underline py-2 px-4">Find another case details</a>
                    </Link>
                </div>
            </div>
            <div className="bg-gray-200 h-[50px] mx-6  rounded-t-md">
            </div>
            <div className="grid grid-cols-2 mx-6">
                <div className="bg-white p-6 border border-gray-200">
                    <div className="grid gap-4 mb-4">
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">CNR :</p>
                            <p className="font-semibold">KLKM1000242592002</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Petitioner :</p>
                            <p className="font-semibold">Siddarth Raman</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Petitioner Advocate :</p>
                            <p className="font-semibold">Siddarth Raman</p>
                        </div>
                    </div>
                    <hr className="mb-1" />
                    <hr />
                    <div className="grid gap-4 mt-4 mb-4">
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Filing Number :</p>
                            <p className="font-semibold">ST/12345/2024</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Registration No. :</p>
                            <p className="font-semibold">{data["registrationNumber"]}</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Case Type :</p>
                            <p className="font-semibold">Summary Trail</p>
                        </div>
                    </div>
                    <hr className="mb-1" />
                    <hr />
                    <div className="grid gap-4 mt-4">
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Status :</p>
                            <p className="font-semibold">Value 1</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Stage / Type of Dsip :</p>
                            <p className="font-semibold">{data["stage"]}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 border border-gray-200 rounded-r-md">
                    <div className="grid gap-4 mb-4">
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Judge :</p>
                            <p className="font-semibold">Justice DY Chandrachud</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Respondent :</p>
                            <p className="font-semibold">Siddarth Raman</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Respondent Advocate :</p>
                            <p className="font-semibold">Siddarth Raman</p>
                        </div>
                    </div>
                    <hr className="mb-1" />
                    <hr />
                    <div className="grid gap-4 mt-4 mb-4">
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Filing Date :</p>
                            <p className="font-semibold">{data["filingDate"]}</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Registration Date :</p>
                            <p className="font-semibold">{data["registrationDate"]}</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">First Hearing date :</p>
                            <p className="font-semibold">24th September 2024</p>
                        </div>
                    </div>
                    <hr className="mb-1" />
                    <hr />
                    <div className="grid gap-4 mt-4">
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Judge :</p>
                            <p className="font-semibold">Justice DY Chandrachud</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold text-[rgba(2,137,233,1)]">Act :</p>
                            <p className="font-semibold">S13338, NI Act</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 h-[50px] mx-6 rounded-b-md">
            </div>
        </div>
    );
};

export default CaseDetails;
