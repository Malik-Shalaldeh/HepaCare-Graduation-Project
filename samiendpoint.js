// Centralized definition of all backend REST endpoints
// Add new endpoints here and import this file wherever needed.
// This makes maintaining URL changes easy and avoids hard-coding strings.

import { Platform } from 'react-native';

// تحديد الـ BASE URL بناءً على المنصة
const BASE_URL = Platform.OS === 'android' 
  ?  'http://192.168.1.8:8000'  // للأندرويد
  :  'http://192.168.1.8:8000'; // للماك/ويندوز

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
  
  // Messaging
  sendMessage: `${BASE_URL}/messages`,
  fetchMessages: `${BASE_URL}/messages`,

  // Doctors
  doctors: `${BASE_URL}/doctors`,

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

  // TODO: أضف المزيد من endpoints حسب الحاجة
};

export default ENDPOINTS;
