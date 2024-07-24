

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/accounts';







export const getPlaceOfBirths = () => axios.get(`${API_URL}/place-of-births/`);
export const addPlaceOfBirth = (placeOfBirth) => axios.post(`${API_URL}/place-of-births/`, placeOfBirth);
export const updatePlaceOfBirth = (id, placeOfBirth) => axios.put(`${API_URL}/place-of-births/${id}/`, placeOfBirth);
export const deletePlaceOfBirth = (id) => axios.delete(`${API_URL}/place-of-births/${id}/`);

export const getBirthStars = () => axios.get(`${API_URL}/birth-stars/`);
export const addBirthStar = (birthStar) => axios.post(`${API_URL}/birth-stars/`, birthStar);
export const updateBirthStar = (id, birthStar) => axios.put(`${API_URL}/birth-stars/${id}/`, birthStar);
export const deleteBirthStar = (id) => axios.delete(`${API_URL}/birth-stars/${id}/`);

export const getRasis = () => axios.get(`${API_URL}/rasis/`);
export const addRasi = (rasi) => axios.post(`${API_URL}/rasis/`, rasi);
export const updateRasi = (id, rasi) => axios.put(`${API_URL}/rasis/${id}/`, rasi);
export const deleteRasi = (id) => axios.delete(`${API_URL}/rasis/${id}/`);

export const getLagnams = () => axios.get(`${API_URL}/lagnams/`);
export const addLagnam = (lagnam) => axios.post(`${API_URL}/lagnams/`, lagnam);
export const updateLagnam = (id, lagnam) => axios.put(`${API_URL}/lagnams/${id}/`, lagnam);
export const deleteLagnam = (id) => axios.delete(`${API_URL}/lagnams/${id}/`);

export const getDasaBalances = () => axios.get(`${API_URL}/dasa-balances/`);
export const addDasaBalance = (dasaBalance) => axios.post(`${API_URL}/dasa-balances/`, dasaBalance);
export const updateDasaBalance = (id, dasaBalance) => axios.put(`${API_URL}/dasa-balances/${id}/`, dasaBalance);
export const deleteDasaBalance = (id) => axios.delete(`${API_URL}/dasa-balances/${id}/`);
