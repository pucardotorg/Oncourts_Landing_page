import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SearchForCase = () => {
  const [selectedButton, setSelectedButton] = useState("CNR");
  const [caseNumber, setCaseNumber] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = () => {
    console.log("Form submitted:", { caseNumber, selectedYear, selectedCaseType, captchaValue });
  };

  const handleClear = () => {
    setCaseNumber("");
    setSelectedYear("");
    setSelectedCaseType("");
    setCaptchaValue(null);
  };

  return (
    <div className="font-Poppins max-w-xl mx-auto py-8">
      <h2 className="text-teal font-bold text-3xl mb-4 text-center">Search for a Case</h2>
      <div className="mx-8">
      <div className="flex border-2 border-teal rounded-xl mb-6 p-2">
        <button
          onClick={() => handleButtonClick("CNR")}
          className={`flex-1 py-2 px-2 text-center rounded-sm ${selectedButton === "CNR" ? "bg-teal text-white" : "text-teal"} border-r-2 border-teal`}
        >
          Case Number Record (CNR)
        </button>
        <button
          onClick={() => handleButtonClick("CaseNumber")}
          className={`flex-1 py-2 text-center rounded-sm ${selectedButton === "CaseNumber" ? "bg-teal text-white" : "text-teal"}`}
        >
          Case Number
        </button>
      </div>
      </div>

      <div className="p-6 rounded-2xl shadow-md">
        {selectedButton === "CNR" && (
          <>
            <div className="mb-4">
              <label htmlFor="cnrInput" className="text-teal font-medium text-sm">Enter CNR Number</label>
              <div className="rounded-xl border-2 border-teal p-2 mt-2">
                <input
                  type="text"
                  id="cnrInput"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder="For example : MHAU02153654478"
                  className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                />
              </div>
            </div>
          </>
        )}

        {selectedButton === "CaseNumber" && (
          <>
            <div className="mb-4">
              <label htmlFor="caseType" className="text-teal font-medium text-sm">Select Case Type</label>
              <div className="w-full rounded-2xl border border-teal p-4 mt-2">
                <select
                  id="caseType"
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                  className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                >
                  <option value="">Select Case Type</option>
                  <option value="Type1">Type 1</option>
                  <option value="Type2">Type 2</option>
                  <option value="Type3">Type 3</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="caseNumberInput" className="text-teal font-medium text-sm">Enter Case Number</label>
              <div className="flex space-x-4 mt-2">
                <div className="w-1/2 rounded-2xl border border-teal p-4">
                  <input
                    type="text"
                    id="caseNumberInput"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="For example : 02153654478"
                    className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                  />
                </div>
                <div className="w-1/2 rounded-2xl border border-teal p-4 bg-transparent">
                  <select
                    id="yearInput"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full py-2 px-4 rounded-2xl outline-none bg-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center mb-6">
          <ReCAPTCHA
            sitekey="YOUR_GOOGLE_RECAPTCHA_SITE_KEY"
            onChange={handleCaptchaChange}
          />
        </div>

        <div className="flex justify-around mx-28">
          <button onClick={handleClear} className="py-2 px-6 rounded-2xl border border-teal text-teal">
            Clear Response
          </button>
          <button onClick={handleSubmit} className="py-2 px-6 rounded-2xl bg-teal text-white">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForCase;
