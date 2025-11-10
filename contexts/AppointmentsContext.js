import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENDPOINTS from '../samiendpoint';

export const AppointmentsContext = createContext({
  loading: false,
  error: '',
  doctorId: null,
  appointments: [],
  patientOptions: [],
  refresh: async () => {},
  saveAppointment: async () => {},
  deleteAppointment: async () => {},
});

const formatAppointment = (row, lookup) => {
  const patientId = row.patient_id;
  const patientName = lookup[patientId] || `مريض رقم ${patientId}`;
  const rawStart = row.start_at || '';
  const start = rawStart ? new Date(rawStart.replace(' ', 'T')) : new Date();

  return {
    id: row.id,
    patientId,
    patientName,
    startAt: rawStart,
    dateText: start.toLocaleDateString(),
    timeText: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: row.notes || '',
  };
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'حدث خطأ غير متوقع');
  }
  return response.json();
};

export const AppointmentsProvider = ({ children }) => {
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [patientLookup, setPatientLookup] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDoctorId = async () => {
      try {
        setLoading(true);
        const stored = await AsyncStorage.getItem('doctor_id');
        if (!stored) {
          throw new Error('لا يوجد رقم طبيب محفوظ');
        }
        setDoctorId(stored);
      } catch (err) {
        setError(err.message || 'تعذر قراءة بيانات الطبيب');
      } finally {
        setLoading(false);
      }
    };
    loadDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId) {
      refresh();
    }
  }, [doctorId]);

  const loadPatients = async (id) => {
    const data = await fetchJson(`${ENDPOINTS.patientsList}?doctor_id=${id}`);
    const options = data.map((patient) => ({
      label: patient.name ?? patient.full_name ?? `مريض رقم ${patient.id}`,
      value: patient.id,
    }));
    const lookup = {};
    options.forEach((item) => {
      lookup[item.value] = item.label;
    });
    setPatientOptions(options);
    setPatientLookup(lookup);
    return lookup;
  };

  const loadAppointments = async (id, lookup) => {
    const data = await fetchJson(ENDPOINTS.doctorAppointments(id));
    const rows = Array.isArray(data) ? data : data.appointments || [];
    const formatted = rows.map((row) => formatAppointment(row, lookup));
    setAppointments(formatted);
  };

  const refresh = async () => {
    if (!doctorId) {
      return;
    }
    try {
      setLoading(true);
      setError('');
      const lookup = await loadPatients(doctorId);
      await loadAppointments(doctorId, lookup);
    } catch (err) {
      setError(err.message || 'تعذر تحميل المواعيد');
    } finally {
      setLoading(false);
    }
  };

  const saveAppointment = async ({ id, patientId, startAt, notes }) => {
    if (!doctorId) {
      throw new Error('لا يوجد رقم طبيب');
    }

    const payload = {
      patient_id: patientId,
      doctor_id: Number(doctorId),
      start_at: startAt,
      notes: notes || '',
    };

    const url = id ? ENDPOINTS.doctorAppointmentUpdate(id) : ENDPOINTS.doctorAppointmentCreate;
    const method = id ? 'PUT' : 'POST';

    await fetchJson(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    await refresh();
  };

  const deleteAppointment = async (appointmentId) => {
    await fetchJson(ENDPOINTS.doctorAppointmentDelete(appointmentId), { method: 'DELETE' });
    await refresh();
  };

  const value = {
    loading,
    error,
    doctorId,
    appointments,
    patientOptions,
    refresh,
    saveAppointment,
    deleteAppointment,
  };

  return (
    <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
  );
};
