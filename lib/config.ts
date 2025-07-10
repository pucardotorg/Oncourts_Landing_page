/**
 * Central configuration file for API endpoints and URLs
 * Uses environment variables for different deployment environments
 */

// Base API URL from environment variable with fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT;

// API endpoints
export const API_ENDPOINTS = {
  // Scheduler endpoints
  SCHEDULER: {
    RECENT_CAUSE_LIST: `${API_BASE_URL}/scheduler/causelist/v1/_recentCauseList`,
    DOWNLOAD: `${API_BASE_URL}/scheduler/causelist/v1/_download`,
  },

  // Landing page endpoints
  LANDING_PAGE: {
    SEARCH_NOTICES: `${API_BASE_URL}/landing-page/v1/search-notices`,
  },

  // Inbox endpoints
  INBOX: {
    SEARCH: `${API_BASE_URL}/inbox/v2/open/_search`,
  },

  // OpenAPI endpoints
  OPENAPI: {
    CASE: `${API_BASE_URL}/openapi/v1/kl/case`,
    CASE_BY_CNR: (caseNumber: string) =>
      `${API_BASE_URL}/openapi/v1/kl/case/cnr/${caseNumber}`,
    CASE_BY_TYPE: (year: string, type: string, offset: string, limit: string) =>
      `${API_BASE_URL}/openapi/v1/kl/case/${year}/${type}?offset=${offset}&limit=${limit}`,
    CASE_BY_NUMBER: (year: string, type: string, caseNumber: string) =>
      `${API_BASE_URL}/openapi/v1/kl/case/${year}/${type}/${caseNumber}`,
    HEARING: `${API_BASE_URL}/openapi/v1/hearings`,
    ORDER_TASKS: `${API_BASE_URL}/openapi/v1/orders_tasks`,
    MAGISTRATE: (courtId: string, tenantId: string) =>
      `${API_BASE_URL}/openapi/v1/magistrate_name/${courtId}/${tenantId}`,
    DOWNLOAD_FILE: (tenantId: string, orderId: string) =>
      `${API_BASE_URL}/openapi/v1/file/${tenantId}/${orderId}`,
  },

  // MDMS endpoints
  MDMS: {
    SEARCH: `${API_BASE_URL}/egov-mdms-service/v1/_search?tenantId=kl`,
  },
};

// Application URLs
export const APP_URLS = {
  CITIZEN_APP: `${API_BASE_URL}/ui/citizen/login`,
  EMPLOYEE_APP: `${API_BASE_URL}/ui/employee/login`,
  CITIZEN_DRISTI: `${API_BASE_URL}/ui/citizen/dristi/home/login`,
  EMPLOYEE_USER: `${API_BASE_URL}/ui/employee/user/login`,
};

// External URLs (these typically don't need to be configurable)
export const EXTERNAL_URLS = {
  FEEDBACK_FORM: "https://forms.gle/uCSgGiqGiMQYjjgeA",
  YOUTUBE_PLAYLIST:
    "https://www.youtube.com/playlist?list=PL2HnAXES1w-ShQIq8DAhvqeYe-uLCAr6F",
  USER_MANUAL:
    "https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=sharing",
  ECOURTS_HOME:
    "https://ecourts.gov.in/ecourts_home/index.php?p=dist_court/kerala",
  KOLLAM_COURTS: "https://kollam.dcourts.gov.in/",
  HIGH_COURT: "https://highcourt.kerala.gov.in/",
  SUPREME_COURT: "https://www.sci.gov.in/",
};
