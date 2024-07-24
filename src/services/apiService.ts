import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getLoginDetails = async () => {
    const response = await axios.get(`${API_URL}/logindetails/`);
    return response.data;
};

export const getLoginDetailById = async (id: number) => {
    const response = await axios.get(`${API_URL}/logindetails/${id}/`);
    return response.data;
};

export const updateLoginDetail = async (id: number, data: any) => {
    const response = await axios.put(`${API_URL}/logindetails/${id}/`, data);
    return response.data;
};

export const deleteLoginDetail = async (id: number) => {
    await axios.delete(`${API_URL}/logindetails/${id}/`);
};
