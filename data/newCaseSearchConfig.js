/**
 * Comprehensive configuration for the case search functionality
 */

export const newCaseSearchConfig = {
  // Page header
  heading: "Case Search",

  // Search tab configuration
  tabs: [
    { id: "case_number", label: "Case Number" },
    { id: "cnr_number", label: "CNR Number" },
    { id: "filing_number", label: "Filing Number" },
    { id: "advocate", label: "Advocate" },
    { id: "litigant", label: "Litigant" },
    { id: "all", label: "All" },
  ],

  // CNR Number form
  cnrNumber: {
    label: "Enter CNR Number",
    placeholder: "Example: KLKM520000452024",
    pattern: "^[A-Z]{4}\\d{12}$",
    errorMessage: "Please enter a valid CNR number (e.g., KLKM520000452024)",
  },

  // Case Number form
  caseNumber: {
    courtLabel: "Select Court",
    caseTypeLabel: "Select Case Type",
    caseNumberLabel: "Enter Case Number",
    yearLabel: "Select Year",
    pattern: "^[A-Z]+\\/\\d*\\/\\d{4}$",
    errorMessage: "Please enter a valid case number (e.g., CMP/15/2024)",
    placeholders: {
      CMP: "Example: CMP/15/2024",
      ST: "Example: ST/15/2024",
    },
  },

  // Filing Number form
  filingNumber: {
    courtLabel: "Select Court",
    codeLabel: "Enter Filing Code",
    numberLabel: "Enter Filing Number",
    yearLabel: "Select Year",
  },

  // Advocate search form
  advocate: {
    searchMethodLabel: "Search By",
    methods: [
      { value: "Bar Code", label: "Bar Code" },
      { value: "Advocate Name", label: "Advocate Name" },
    ],
    barCodeLabel: "Enter Bar Registration Code",
    nameLabel: "Enter Advocate Name",
    codeLabel: "Enter Code",
    yearLabel: "Select Year",
  },

  // Litigant search form
  litigant: {
    nameLabel: "Enter Litigant Name",
    placeholder: "Enter full name of litigant",
  },

  // All cases form
  all: {
    courtLabel: "Select Court",
    caseTypeLabel: "Select Case Type",
    yearLabel: "Select Year",
  },

  // Common form elements
  common: {
    courts: [
      { value: "KOLLAM", label: "Kollam" },
      { value: "KOTTAYAM", label: "Kottayam" },
      { value: "THRISSUR", label: "Thrissur" },
    ],
    caseTypes: [
      { value: "CMP", label: "CMP" },
      { value: "ST", label: "ST" },
      { value: "CC", label: "CC" },
      { value: "CRL", label: "CRL" },
    ],
    years: Array.from({ length: 10 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: year.toString() };
    }),
  },

  // Button labels
  buttons: {
    clear: "Clear",
    search: "Search Case",
    reset: "Reset Filters",
  },

  // Additional filters
  filters: {
    courtNameLabel: "Court Name",
    caseTypeLabel: "Case Type",
    hearingDateFromLabel: "Hearing Date From",
    hearingDateToLabel: "Hearing Date To",
    filingYearLabel: "Filing Year",
    caseStageLabel: "Case Stage",
    caseStatusLabel: "Case Status",
  },

  // Case details table
  table: {
    columns: [
      { id: "caseTitle", label: "Case Title" },
      { id: "caseNumber", label: "Case Number" },
      { id: "nextHearingDate", label: "Next Hearing Date" },
      { id: "purpose", label: "Purpose" },
      { id: "actions", label: "Actions" },
    ],
    viewDetailsButton: "View Details",
    pagination: {
      prev: "Previous",
      next: "Next",
      ofText: "of",
    },
  },
};
