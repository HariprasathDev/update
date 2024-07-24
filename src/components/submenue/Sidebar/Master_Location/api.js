import axios from 'axios';

const API_URL = 'http://localhost:8000/api/accounts';

// const API_URL = 'http://localhost:8000/api/';

export const getCountries = () => axios.get(`${API_URL}/countries/`);
export const addCountry = (country) => axios.post(`${API_URL}/countries/`, country);
export const updateCountry = (id, country) => axios.put(`${API_URL}/countries/${id}/`, country);
export const deleteCountry = (id) => axios.delete(`${API_URL}/countries/${id}/`);

export const getStates = () => axios.get(`${API_URL}/states/`);
export const addState = (state) => axios.post(`${API_URL}/states/`, state);
export const updateState = (id, state) => axios.put(`${API_URL}/states/${id}/`, state);
export const deleteState = (id) => axios.delete(`${API_URL}/states/${id}/`);

export const getDistricts = () => axios.get(`${API_URL}/districts/`);
export const addDistrict = (district) => axios.post(`${API_URL}/districts/`, district);
export const updateDistrict = (id, district) => axios.put(`${API_URL}/districts/${id}/`, district);
export const deleteDistrict = (id) => axios.delete(`${API_URL}/districts/${id}/`);




export const getReligions = () => axios.get(`${API_URL}/religions/`);
export const addReligion = (religion) => axios.post(`${API_URL}/religions/`, religion);
export const updateReligion = (id, religion) => axios.put(`${API_URL}/religions/${id}/`, religion);
export const deleteReligion = (id) => axios.delete(`${API_URL}/religions/${id}/`);

export const getCastes = () => axios.get(`${API_URL}/castes/`);
export const addCaste = (caste) => axios.post(`${API_URL}/castes/`, caste);
export const updateCaste = (id, caste) => axios.put(`${API_URL}/castes/${id}/`, caste);
export const deleteCaste = (id) => axios.delete(`${API_URL}/castes/${id}/`);



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
