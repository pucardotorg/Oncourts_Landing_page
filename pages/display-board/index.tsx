import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { svgIcons } from "../../data/svgIcons";
import { API_ENDPOINTS } from "../../lib/config";

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr; // fallback if invalid
  return `${day}/${month}/${year}`;
};

export default function DisplayBoard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    // const today = new Date();
    // return today.toISOString().split("T")[0]; // 'YYYY-MM-DD'\

    const now = new Date();

    // Convert current time to IST by adding 5.5 hours
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffsetMs);

    // Create IST date for 5:00 PM
    const istHour = istNow.getUTCHours();
    const istMinutes = istNow.getUTCMinutes();

    // If IST time is past 5:00 PM (17:00), move to next day
    if (istHour > 20 || (istHour === 20 && istMinutes > 0)) {
      istNow.setUTCDate(istNow.getUTCDate() + 1);
    }

    // Format date as 'YYYY-MM-DD'
    const dateStr = istNow.toISOString().split("T")[0];

    return dateStr;
  });

  const [hearingData, setHearingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showRefreshSection, setShowRefreshSection] = useState(false);

  const fetchCasesForDate = useCallback(
    async (dateStr: string, searchValue: string) => {
      const fromDate = new Date(dateStr).setHours(0, 0, 0, 0);
      const toDate = new Date(dateStr).setHours(23, 59, 59, 999);

      const payload = {
        tenantId: "kl",
        fromDate,
        toDate,
        searchText: searchValue || "",
      };

      try {
        setLoading(true);
        const response = await fetch("/api/hearing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        const hearings = data?.openHearings || [];
        setHearingData(hearings); // Keep this to update the UI
        return hearings;
      } catch (error) {
        console.error("Error fetching hearings:", error);
        setHearingData([]);
        return [];
      } finally {
        setRefreshedAt(new Date().toLocaleString());
        setLoading(false);
      }
    },
    [selectedDate]
  );

  useEffect(() => {
    fetchCasesForDate(selectedDate, searchValue);
  }, [selectedDate]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const init = async () => {
      // For the fisrt time user comes to the page,
      // we call the hearingDetails for the first time,
      // const hearings = await fetchCasesForDate(selectedDate, searchValue);

      const now = new Date();
      const isToday = selectedDate === now.toISOString().split("T")[0];
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      // const endMinutes = 17 * 60; // 5:00 PM
      const endMinutes = 17 * 60 + 52;

      // If today's date is selected date from calendar is today's date and current time is in between 11 AM and 5 PM
      // and If any single hearing is found in a stage except "COMPLETED",
      // then we keep refreshing the page every 30 seconds and keep calling the fetchCasesForDate API until ....
      // ...until either it' 5PM or all hearings all in "COMPLETD" stage. which ever happens first.

      const hasPendingHearings = hearingData?.some(
        (hearingItem: {
          hearingNumber: string;
          caseTitle: string;
          advocate: { complainant: string[]; accused: string[] };
          hearingType: string;
          status: string;
          caseNumber: string;
        }) => hearingItem.status !== "COMPLETED"
      );

      if (isToday && currentMinutes < endMinutes && hasPendingHearings) {
        setShowRefreshSection(true);
        interval = setInterval(async () => {
          const refreshedHearings = await fetchCasesForDate(
            selectedDate,
            searchValue
          );

          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();

          const stillHasPending = refreshedHearings?.some(
            (hearing) => hearing.status !== "COMPLETED"
          );

          const isPastFivePM = currentMinutes >= endMinutes;

          if (isPastFivePM || !stillHasPending) {
            if (interval) {
              setShowRefreshSection(false);
              clearInterval(interval);
              interval = null;
            }
          }
        }, 1000 * 1000); // every 30 seconds
      }
    };

    init();

    return () => {
      if (interval) clearInterval(interval); // cleanup when component unmounts
    };
  }, [selectedDate, fetchCasesForDate, hearingData]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-pistachio text-darkGreen";
      case "SCHEDULED":
        return "bg-peach text-darkBrown";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const hearingsTable = useMemo(() => {
    return (
      <div className="overflow-auto rounded border">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Sl.No</th>
              <th className="px-4 py-2 border">Case Name</th>
              <th className="px-4 py-2 border">Advocates</th>
              <th className="px-4 py-2 border">Case Number</th>
              <th className="px-4 py-2 border">Purpose</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {hearingData.map(
              (
                hearingItem: {
                  hearingNumber: string;
                  caseTitle: string;
                  advocate: { complainant: string[]; accused: string[] };
                  hearingType: string;
                  status: string;
                  caseNumber: string;
                },
                index
              ) => (
                <tr
                  key={hearingItem?.hearingNumber || index}
                  className="border-t"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{hearingItem?.caseTitle}</td>
                  <td className="px-4 py-2 border">
                    {/* {hearingItem.advocate?.map((adv: string, i: number) => (
                      <div key={i}>{adv}</div>
                    ))} */}

                    <p data-tip data-for={`hearing-list`}>
                      {hearingItem?.advocate?.complainant?.length > 0 &&
                        `${hearingItem?.advocate?.complainant?.[0]}(C)${
                          hearingItem?.advocate?.complainant?.length === 2
                            ? " + 1 Other"
                            : hearingItem?.advocate?.complainant?.length > 2
                              ? ` + ${hearingItem?.advocate?.complainant?.length - 1} others`
                              : ""
                        }`}
                    </p>
                    <p data-tip data-for={`hearing-list`}>
                      {hearingItem?.advocate?.accused?.length > 0 &&
                        `${hearingItem?.advocate?.accused?.[0]}(A)${
                          hearingItem?.advocate?.accused?.length === 2
                            ? " + 1 Other"
                            : hearingItem?.advocate?.accused?.length > 2
                              ? ` + ${hearingItem?.advocate?.accused?.length - 1} others`
                              : ""
                        }`}
                    </p>
                  </td>
                  <td className="px-4 py-2 border">{hearingItem.caseNumber}</td>
                  <td className="px-4 py-2 border">
                    {hearingItem.hearingType}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(hearingItem.status)}`}
                    >
                      {hearingItem.status}
                    </span>
                  </td>
                </tr>
              )
            )}
            {/* {hearingData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No hearings found for selected date.
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    );
  }, [hearingData]);

  const handleDownloadCauseList = async () => {
    try {
      const response = await fetch("api/_download", {
        method: "POST",
        headers: {
          Accept: "application/json,text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId: "kl",
          Criteria: {
            courtId: "KLKM52",
            searchDate: selectedDate,
          },
        }),
      });

      if (!response.ok) {
        const { error } = await response.json(); // message from server
        throw new Error(error || `HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      const date = formatDate(selectedDate);
      link.download = `causelist-${date}.pdf`;
      link.click();
    } catch (error) {
      console.error("Download failed:", (error as Error).message, error);
      alert(
        `Failed to download: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      //
    }
  };

  const showDownloadCauseListButton = useMemo(() => {
    if (!selectedDate) return false;

    const now = new Date();

    // Get IST time (UTC + 5:30)
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffsetMs);

    // Convert selectedDate string (e.g. '2025-06-25') to a Date
    const selected = new Date(selectedDate + "T00:00:00"); // Treat selected date as local midnight
    const istToday = new Date(istNow.toISOString().split("T")[0] + "T00:00:00");

    // Case 1: selectedDate is today or in the past
    if (selected <= istToday) {
      return true;
    }

    // Case 2: selectedDate is in the future
    const oneDayBeforeSelected = new Date(selected);
    oneDayBeforeSelected.setDate(oneDayBeforeSelected.getDate() - 1);

    // Set to 5:15 PM IST on the day before selected date
    const causelistReleaseTime = new Date(oneDayBeforeSelected);
    causelistReleaseTime.setHours(5, 0, 0, 0); // 5:15 PM IST

    // Convert 5:15 PM IST back to UTC
    const causelistReleaseTimeUTC = new Date(
      causelistReleaseTime.getTime() - istOffsetMs
    );

    return istNow >= causelistReleaseTimeUTC;
  }, [selectedDate]);

  const isInProgressHearing: {
    caseTitle: string | null;
    caseNumber: string | null;
  } = useMemo(() => {
    const onGoingHearing = hearingData?.find(
      (hearing: { status: string }) => hearing?.status === "IN_PROGRESS"
    );
    if (onGoingHearing) {
      return onGoingHearing;
    }
    return { caseTitle: null, caseNumber: null };
  }, [hearingData]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1
        className="text-3xl font-bold text-center mb-2"
        style={{
          color: "#3A3A3A",
          fontFamily: "Libre Baskerville, serif",
          fontWeight: "500",
          fontSize: "40px",
        }}
      >
        Display Board
      </h1>
      <p
        className="text-center text-gray-600 mb-6"
        style={{
          lineHeight: "40px",
          color: "#334155",
          fontWeight: "500",
        }}
      >
        Track the real-time status of cases listed for hearing today, and search
        for case schedules on any past or upcoming date
      </p>

      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-md border mb-6"
        style={{ justifyContent: "center" }}
      >
        <div className="flex items-center gap-2">
          <label
            style={{
              color: "#0F172A",
              fontWeight: "700",
            }}
          >
            View Case Schedule by Date
          </label>
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setShowRefreshSection(false);
              setSearchValue("");
            }}
            style={{
              width: "220px",
              height: "32px",
              borderRadius: "4px",
              border: "1.44px solid #3D3C3C",
            }}
          />
        </div>
        {hearingData?.length > 0 && (
          <div>
            {showDownloadCauseListButton ? (
              <React.Fragment>
                <button
                  style={{
                    width: "190px",
                    height: "34px",
                    borderRadius: "4px",
                    border: "1px solid #E8E8E8",
                    backgroundColor: "rgb(243 244 246 / var(--tw-bg-opacity))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={handleDownloadCauseList}
                >
                  <svgIcons.downloadIcon2 />
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "13px",
                      marginLeft: "5px",
                      color: "#334155",
                      opacity: 0.9,
                    }}
                  >
                    {"Download CauseList"}
                  </div>
                </button>
              </React.Fragment>
            ) : (
              <div
                className="cause-list-not-generated-message-section"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  justifyContent: "center",
                }}
              >
                <svgIcons.infoIcon />
                <span style={{ maxWidth: "290px", fontSize: "14px" }}>
                  The cause list for this day will be available after
                  <span style={{ color: "#334155", fontWeight: "bold" }}>
                    {" "}
                    5:00 PM on the previous day
                  </span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="case-search-filter-section flex justify-between items-center mb-2"
        style={{ height: "51px" }}
      >
        <h2 className="text-lg font-semibold" style={{ fontSize: "22px" }}>
          Case Schedule |{" "}
          <span
            className=""
            style={{
              color: "#0F766E",
            }}
          >
            {new Date(selectedDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </h2>
        <div
          className="search-case-filter-input-section relative w-72"
          style={{
            width: "370px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
            style={{ cursor: "pointer", paddingLeft: "20px" }}
            onClick={() => fetchCasesForDate(selectedDate, searchValue)}
          >
            <svgIcons.SearchIcon2 />
          </span>
          <span style={{ width: "100%", paddingLeft: "10px" }}>
            <input
              type="text"
              placeholder="Search by case name, ID or advocate"
              className="border pl-10 pr-3 py-1.5 rounded w-full"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchCasesForDate(selectedDate, searchValue);
                }
              }}
            />
          </span>
        </div>
      </div>

      {showRefreshSection && (
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          {isInProgressHearing?.caseNumber && (
            <div className="join-onoine-hearing-section flex items-center gap-2">
              <div className="join-hearing-online-button">
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#3A3A3A",
                    color: "white",
                    width: "190px",
                    height: "40px",
                    borderRadius: "5px",
                  }}
                >
                  <span>
                    <svgIcons.videoCallIcon />
                  </span>
                  <span>Join Hearing Online</span>
                </button>
              </div>

              <div className="going-hearing-details">
                <span style={{ color: "#334155", fontWeight: "700" }}>
                  {`${isInProgressHearing?.caseTitle} ${isInProgressHearing?.caseNumber} hearing is on-going`}
                </span>
              </div>
            </div>
          )}

          <div
            className="last-refreshed-time-section"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>
              <svgIcons.refreshIcon />
            </span>
            <span
              style={{
                color: "#2563EB",
                fontWeight: "700",
              }}
            >
              Last refreshed on {refreshedAt}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading hearings...</p>
      ) : (
        <React.Fragment>
          {" "}
          {hearingData?.length === 0 ? (
            <p
              style={{
                fontSize: "15px",
                color: "#DC2626",
                fontWeight: "700",
                padding: "10px",
                borderTop: "solid 1px  #CBD5E1",
              }}
              className=""
            >
              No cases scheduled for this date
            </p>
          ) : (
            hearingsTable
          )}
        </React.Fragment>
      )}
    </div>
  );
}
