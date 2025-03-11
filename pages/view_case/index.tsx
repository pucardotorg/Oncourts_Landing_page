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

    useEffect(() => {
        if (!caseNumber.trim()) return;

        const fetchCaseSummary = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/case/${year}/${caseType}/${caseNumber}`);
                const res = await response.json();
                setData(res.caseSummary || []);
            } catch (error) {
                // console.error("Error fetching case summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCaseSummary();
    }, [caseNumber, caseType, year]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            {!loading && data && <SingleCase data={data} />}
        </div>
    );
};

export default ViewCase;