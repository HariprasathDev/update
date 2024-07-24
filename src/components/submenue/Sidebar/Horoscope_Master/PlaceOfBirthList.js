import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import '../../../css/app.css';
import feather from 'feather-icons';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import BreadCrumbs from '../../../Breadcrumbs';

const PlaceOfBirthList = () => {
    const [placesOfBirth, setPlacesOfBirth] = useState([]);
    const [newPlaceOfBirth, setNewPlaceOfBirth] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortOrder, setSortOrder] = useState('asc');
    const [editPlaceId, setEditPlaceId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [placeToDelete, setPlaceToDelete] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    
    useEffect(() => {
        fetchPlacesOfBirth();
        const interval = setInterval(() => {
            fetchPlacesOfBirth();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [placesOfBirth, showPopup, deleteConfirmation]);

    const fetchPlacesOfBirth = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/place-of-births/');
        setPlacesOfBirth(response.data);
    };

    const addOrUpdatePlaceOfBirth = async () => {
        const placeData = { place: newPlaceOfBirth };
        if (editPlaceId) {
            await axios.put(`http://localhost:8000/api/accounts/place-of-births/${editPlaceId}/`, placeData);
        } else {
            await axios.post('http://localhost:8000/api/accounts/place-of-births/', placeData);
        }
        setNewPlaceOfBirth('');
        setShowPopup(false);
        setEditPlaceId(null);
        fetchPlacesOfBirth();
        setShowSuccessPopup(true);
        setShowSuccessPopup(true); // Show success popup
    };

    const handleEditPlace = (place) => {
        setEditPlaceId(place.id);
        setNewPlaceOfBirth(place.place);
        setShowPopup(true);
    };

    const handleDeletePlace = (id) => {
        setPlaceToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeletePlace = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/place-of-births/${placeToDelete}/`);
        setPlaceToDelete(null);
        setDeleteConfirmation(false);
        fetchPlacesOfBirth();
    };

    const cancelDeletePlace = () => {
        setPlaceToDelete(null);
        setDeleteConfirmation(false);
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setNewPlaceOfBirth('');
        setEditPlaceId(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const filteredPlacesOfBirth = placesOfBirth.filter(placeOfBirth =>
        placeOfBirth.place.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedPlacesOfBirth = [...filteredPlacesOfBirth].sort((a, b) => {
        if (a.place < b.place) return sortOrder === 'asc' ? -1 : 1;
        if (a.place > b.place) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPlacesOfBirth = sortedPlacesOfBirth.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredPlacesOfBirth.length / itemsPerPage);
    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'Horoscope Master' },
        { name: 'place of birth ', }
    ];
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };
    return (
        <div>
            <div className="state-select">
                <Sidebar />
                <div className="main-content">
                    <Navbar className="component" />
                    <BreadCrumbs paths={breadcrumbPaths} />
                    <div className="header-buttons">
                        <div className="left-corner">
                            <select className='marital-select' onChange={handleItemsPerPageChange} value={itemsPerPage}>
                                <option value={10}>20</option>
                                <option value={20}>40</option>
                                <option value={30}>80</option>
                                <option value={50}>100</option>
                            </select>
                        </div>
                        <div className="right-corner">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search place of birth"
                            />
                            <button onClick={handlePopupOpen}><i data-feather="plus-square"></i></button>
                        </div>
                    </div>
                    <Popup isOpen={showPopup} onClose={handlePopupClose} title={editPlaceId ? 'Edit Place of Birth' : 'Add Place of Birth'}>
                        <label>Place Of Birth:</label>
                        <input
                            type="text"
                            value={newPlaceOfBirth}
                            onChange={(e) => setNewPlaceOfBirth(e.target.value)}
                            placeholder="Place of Birth"
                        />
                        <button
                            className="blue-button"
                            onClick={addOrUpdatePlaceOfBirth}
                            disabled={!newPlaceOfBirth.trim()} // Disable if the input is empty
                        >
                            {editPlaceId ? 'Update' : 'Submit'}
                        </button>
                    </Popup>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Place of Birth {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPlacesOfBirth.map(placeOfBirth => (
                                <tr key={placeOfBirth.id}>
                                    <td>{placeOfBirth.place}</td>
                                    <td>
                                        <button onClick={() => handleEditPlace(placeOfBirth)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeletePlace(placeOfBirth.id)}>
                                            <i className='trash-icon' data-feather="trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            shape="rounded"
                        />
                    </Stack>
                    {deleteConfirmation && (
                        <Popup isOpen={deleteConfirmation} onClose={cancelDeletePlace} title="Confirmation">
                            <p>Are you sure you want to delete this place of birth?</p>
                            <button className="blue-button" onClick={confirmDeletePlace}>Yes</button>
                            <button className="blue-button" onClick={cancelDeletePlace}>No</button>
                        </Popup>
                    )}
                    {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editPlaceId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
                </div>
            </div>
        </div>
    );
};

export default PlaceOfBirthList;
