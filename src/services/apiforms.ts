// api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createLoginDetails = (data: any) => {
  return api.post('/logindetails/', data);
};

export const createProfileEduDetails = (data: any) => {
  return api.post('/profile-edu-details/', data);
};

export const createProfileFamilyDetails = (data: any) => {
  return api.post('/profile-family-details/', data);
};
