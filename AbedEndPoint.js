// AbedEndPoint.js
import { Platform } from "react-native";

// ✅ غيّر هذا الـ IP ليكون IP جهازك اللي شغال عليه السيرفر (Django/FastAPI/...)
// مثال: ipconfig -> IPv4 Address
const DEV_MACHINE_IP = "192.168.1.122";

// ✅ Android Emulator لازم 10.0.2.2 بدل localhost
const ANDROID_EMULATOR_BASE = "http://10.0.2.2:8000";

// ✅ للأجهزة الفعلية (موبايل على نفس الشبكة)
const LAN_BASE = `http://${DEV_MACHINE_IP}:8000`;

// ✅ اختر تلقائياً
// - Android Emulator => 10.0.2.2
// - غير هيك => IP الشبكة
const BASE_URL =
  Platform.OS === "android" ? ANDROID_EMULATOR_BASE : LAN_BASE;

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
  labResultsByPatient: (id) => `${BASE_URL}/lab/results/${id}`,

  // Medications (catalog)
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
  patientCreate: `${BASE_URL}/doctor/patients`, // ✅ مستخدم في Step1

  // ❌ محذوف لأنه ما عاد في endpoint /patient/search
  // patientSearch: `${BASE_URL}/patient/search`,

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
