// sami
// جميع التعليقات داخل الكود باللغة العربية فقط.

// ملاحظات:
// - هذا الملف يوفّر دوال وهمية (Mock) للتعامل مع التقييمات بحيث يسهل لاحقاً استبدالها باستدعاءات API حقيقية.
// - تم استخدام Promise و setTimeout لمحاكاة التزامن.

// بيانات وهمية للتقييمات (يمكن استبدالها لاحقاً ببيانات من السيرفر)
let MOCK_RATINGS = [
  {
    id: "r1",
    patientId: "p1",
    patientName: "محمد أحمد",
    clinicId: "c1",
    clinicName: "عيادة الصحة - رام الله",
    appRating: 5,
    clinicRating: 4,
    comment: "تجربة ممتازة والتطبيق سهل الاستخدام",
    createdAt: "2025-07-01T09:30:00Z",
  },
  {
    id: "r2",
    patientId: "p2",
    patientName: "سارة علي",
    clinicId: "c2",
    clinicName: "عيادة الصحة - نابلس",
    appRating: 4,
    clinicRating: 5,
    comment: "خدمة العيادة رائعة والانتظار قليل",
    createdAt: "2025-07-05T12:10:00Z",
  },
  {
    id: "r3",
    patientId: "p3",
    patientName: "محمود يوسف",
    clinicId: "c1",
    clinicName: "عيادة الصحة - رام الله",
    appRating: 3,
    clinicRating: 4,
    comment: "جيد إجمالاً لكن يمكن تحسين سرعة التطبيق",
    createdAt: "2025-07-12T15:45:00Z",
  },
];

// قائمة عيادات وهمية للمساعدة في الفلترة
export const MOCK_CLINICS = [
  { id: "c1", name: "عيادة الصحة - رام الله" },
  { id: "c2", name: "عيادة الصحة - نابلس" },
  { id: "c3", name: "عيادة الصحة - الخليل" },
];

// دالة مساعدة لحساب المتوسط الآمن
const safeAverage = (arr) => {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
  return Math.round((sum / arr.length) * 10) / 10;
};

// إرجاع تجميعي لمتوسط تقييم التطبيق والعيادات
export const getAggregates = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appAvg = safeAverage(MOCK_RATINGS.map((r) => r.appRating));
      const clinicAvg = safeAverage(MOCK_RATINGS.map((r) => r.clinicRating));
      resolve({
        appAverage: appAvg,
        clinicAverage: clinicAvg,
        count: MOCK_RATINGS.length,
      });
    }, 300);
  });
};

// إرجاع أحدث التقييمات (عام)
export const getPublicRatings = ({ limit = 20 } = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...MOCK_RATINGS].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      resolve(sorted.slice(0, limit));
    }, 300);
  });
};

// إرجاع جميع التقييمات (لحساب الصحة)
export const getAllRatings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...MOCK_RATINGS].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      resolve(sorted);
    }, 300);
  });
};

// إرجاع أحدث تقييم للمريض للمساعدة في القيود الزمنية
export const getLatestPatientRating = (patientId) => {
  if (!patientId) return null;
  const items = [...MOCK_RATINGS]
    .filter((r) => r.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return items[0] || null;
};

// التحقق إن كان المريض يستطيع التقييم خلال هذا الشهر
export const canSubmitRatingThisMonth = (patientId) => {
  // القاعدة: مسموح تقييم واحد كل 30 يوم تقريباً
  const latest = getLatestPatientRating(patientId);
  if (!latest) return { allowed: true };
  const last = new Date(latest.createdAt).getTime();
  const now = Date.now();
  const days = (now - last) / (1000 * 60 * 60 * 24);
  if (days >= 30) return { allowed: true };
  const nextEligible = new Date(last + 30 * 24 * 60 * 60 * 1000);
  return { allowed: false, nextEligible };
};

// تحديد عيادة المريض الحالية (لاحقاً تُجلب من السيرفر بعد تسجيل الدخول)
export const getCurrentPatientClinicId = () => {
  // يمكن لاحقاً قراءة العيادة من سياق المستخدم/التوكن
  return "c1";
};

// إرسال تقييم جديد وحفظه في الذاكرة مؤقتاً
export const submitRating = ({
  patientId,
  patientName,
  clinicId,
  clinicName,
  appRating,
  clinicRating,
  comment,
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = {
        id: `r${Date.now()}`,
        patientId: patientId || "unknown",
        patientName: patientName || "مستخدم",
        clinicId: clinicId || "c1",
        clinicName: clinicName || "عيادة الصحة - رام الله",
        appRating: Number(appRating) || 0,
        clinicRating: Number(clinicRating) || 0,
        comment: comment || "",
        createdAt: new Date().toISOString(),
      };
      MOCK_RATINGS = [newItem, ...MOCK_RATINGS];
      resolve(newItem);
    }, 400);
  });
};

// فلترة التقييمات بحسب العيادة والمدى الزمني
export const filterRatings = ({ clinicId, startDate, endDate } = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...MOCK_RATINGS];
      if (clinicId && clinicId !== "all") {
        data = data.filter((r) => r.clinicId === clinicId);
      }
      if (startDate) {
        const s = new Date(startDate).getTime();
        data = data.filter((r) => new Date(r.createdAt).getTime() >= s);
      }
      if (endDate) {
        const e = new Date(endDate).getTime();
        data = data.filter((r) => new Date(r.createdAt).getTime() <= e);
      }
      const appAverage = safeAverage(data.map((r) => r.appRating));
      const clinicAverage = safeAverage(data.map((r) => r.clinicRating));
      resolve({ items: data, appAverage, clinicAverage, count: data.length });
    }, 300);
  });
};

// ملاحظات الربط مع الـ API لاحقاً:
// - يمكن إنشاء Axios instance وتمريره هنا واستخدامه عوضاً عن البيانات الوهمية.
// - يُفضّل تجزئة الخدمات (auth/patients/ratings) ضمن مجلد services.
