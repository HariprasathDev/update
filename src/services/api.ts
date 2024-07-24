import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your actual API URL

export const getRecords = () => axios.get(`${API_URL}/logindetails_temp/`);
export const addRecord = (data: any) => axios.post(`${API_URL}/logindetails_temp/`, data);
export const updateRecord = (id: string, data: any) => axios.put(`${API_URL}/logindetails_temp/${id}/`, data);
export const deleteRecord = (id: string) => axios.delete(`${API_URL}/logindetails_temp/${id}/`);
export const approveRecord = (id: string) => axios.post(`${API_URL}/approve/${id}/`);
export const disapproveRecord = (id: string) => axios.post(`${API_URL}/disapprove/${id}/`);

export const getCountries = async () => {
    return await axios.get(`${API_URL}/countries`);
};

export const addCountry = async (country: any) => {
    return await axios.post(`${API_URL}/countries`, country);
};

export const updateCountry = async (id: string, country: any) => {
    return await axios.put(`${API_URL}/countries/${id}`, country);
};

export const deleteCountry = async (id: string) => {
    return await axios.delete(`${API_URL}/countries/${id}`);
};
// State API
export const getStates = async (countryId: string) => {
    return await axios.get(`${API_URL}/countries/${countryId}/states`);
};

export const addState = async (countryId: string, state: any) => {
    return await axios.post(`${API_URL}/countries/${countryId}/states`, state);
};

export const updateState = async (countryId: string, stateId: string, state: any) => {
    return await axios.put(`${API_URL}/countries/${countryId}/states/${stateId}`, state);
};

export const deleteState = async (countryId: string, stateId: string) => {
    return await axios.delete(`${API_URL}/countries/${countryId}/states/${stateId}`);
};

// District API
export const getDistricts = async (countryId: string, stateId: string) => {
    return await axios.get(`${API_URL}/countries/${countryId}/states/${stateId}/districts`);
};

export const addDistrict = async (countryId: string, stateId: string, district: any) => {
    return await axios.post(`${API_URL}/countries/${countryId}/states/${stateId}/districts`, district);
};

export const updateDistrict = async (countryId: string, stateId: string, districtId: string, district: any) => {
    return await axios.put(`${API_URL}/countries/${countryId}/states/${stateId}/districts/${districtId}`, district);
};

export const deleteDistrict = async (countryId: string, stateId: string, districtId: string) => {
    return await axios.delete(`${API_URL}/countries/${countryId}/states/${stateId}/districts/${districtId}`);
};



// Religions API
export const getreligions = async () => {
    return await axios.get(`${API_URL}/religions`);
};

export const addreligions = async (religions: any) => {
    return await axios.post(`${API_URL}/religions`, religions);
};

export const updatereligions = async (id: string, religions: any) => {
    return await axios.put(`${API_URL}/religions/${id}`, religions);
};

export const deletereligions = async (id: string) => {
    return await axios.delete(`${API_URL}/religions/${id}`);
};

export const getCastes = async () => {
    return await axios.get(`${API_URL}/castes`);
};

export const addCaste = async (caste: any) => {
    return await axios.post(`${API_URL}/castes`, caste);
};

export const updateCaste = async (id: string, caste: any) => {
    return await axios.put(`${API_URL}/castes/${id}`, caste);
};

export const deleteCaste = async (id: string) => {
    return await axios.delete(`${API_URL}/castes/${id}`);
};


// Profile Holders API
export const getProfileHolders = async () => {
    return await axios.get(`${API_URL}/profile-holders`);
};

export const addProfileHolder = async (profileHolder: any) => {
    return await axios.post(`${API_URL}/profile-holders`, profileHolder);
};

export const updateProfileHolder = async (id: string, profileHolder: any) => {
    return await axios.put(`${API_URL}/profile-holders/${id}`, profileHolder);
};

export const deleteProfileHolder = async (id: string) => {
    return await axios.delete(`${API_URL}/profile-holders/${id}`);
};



// Parents Occupations API
export const getParentsOccupations = async () => {
    return await axios.get(`${API_URL}/parents-occupations`);
};

export const addParentsOccupation = async (parentsOccupation: any) => {
    return await axios.post(`${API_URL}/parents-occupations`, parentsOccupation);
};

