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
    RECENT_CAUSE_LIST: `/api/scheduler/causelist/v1/_recentCauseList`,
    DOWNLOAD: `/api/scheduler/causelist/v1/_download`,
  },
  
  // OpenAPI endpoints
  OPENAPI: {
    CASE: `/api/openapi/v1/kl/case`,
    CASE_BY_CNR: (caseNumber: string) => `/api/openapi/v1/kl/case/cnr/${caseNumber}`,
    CASE_BY_TYPE: (year: string, type: string, offset: string, limit: string) => 
      `/api/openapi/v1/kl/case/${year}/${type}?offset=${offset}&limit=${limit}`,
    CASE_BY_NUMBER: (year: string, type: string, caseNumber: string) => 
      `/api/openapi/v1/kl/case/${year}/${type}/${caseNumber}`,
  },
  
  // MDMS endpoints
  MDMS: {
    SEARCH: `/api/egov-mdms-service/v1/_search?tenantId=kl`,
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
  FEEDBACK_FORM: 'https://forms.gle/uCSgGiqGiMQYjjgeA',
  YOUTUBE_PLAYLIST: 'https://www.youtube.com/playlist?list=PL2HnAXES1w-ShQIq8DAhvqeYe-uLCAr6F',
  USER_MANUAL: 'https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=sharing',
  ECOURTS_HOME: 'https://ecourts.gov.in/ecourts_home/index.php?p=dist_court/kerala',
  KOLLAM_COURTS: 'https://kollam.dcourts.gov.in/',
  HIGH_COURT: 'https://highcourt.kerala.gov.in/',
  SUPREME_COURT: 'https://www.sci.gov.in/',
};
