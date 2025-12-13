//componentAdmin//functionActiveInactive
import { Alert } from 'react-native';
import axios from 'axios';
import ENDPOINTS from '../malikEndPoint';

//  دالة البحث
export const handleSearchFn = async (search, setResults, setLoading) => {
  if (!search.trim()) {
    Alert.alert('تنبيه', 'أدخل اسم الطبيب أو رقمه');
    return;
  }

  try {
    setLoading(true);

    const res = await axios.get(ENDPOINTS.ADMIN.SEARCH_DOCTORS, {
      params: { q: search.trim() },
    });
    setResults(res.data || []);
  } catch {
    setResults([]);
    Alert.alert('خطأ', 'تعذر جلب قائمة الأطباء');
  } finally {
    setLoading(false);
  }
};

//  دالة تعطيل / تفعيل الطبيب

export const handleToggleFn = async (selected, setResults, setSelected, setSearch) => {
  if (!selected) return;

  const action = selected.is_active ? 'تعطيل' : 'تفعيل';

  Alert.alert(
    'تأكيد العملية',
    `هل تريد ${action} ${selected.name} (رقم: ${selected.id})؟`,
    [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: action,
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await axios.put(
              ENDPOINTS.ADMIN.TOGGLE_DOCTOR(selected.id)
            );
            Alert.alert('تم', res.data.message);

            setResults(prev =>
              prev.map(d =>
                d.id === selected.id
                  ? { ...d, is_active: res.data.new_status }
                  : d
              )
            );

            setSelected(null);
            setSearch('');

          } catch(e) {
            const msg = e.response?.data?.detail || 'حدث خطأ';
            Alert.alert('خطأ', msg);
          }
        },
      },
    ]
  );
};