export const updateParentsOccupation = async (id: string, parentsOccupation: any) => {
    return await axios.put(`${API_URL}/parents-occupations/${id}`, parentsOccupation);
};

export const deleteParentsOccupation = async (id: string) => {
    return await axios.delete(`${API_URL}/parents-occupations/${id}`);
};

// Highest Educations API
export const getHighestEducations = async () => {
    return await axios.get(`${API_URL}/highest-educations`);
};

export const addHighestEducation = async (highestEducation: any) => {
    return await axios.post(`${API_URL}/highest-educations`, highestEducation);
};

export const updateHighestEducation = async (id: string, highestEducation: any) => {
    return await axios.put(`${API_URL}/highest-educations/${id}`, highestEducation);
};

export const deleteHighestEducation = async (id: string) => {
    return await axios.delete(`${API_URL}/highest-educations/${id}`);
};

// UG Degrees API
export const getUgDegrees = async () => {
    return await axios.get(`${API_URL}/ug-degrees`);
};

export const addUgDegree = async (ugDegree: any) => {
    return await axios.post(`${API_URL}/ug-degrees`, ugDegree);
};

export const updateUgDegree = async (id: string, ugDegree: any) => {
    return await axios.put(`${API_URL}/ug-degrees/${id}`, ugDegree);
};

export const deleteUgDegree = async (id: string) => {
    return await axios.delete(`${API_URL}/ug-degrees/${id}`);
};

// Annual Incomes API
export const getAnnualIncomes = async () => {
    return await axios.get(`${API_URL}/annual-incomes`);
};

export const addAnnualIncome = async (annualIncome: any) => {
    return await axios.post(`${API_URL}/annual-incomes`, annualIncome);
};

export const updateAnnualIncome = async (id: string, annualIncome: any) => {
    return await axios.put(`${API_URL}/annual-incomes/${id}`, annualIncome);
};

export const deleteAnnualIncome = async (id: string) => {
    return await axios.delete(`${API_URL}/annual-incomes/${id}`);
};

// Place of Births API
export const getPlaceOfBirths = async () => {
    return await axios.get(`${API_URL}/place-of-births`);
};

export const addPlaceOfBirth = async (placeOfBirth: any) => {
    return await axios.post(`${API_URL}/place-of-births`, placeOfBirth);
};

export const updatePlaceOfBirth = async (id: string, placeOfBirth: any) => {
    return await axios.put(`${API_URL}/place-of-births/${id}`, placeOfBirth);
};

export const deletePlaceOfBirth = async (id: string) => {
    return await axios.delete(`${API_URL}/place-of-births/${id}`);
};

// Birth Stars API
export const getBirthStars = async () => {
    return await axios.get(`${API_URL}/birth-stars`);
};

export const addBirthStar = async (birthStar: any) => {
    return await axios.post(`${API_URL}/birth-stars`, birthStar);
};

export const updateBirthStar = async (id: string, birthStar: any) => {
    return await axios.put(`${API_URL}/birth-stars/${id}`, birthStar);
};

export const deleteBirthStar = async (id: string) => {
    return await axios.delete(`${API_URL}/birth-stars/${id}`);
};

// Rasis API
export const getRasis = async () => {
    return await axios.get(`${API_URL}/rasis`);
};

export const addRasi = async (rasi: any) => {
    return await axios.post(`${API_URL}/rasis`, rasi);
};

export const updateRasi = async (id: string, rasi: any) => {
    return await axios.put(`${API_URL}/rasis/${id}`, rasi);
};

export const deleteRasi = async (id: string) => {
    return await axios.delete(`${API_URL}/rasis/${id}`);
};

// Lagnams API
export const getLagnams = async () => {
    return await axios.get(`${API_URL}/lagnams`);
};

export const addLagnam = async (lagnam: any) => {
    return await axios.post(`${API_URL}/lagnams`, lagnam);
};

export const updateLagnam = async (id: string, lagnam: any) => {
    return await axios.put(`${API_URL}/lagnams/${id}`, lagnam);
};

export const deleteLagnam = async (id: string) => {
    return await axios.delete(`${API_URL}/lagnams/${id}`);
};

// Dasa Balances API
export const getDasaBalances = async () => {
    return await axios.get(`${API_URL}/dasa-balances`);
};

