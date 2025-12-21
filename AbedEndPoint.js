// AbedEndPoint.js
const BASE_URL = "http://192.168.1.128:8000";

const AbedEndPoint = {
  BASE_URL,

  // ✅ NEW: Patient data for doctor screen
  doctorPatientData: (patientId) => `${BASE_URL}/doctor/patient-data/${patientId}`,

  // Labs (❌ this screen won't use these anymore)
  labsList: `${BASE_URL}/labs`,
  labsSearch: `${BASE_URL}/labs`,
  labById: (id) => `${BASE_URL}/labs/${id}`,
  labsAdd: `${BASE_URL}/labs/add`,
  labsCities: `${BASE_URL}/labs/cities`,

  // Lab dashboard (❌ this screen won't use these anymore)
  labDashboardById: (id) => `${BASE_URL}/lab/dashboard/${id}`,
  labResultsByPatient: (id) => `${BASE_URL}/lab/results/${id}`,

  // Medications
  medicationsList: `${BASE_URL}/medications`,

  // Patient medications
  patientMedsList: `${BASE_URL}/patient-medications/`,
  patientMedicationById: (id) => `${BASE_URL}/patient-medications/${id}`,
  patientMedsByPatient: (patientId) =>
    `${BASE_URL}/patient-medications/by-patient/${patientId}`,
  patientMedsPatients: `${BASE_URL}/patient-medications/patients`,
  patientMedsMedications: `${BASE_URL}/patient-medications/medications`,

  // Patients
  patientCities: `${BASE_URL}/doctor/cities`,
  patientById: (id) => `${BASE_URL}/patient/patients/${id}`,
  patientCreate: `${BASE_URL}/doctor/patients`,

  // Tests (❌ this screen won't use these anymore)
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
