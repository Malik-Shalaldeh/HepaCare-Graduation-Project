// AbedEndPoint.js
import { Platform } from "react-native";

//const BASE_URL = "https://luminous-possibility-production.up.railway.app";
const BASE_URL = "https://a860581e-ff37-4cca-a5df-9899b5f5190d-00-21pazcdxx3mej.pike.replit.dev";
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
  // ✔ جديد: نتائج مختبر حسب المريض
  labResultsByPatient: (id) => `${BASE_URL}/lab/results/${id}`,

  // Medications (catalog)
  medicationsList: `${BASE_URL}/medications`,

  // Patient medications
  // مجموعة: مع سلاش أخير (يتفادى 307 في GET/POST)
  patientMedsList: `${BASE_URL}/patient-medications/`,
  // عنصر: بدون سلاش (يتفادى 307 في PUT/DELETE)
  patientMedicationById: (id) => `${BASE_URL}/patient-medications/${id}`,
  patientMedsByPatient: (patientId) =>
    `${BASE_URL}/patient-medications/by-patient/${patientId}`,
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
    `${BASE_URL}/health-meds/set-availability?med_id=${encodeURIComponent(
      medId
    )}&available=${available ? 1 : 0}`,

  // Symptom tracking
  symptomPatients: `${BASE_URL}/symptom-tracking/patients`,
  symptomSymptoms: `${BASE_URL}/symptom-tracking/symptoms`,
  symptomEntries: `${BASE_URL}/symptom-tracking/entries`,
};

export default AbedEndPoint;
