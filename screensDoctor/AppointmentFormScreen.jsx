//sami
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import ScreenWithDrawer from './ScreenWithDrawer';
import { AppointmentsContext } from '../contexts/AppointmentsContext';

const primary = '#00b29c';

const formatDate = (value) => value.toLocaleDateString();
const formatTime = (value) => value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const toSqlDateTime = (value) => value.toISOString().slice(0, 19).replace('T', ' ');

const AppointmentFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { saveAppointment, patientOptions, loading } = useContext(AppointmentsContext);

  const editingAppointment = route.params?.appointment;
  const isEditing = Boolean(editingAppointment);

  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState(editingAppointment?.patientId ?? null);
  const [patientsItems, setPatientsItems] = useState(patientOptions);
  const [notes, setNotes] = useState(editingAppointment?.notes ?? '');
  const [date, setDate] = useState(
    editingAppointment ? new Date(editingAppointment.startAt) : new Date()
  );
  const [time, setTime] = useState(
    editingAppointment ? new Date(editingAppointment.startAt) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const screenTitle = isEditing ? 'تعديل موعد' : 'موعد جديد';

  useEffect(() => {
    setPatientsItems(patientOptions);
  }, [patientOptions]);

  const combineDateAndTime = (dateValue, timeValue) => {
    const combined = new Date(dateValue);
    combined.setHours(timeValue.getHours(), timeValue.getMinutes(), 0, 0);
    return combined;
  };

  const handleSubmit = async () => {
    if (!patient) {
      Alert.alert('تنبيه', 'يرجى اختيار المريض قبل حفظ الموعد');
      return;
    }

    try {
      setSaving(true);
      const startDate = combineDateAndTime(date, time);
      const cleanedNotes = notes.trim();
      const sqlDate = toSqlDateTime(startDate);
      await saveAppointment({
        id: editingAppointment?.id,
        patientId: patient,
        startAt: sqlDate,
        notes: cleanedNotes,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('خطأ', err.message || 'تعذر حفظ الموعد');
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (_, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <ScreenWithDrawer title="" showDrawerIcon={false}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>{screenTitle}</Text>
        {loading && !patientsItems.length ? (
          <ActivityIndicator color={primary} style={{ marginVertical: 12 }} />
        ) : null}
        {!loading && patientsItems.length === 0 ? (
          <Text style={styles.info}>لا يوجد مرضى حاليًا لعرضهم. يرجى إضافة مرضى أولاً.</Text>
        ) : null}
        <Text style={styles.label}>اسم المريض</Text>
        <DropDownPicker
          open={open}
          value={patient}
          items={patientsItems}
          setOpen={setOpen}
          setValue={setPatient}
          setItems={setPatientsItems}
          placeholder="اختر اسم المريض"
          disabled={!patientsItems.length}
          searchable={true}
          searchPlaceholder="ابحث عن مريض"
          zIndex={3000}
          zIndexInverse={1000}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <Text style={styles.label}>التاريخ</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={20} color={primary} />
          <Text style={styles.pickerText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>الوقت</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time" size={20} color={primary} />
          <Text style={styles.pickerText}>{formatTime(time)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>ملاحظات</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="أي ملاحظات إضافية"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity
          style={[styles.saveBtn, { marginTop: 12, backgroundColor: '#00796b' }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={saving || loading}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>{isEditing ? 'حفظ التعديلات' : 'حفظ الموعد'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backText}>العودة إلى القائمة</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerText: {
    marginStart: 8,
    fontSize: 16,
    color: '#333',
  },
  saveBtn: {
    backgroundColor: primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    marginTop:20
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default AppointmentFormScreen;
