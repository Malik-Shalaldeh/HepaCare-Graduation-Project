// Centralized definition of all backend REST endpoints
// Add new endpoints here and import this file wherever needed.
// This makes maintaining URL changes easy and avoids hard-coding strings.

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const ENDPOINTS = {
  // Messaging
  sendMessage: `${BASE_URL}/messages`,
  fetchMessages: `${BASE_URL}/messages`,

  // Doctors
  doctors: `${BASE_URL}/doctors`,

  // Patients
  patients: `${BASE_URL}/patients`,

  // Visits
  visits: `${BASE_URL}/visits`,

  // TODO: add more endpoints as you implement new features
};

export default ENDPOINTS;
