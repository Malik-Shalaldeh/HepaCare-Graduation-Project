import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import ScreenWithDrawer from './ScreenWithDrawer';
//sami
const primary = '#00b29c';

const AppointmentFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const editingAppointment = route.params?.appointment;

  const [patient, setPatient] = useState(editingAppointment?.patient || '');
  const [notes, setNotes] = useState(editingAppointment?.notes || '');
  const [date, setDate] = useState(editingAppointment ? new Date(editingAppointment.date) : new Date());
  const [time, setTime] = useState(editingAppointment ? new Date(`${editingAppointment.date} ${editingAppointment.time}`) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const saveAppointment = () => {
    if (!patient.trim()) return;

    const savedAppointment = {
      id: editingAppointment?.id || Date.now(),
      patient: patient.trim(),
      notes: notes.trim(),
      date: date.toLocaleDateString(),
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    navigation.navigate('AppointmentList', { savedAppointment });
  };

  return (
    <ScreenWithDrawer title="موعد جديد">
      <View style={styles.container}>
        <Text style={styles.label}>اسم المريض</Text>
        <TextInput
          style={styles.input}
          placeholder="اكتب اسم المريض"
          value={patient}
          onChangeText={setPatient}
        />

        <Text style={styles.label}>التاريخ</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={20} color={primary} />
          <Text style={styles.pickerText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>الوقت</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time" size={20} color={primary} />
          <Text style={styles.pickerText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>ملاحظات</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="أي ملاحظات إضافية"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveAppointment} activeOpacity={0.8}>
          <Text style={styles.saveText}>{editingAppointment ? 'تعديل الموعد' : 'حفظ الموعد'}</Text>
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
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
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
  backText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentFormScreen;
