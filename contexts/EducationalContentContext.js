import React, { createContext, useState, useCallback } from 'react';

// Developed by Sami
// Provides in-memory storage for educational contents until backend is integrated.
export const EducationalContentContext = createContext({
  items: [],
  addOrUpdate: () => {},
  remove: () => {},
});

export const EducationalContentProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addOrUpdate = useCallback((item) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <EducationalContentContext.Provider value={{ items, addOrUpdate, remove }}>
      {children}
    </EducationalContentContext.Provider>
  );
};
