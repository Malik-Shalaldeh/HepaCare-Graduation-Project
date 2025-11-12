// AbedEndPoint.js
import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://192.168.1.9:8000'
    : 'http://192.168.1.9:8000';

const AbedEndPoint = {
  BASE_URL,

  // Labs
  labsList: `${BASE_URL}/labs`,
  labsSearch: `${BASE_URL}/labs`,
  labById: (id) => `${BASE_URL}/labs/${id}`,
  labsAdd: `${BASE_URL}/labs/add`,
  labsCities: `${BASE_URL}/labs/cities`,

  // Lab dashboard
  labDashboardById: (id) => `${BASE_URL}/lab/dashboard/${id}`,

  // Medications (catalog)
  medicationsList: `${BASE_URL}/medications`,

  // Patient medications
  // ✅ المجموعة: مع سلاش أخير (يتفادى 307 في GET/POST)
  patientMedsList: `${BASE_URL}/patient-medications/`,
  // ✅ العنصر: بدون سلاش (يتفادى 307 في PUT/DELETE)
  patientMedicationById: (id) => `${BASE_URL}/patient-medications/${id}`,
  patientMedsByPatient: (patientId) => `${BASE_URL}/patient-medications/by-patient/${patientId}`,
  patientMedsPatients: `${BASE_URL}/patient-medications/patients`,
  patientMedsMedications: `${BASE_URL}/patient-medications/medications`,

  // Patients
  patientSearch: `${BASE_URL}/patient/search`,
  patientById: (id) => `${BASE_URL}/patient/patients/${id}`,
  patientCreate: `${BASE_URL}/patient/patients`,

  // InputTestResultScreen
  testsList: `${BASE_URL}/tests/list`,
  patientsSearch: `${BASE_URL}/patients/search`,
  inputResultSave: `${BASE_URL}/input-result/save`,

  // Health meds
  healthMeds: `${BASE_URL}/health-meds`,
  setHealthMedAvailability: (medId, available) =>
    `${BASE_URL}/health-meds/set-availability?med_id=${encodeURIComponent(medId)}&available=${available ? 1 : 0}`,
};

export default AbedEndPoint;
