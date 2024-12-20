import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import SingleCase from '../casedetails/single_case';

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
            {!loading && data && <SingleCase data={data} />}
        </div>
    );
};

export default ViewCase;