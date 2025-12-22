
const BASE_URL = "http://192.168.1.128:8000";

const ENDPOINTS = {
  // الاتصال الأساسي
  BASE_URL,

  // Visits
  visitsHistory: `${BASE_URL}/visits/history`,
  searchPatients: `${BASE_URL}/doctor/search-patients`,
  
  // Patients
  patientsList: `${BASE_URL}/doctor/patients`,
  
  // Authentication
  login: `${BASE_URL}/auth/login`,
  
  
  // Doctors
  doctors: `${BASE_URL}/doctors`,
  aiUrl:`${BASE_URL}/config/ai-url`,

  // Patients
  patients: `${BASE_URL}/patients`,

  // Visits
  visits: `${BASE_URL}/visits`,

  // Patient Appointments
  patientAppointments: `${BASE_URL}/patients/appointments`,
  patientAppointmentsByPatient: (patientId) => `${BASE_URL}/patient/appointments/${patientId}`,
  doctorAppointments: (doctorId) => `${BASE_URL}/doctor/appointments/${doctorId}`,
  doctorAppointmentCreate: `${BASE_URL}/doctor/appointments`,
  doctorAppointmentUpdate: (appointmentId) => `${BASE_URL}/doctor/appointments/${appointmentId}`,
  doctorAppointmentDelete: (appointmentId) => `${BASE_URL}/doctor/appointments/${appointmentId}`,

  // Lab Results
  labResults: `${BASE_URL}/patient/lab-results`,

  // Labs
  labsList: `${BASE_URL}/labs/list`,
  labsSearch: `${BASE_URL}/labs/search`,

  // Ratings (التقييمات)
  ratingsAll: `${BASE_URL}/ratings/all`,
  ratingsAggregates: `${BASE_URL}/ratings/aggregates`,
  ratingsSubmit: `${BASE_URL}/ratings/submit`,
  ratingsFilter: `${BASE_URL}/ratings/filter`,
  ratingsPatientLatest: (patientId) => `${BASE_URL}/ratings/patient/${patientId}/latest`,
  ratingsPatientCanSubmit: (patientId) => `${BASE_URL}/ratings/patient/${patientId}/can-submit`,

};

export default ENDPOINTS;
