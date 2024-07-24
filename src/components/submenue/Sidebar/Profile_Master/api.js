


import axios from 'axios';

const API_URL = 'http://localhost:8000/api/accounts';













export const getProfileHolders = () => axios.get(`${API_URL}/profile-holders/`);
export const addProfileHolder = (profileHolder) => axios.post(`${API_URL}/profile-holders/`, profileHolder);
export const updateProfileHolder = (id, profileHolder) => axios.put(`${API_URL}/profile-holders/${id}/`, profileHolder);
export const deleteProfileHolder = (id) => axios.delete(`${API_URL}/profile-holders/${id}/`);

export const getMaritalStatuses = () => axios.get(`${API_URL}/marital-statuses/`);
export const addMaritalStatus = (maritalStatus) => axios.post(`${API_URL}/marital-statuses/`, maritalStatus);
export const updateMaritalStatus = (id, maritalStatus) => axios.put(`${API_URL}/marital-statuses/${id}/`, maritalStatus);
export const deleteMaritalStatus = (id) => axios.delete(`${API_URL}/marital-statuses/${id}/`);

export const getHeights = () => axios.get(`${API_URL}/heights/`);
export const addHeight = (height) => axios.post(`${API_URL}/heights/`, height);
export const updateHeight = (id, height) => axios.put(`${API_URL}/heights/${id}/`, height);
export const deleteHeight = (id) => axios.delete(`${API_URL}/heights/${id}/`);

export const getComplexions = () => axios.get(`${API_URL}/complexions/`);
export const addComplexion = (complexion) => axios.post(`${API_URL}/complexions/`, complexion);
export const updateComplexion = (id, complexion) => axios.put(`${API_URL}/complexions/${id}/`, complexion);
export const deleteComplexion = (id) => axios.delete(`${API_URL}/complexions/${id}/`);

export const getParentsOccupations = () => axios.get(`${API_URL}/parents-occupations/`);
export const addParentsOccupation = (parentsOccupation) => axios.post(`${API_URL}/parents-occupations/`, parentsOccupation);
export const updateParentsOccupation = (id, parentsOccupation) => axios.put(`${API_URL}/parents-occupations/${id}/`, parentsOccupation);
export const deleteParentsOccupation = (id) => axios.delete(`${API_URL}/parents-occupations/${id}/`);

export const getHighestEducations = () => axios.get(`${API_URL}/highest-educations/`);
export const addHighestEducation = (highestEducation) => axios.post(`${API_URL}/highest-educations/`, highestEducation);
export const updateHighestEducation = (id, highestEducation) => axios.put(`${API_URL}/highest-educations/${id}/`, highestEducation);
export const deleteHighestEducation = (id) => axios.delete(`${API_URL}/highest-educations/${id}/`);

export const getUgDegrees = () => axios.get(`${API_URL}/ug-degrees/`);
export const addUgDegree = (ugDegree) => axios.post(`${API_URL}/ug-degrees/`, ugDegree);
export const updateUgDegree = (id, ugDegree) => axios.put(`${API_URL}/ug-degrees/${id}/`, ugDegree);
export const deleteUgDegree = (id) => axios.delete(`${API_URL}/ug-degrees/${id}/`);

export const getAnnualIncomes = () => axios.get(`${API_URL}/annual-incomes/`);
export const addAnnualIncome = (annualIncome) => axios.post(`${API_URL}/annual-incomes/`, annualIncome);
export const updateAnnualIncome = (id, annualIncome) => axios.put(`${API_URL}/annual-incomes/${id}/`, annualIncome);
export const deleteAnnualIncome = (id) => axios.delete(`${API_URL}/annual-incomes/${id}/`);
