// sami
// جميع التعليقات داخل الكود باللغة العربية فقط.

import ENDPOINTS from '../samiendpoint';

// ملاحظات:
// - تم تحويل الدوال لاستخدام API حقيقية بدلاً من البيانات الوهمية
// - جميع الدوال الآن تستدعي Backend الحقيقي

// قائمة العيادات من قاعدة البيانات (يمكن جلبها من API لاحقاً)
export const MOCK_CLINICS = [
  { id: 1, name: "Main Clinic" },
  { id: 2, name: "سعير" },
  { id: 3, name: "عيادة السلام" },
];

// دالة مساعدة لحساب المتوسط الآمن
const safeAverage = (arr) => {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
  return Math.round((sum / arr.length) * 10) / 10;
};

// إرجاع تجميعي لمتوسط تقييم التطبيق والعيادات
export const getAggregates = async () => {
  try {
    const response = await fetch(ENDPOINTS.ratingsAggregates);
    if (!response.ok) throw new Error('Failed to fetch aggregates');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching aggregates:', error);
    return { appAverage: 0, clinicAverage: 0, count: 0 };
  }
};

// إرجاع أحدث التقييمات (عام)
export const getPublicRatings = async ({ limit = 20 } = {}) => {
  try {
    const response = await fetch(ENDPOINTS.ratingsAll);
    if (!response.ok) throw new Error('Failed to fetch ratings');
    const data = await response.json();
    return data.slice(0, limit);
  } catch (error) {
    console.error('Error fetching public ratings:', error);
    return [];
  }
};

// إرجاع جميع التقييمات (لحساب الصحة)
export const getAllRatings = async () => {
  try {
    const response = await fetch(ENDPOINTS.ratingsAll);
    if (!response.ok) throw new Error('Failed to fetch all ratings');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all ratings:', error);
    return [];
  }
};

// إرجاع أحدث تقييم للمريض للمساعدة في القيود الزمنية
export const getLatestPatientRating = async (patientId) => {
  if (!patientId) return null;
  try {
    const response = await fetch(ENDPOINTS.ratingsPatientLatest(patientId));
    if (!response.ok) throw new Error('Failed to fetch patient rating');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching patient rating:', error);
    return null;
  }
};

// التحقق إن كان المريض يستطيع التقييم خلال هذا الشهر
export const canSubmitRatingThisMonth = async (patientId) => {
  try {
    const response = await fetch(ENDPOINTS.ratingsPatientCanSubmit(patientId));
    if (!response.ok) throw new Error('Failed to check rating eligibility');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking rating eligibility:', error);
    return { allowed: true };
  }
};

// تحديد عيادة المريض الحالية (لاحقاً تُجلب من السيرفر بعد تسجيل الدخول)
export const getCurrentPatientClinicId = () => {
  // يمكن لاحقاً قراءة العيادة من سياق المستخدم/التوكن
  return 1; // تم تغيير من "c1" إلى 1 لمطابقة قاعدة البيانات
};

// إرسال تقييم جديد
export const submitRating = async ({
  patientId,
  patientName,
  clinicId,
  clinicName,
  appRating,
  clinicRating,
  comment,
}) => {
  try {
    const response = await fetch(ENDPOINTS.ratingsSubmit, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: patientId,
        patient_name: patientName || "مستخدم",
        clinic_id: clinicId || 1,
        clinic_name: clinicName || "عيادة الصحة",
        app_rating: Number(appRating) || 0,
        clinic_rating: Number(clinicRating) || 0,
        comment: comment || "",
      }),
    });
    
    if (!response.ok) throw new Error('Failed to submit rating');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

// فلترة التقييمات بحسب العيادة والمدى الزمني
export const filterRatings = async ({ clinicId, startDate, endDate } = {}) => {
  try {
    const params = new URLSearchParams();
    if (clinicId && clinicId !== "all") {
      params.append('clinic_id', clinicId);
    }
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }
    
    const url = `${ENDPOINTS.ratingsFilter}?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Failed to filter ratings');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error filtering ratings:', error);
    return { items: [], appAverage: 0, clinicAverage: 0, count: 0 };
  }
};

// ملاحظات:
// - تم تحويل جميع الدوال لاستخدام API حقيقية من Backend
// - البيانات تُخزن وتُجلب من قاعدة البيانات MySQL