export const addDasaBalance = async (dasaBalance: any) => {
    return await axios.post(`${API_URL}/dasa-balances`, dasaBalance);
};

export const updateDasaBalance = async (id: string, dasaBalance: any) => {
    return await axios.put(`${API_URL}/dasa-balances/${id}`, dasaBalance);
};

export const deleteDasaBalance = async (id: string) => {
    return await axios.delete(`${API_URL}/dasa-balances/${id}`);
};


//familytypes
// Fetch all family types
export const getFamilyTypes = async () => {
    return await axios.get(`${API_URL}/family-types`);
};

// Add a new family type
export const addFamilyType = async (familyType: any) => {
    return await axios.post(`${API_URL}/family-types`, familyType);
};

// Update an existing family type
export const updateFamilyType = async (id: string, familyType: any) => {
    return await axios.put(`${API_URL}/family-types/${id}`, familyType);
};

// Delete a family type by ID
export const deleteFamilyType = async (id: string) => {
    return await axios.delete(`${API_URL}/family-types/${id}`);
};

 //familystatus 
// Fetch all family statuses
export const getFamilyStatuses = async () => {
    return await axios.get(`${API_URL}/family-statuses`);
};

// Add a new family status
export const addFamilyStatus = async (familyStatus: any) => {
    return await axios.post(`${API_URL}/family-statuses`, familyStatus);
};

// Update an existing family status
export const updateFamilyStatus = async (id: string, familyStatus: any) => {
    return await axios.put(`${API_URL}/family-statuses/${id}`, familyStatus);
};

// Delete a family status by ID
export const deleteFamilyStatus = async (id: string) => {
    return await axios.delete(`${API_URL}/family-statuses/${id}`);
};


export const apiService = {
    getBirthStars: () => axios.get(`${API_URL}/birth-stars/`),
    getPlaceOfBirths: () => axios.get(`${API_URL}/place-of-births/`),
    getRasis: () => axios.get(`${API_URL}/rasis/`),
    getLagnams: () => axios.get(`${API_URL}/lagnams/`),
    getDasaBalances: () => axios.get(`${API_URL}/dasa-balances/`),
  
    getBirthStar: (id: number) => axios.get(`${API_URL}/birth-stars/${id}/`),
    getPlaceOfBirth: (id: number) => axios.get(`${API_URL}/place-of-births/${id}/`),
    getRasi: (id: string) => axios.get(`${API_URL}/rasis/${id}/`),
    getLagnam: (id: number) => axios.get(`${API_URL}/lagnams/${id}/`),
    getDasaBalance: (id: number) => axios.get(`${API_URL}/dasa-balances/${id}/`),
  
    createBirthStar: (data: any) => axios.post(`${API_URL}/birth-stars/`, data),
    createPlaceOfBirth: (data: any) => axios.post(`${API_URL}/place-of-births/`, data),
    createRasi: (data: any) => axios.post(`${API_URL}/rasis/`, data),
    createLagnam: (data: any) => axios.post(`${API_URL}/lagnams/`, data),
    createDasaBalance: (data: any) => axios.post(`${API_URL}/dasa-balances/`, data),
  
    updateBirthStar: (id: number, data: any) => axios.put(`${API_URL}/birth-stars/${id}/`, data),
    updatePlaceOfBirth: (id: number, data: any) => axios.put(`${API_URL}/place-of-births/${id}/`, data),
    updateRasi: (id: string, data: any) => axios.put(`${API_URL}/rasis/${id}/`, data),
    updateLagnam: (id: number, data: any) => axios.put(`${API_URL}/lagnams/${id}/`, data),
    updateDasaBalance: (id: number, data: any) => axios.put(`${API_URL}/dasa-balances/${id}/`, data),
  
    deleteBirthStar: (id: number) => axios.delete(`${API_URL}/birth-stars/${id}/`),
    deletePlaceOfBirth: (id: number) => axios.delete(`${API_URL}/place-of-births/${id}/`),
    deleteRasi: (id: string) => axios.delete(`${API_URL}/rasis/${id}/`),
    deleteLagnam: (id: number) => axios.delete(`${API_URL}/lagnams/${id}/`),
    deleteDasaBalance: (id: number) => axios.delete(`${API_URL}/dasa-balances/${id}/`)
};



