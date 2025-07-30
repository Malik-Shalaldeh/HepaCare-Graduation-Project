import React, { createContext, useContext, useState } from 'react';

const VisitDataContext = createContext();

export const VisitDataProvider = ({ children }) => {
  const [visitData, setVisitData] = useState({});

  const addVisit = (patientId, visit) => {
    setVisitData(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), visit]
    }));
  };

  const getVisitsForPatient = (patientId) => {
    return visitData[patientId] || [];
  };

  return (
    <VisitDataContext.Provider value={{ visitData, addVisit, getVisitsForPatient }}>
      {children}
    </VisitDataContext.Provider>
  );
};

export const useVisitData = () => {
  const context = useContext(VisitDataContext);
  if (!context) {
    throw new Error('useVisitData must be used within a VisitDataProvider');
  }
  return context;
};
