// Developed by Sami
import React, { createContext, useState, useCallback } from 'react';

/*
  AppointmentsContext
  يوفر تخزيناً مؤقتاً (داخل الجلسة) للمواعيد حتى يتم ربط التطبيق بقاعدة بيانات/Backend.
  يمكن استبدال الدوال addOrUpdate و remove لاحقاً باستدعاءات API دون الحاجة لتعديل الشاشات.
*/
export const AppointmentsContext = createContext({
  appointments: [],
  addOrUpdate: () => {},
  remove: () => {},
});

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  const addOrUpdate = useCallback((appt) => {
    setAppointments((prev) => {
      const idx = prev.findIndex((a) => a.id === appt.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = appt;
        return updated;
      }
      return [...prev, appt];
    });
  }, []);

  const remove = useCallback((id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AppointmentsContext.Provider value={{ appointments, addOrUpdate, remove }}>
      {children}
    </AppointmentsContext.Provider>
  );
};
