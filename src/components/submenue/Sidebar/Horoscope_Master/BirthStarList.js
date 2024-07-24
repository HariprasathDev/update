import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import '../../../css/app.css';
import feather from 'feather-icons';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import BreadCrumbs from '../../../Breadcrumbs';

const PaginationRounded = ({ count, page, onChange }) => {
    return (
        <Stack spacing={2}>
            <Pagination count={count} page={page} onChange={onChange} shape="rounded" />
        </Stack>
    );
};

const BirthStarList = () => {
    const [birthStars, setBirthStars] = useState([]);
    const [newBirthStar, setNewBirthStar] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [sortField, setSortField] = useState('star');
    const [sortDirection, setSortDirection] = useState('asc');
    const [editStarId, setEditStarId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [starToDelete, setStarToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup
    useEffect(() => {
        fetchBirthStars();
        const interval = setInterval(() => {
            fetchBirthStars();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [birthStars, showPopup, deleteConfirmation]);

    const fetchBirthStars = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/birth-stars/');
        setBirthStars(response.data);
    };

    const addOrUpdateBirthStar = async () => {
        const starData = { star: newBirthStar };
        if (editStarId) {
            await axios.put(`http://localhost:8000/api/accounts/birth-stars/${editStarId}/`, starData);
        } else {
            await axios.post('http://localhost:8000/api/accounts/birth-stars/', starData);
        }
        setNewBirthStar('');
        setShowPopup(false);
        setEditStarId(null);
        fetchBirthStars();
        setShowSuccessPopup(true); // Show success popup
    };

    const handleEditStar = (star) => {
        setEditStarId(star.id);
        setNewBirthStar(star.star);
        setShowPopup(true);
    };

    const handleDeleteStar = (id) => {
        setStarToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteStar = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/birth-stars/${starToDelete}/`);
        setStarToDelete(null);
        setDeleteConfirmation(false);
        fetchBirthStars();
    };

    const cancelDeleteStar = () => {
        setStarToDelete(null);
        setDeleteConfirmation(false);
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setNewBirthStar('');
        setEditStarId(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredBirthStars = birthStars.filter(birthStar =>
        birthStar.star.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedBirthStars = [...filteredBirthStars].sort((a, b) => {
        const fieldA = a[sortField].toLowerCase();
        const fieldB = b[sortField].toLowerCase();
        if (fieldA < fieldB) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const paginatedBirthStars = sortedBirthStars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredBirthStars.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'Horoscope Master' },
        { name: 'birth star', }
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
                            <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="right-corner">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search birth star"
                            />
                            <button onClick={handlePopupOpen}><i data-feather="plus-square"></i></button>
                        </div>
                    </div>
                    <Popup isOpen={showPopup} onClose={handlePopupClose} title={editStarId ? 'Edit Birth Star' : 'Add Birth Star'}>
                        <label>Birth Star:</label>
                        <input
                            type="text"
                            value={newBirthStar}
                            onChange={(e) => setNewBirthStar(e.target.value)}
                            placeholder="Birth Star"
                        />
                        <button
                            className="blue-button"
                            onClick={addOrUpdateBirthStar}
                            disabled={!newBirthStar.trim()} // Disable if the input is empty
                        >
                            {editStarId ? 'Update' : 'Submit'}
                        </button>
                    </Popup>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('star')} style={{ cursor: 'pointer' }}>
                                    Birth Star {sortDirection === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBirthStars.map(birthStar => (
                                <tr key={birthStar.id}>
                                    <td>{birthStar.star}</td>
                                    <td>
                                        <button onClick={() => handleEditStar(birthStar)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteStar(birthStar.id)}>
                                            <i className='trash-icon' data-feather="trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PaginationRounded count={totalPages} page={currentPage} onChange={handlePageChange} />
                    {deleteConfirmation && (
                        <Popup isOpen={deleteConfirmation} onClose={cancelDeleteStar} title="Confirmation">
                            <p>Are you sure you want to delete this birth star?</p>
                            <button className="blue-button" onClick={confirmDeleteStar}>Yes</button>
                            <button className="blue-button" onClick={cancelDeleteStar}>No</button>
                        </Popup>
                        
                    )}
                    {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editStarId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
                </div>
            </div>
        </div>
    );
};

export default BirthStarList;
