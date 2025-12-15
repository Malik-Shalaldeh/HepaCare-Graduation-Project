// malikEndPoint.js
//const BASE_URL = "https://luminous-possibility-production.up.railway.app";
const BASE_URL = "http://192.168.1.7:8000"; 
const ENDPOINTS = {
  BASE_URL,
  TEST_RESULTS: {
    SEARCH: `${BASE_URL}/test-results/`,
    FILE_BASE: BASE_URL,
  },
  PATIENT_CHART: {
    GET: `${BASE_URL}/patient-chart/`,
  },
  DOCTOR_DASHBOARD: {
    GET: `${BASE_URL}/doctor/dashboard`,
  },
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
  },
  PATIENT_LAB_RESULTS: {
    BY_ID: (id) => `${BASE_URL}/patient/lab-results/${id}`,
  },
  PATIENT_DASHBOARD: {
    BY_ID: (id) => `${BASE_URL}/patient/dashboard/${id}`,
  },
  ADMIN: {
    SEARCH_BY_ROLE: `${BASE_URL}/admin/search-by-role`,
    USER_DETAILS: `${BASE_URL}/admin/user-details`,
    UPDATE_USER_PASSWORD: `${BASE_URL}/admin/update-user-password`,
    DOCTORS: `${BASE_URL}/admin/doctors`,
    SEARCH_DOCTORS: `${BASE_URL}/admin/search-doctors`,
    TOGGLE_DOCTOR: (id) => `${BASE_URL}/admin/doctors/${id}/toggle`,
    ADD_DOCTOR: `${BASE_URL}/admin/doctors/add`,
  },
  VISITS: {
    CREATE: `${BASE_URL}/visits/`,
  },
  STATS: {
    PATIENTS_BY_CITY: `${BASE_URL}/statistics/patients-by-city`,
  },
};

export default ENDPOINTS;
