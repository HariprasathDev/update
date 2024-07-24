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

const RasiList = () => {
    const [rasis, setRasis] = useState([]);
    const [newRasi, setNewRasi] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [editRasiId, setEditRasiId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [rasiToDelete, setRasiToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        fetchRasis();
        const interval = setInterval(() => {
            fetchRasis();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [rasis, showPopup, deleteConfirmation]);

    const fetchRasis = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/rasis/');
        setRasis(response.data);
    };

    const addOrUpdateRasi = async () => {
        const rasiData = { name: newRasi };
        if (editRasiId) {
            await axios.put(`http://localhost:8000/api/accounts/rasis/${editRasiId}/`, rasiData);
        } else {
            await axios.post('http://localhost:8000/api/accounts/rasis/', rasiData);
        }
        setNewRasi('');
        setShowPopup(false);
        setEditRasiId(null);
        fetchRasis();
        setShowSuccessPopup(true);
    };

    const handleEditRasi = (rasi) => {
        setEditRasiId(rasi.id);
        setNewRasi(rasi.name);
        setShowPopup(true);
    };

    const handleDeleteRasi = (id) => {
        setRasiToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteRasi = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/rasis/${rasiToDelete}/`);
        setRasiToDelete(null);
        setDeleteConfirmation(false);
        fetchRasis();
    };

    const cancelDeleteRasi = () => {
        setRasiToDelete(null);
        setDeleteConfirmation(false);
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setNewRasi('');
        setEditRasiId(null);
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

    const filteredRasis = rasis.filter(rasi =>
        rasi.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedRasis = [...filteredRasis].sort((a, b) => {
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

    const paginatedRasis = sortedRasis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredRasis.length / itemsPerPage);

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
        { name: 'rasi ', }
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
                                placeholder="Search rasi"
                            />
                            <button onClick={handlePopupOpen}><i data-feather="plus-square"></i></button>
                        </div>
                    </div>
                    <Popup isOpen={showPopup} onClose={handlePopupClose} title={editRasiId ? 'Edit Rasi' : 'Add Rasi'}>
                        <label>Rasi:</label>
                        <input
                            type="text"
                            value={newRasi}
                            onChange={(e) => setNewRasi(e.target.value)}
                            placeholder="Rasi Name"
                        />
                        <button
                            className="blue-button"
                            onClick={addOrUpdateRasi}
                            disabled={!newRasi.trim()} // Disable if the input is empty
                        >
                            {editRasiId ? 'Update' : 'Submit'}
                        </button>
                    </Popup>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                    Rasi {sortDirection === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRasis.map(rasi => (
                                <tr key={rasi.id}>
                                    <td>{rasi.name}</td>
                                    <td>
                                        <button onClick={() => handleEditRasi(rasi)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteRasi(rasi.id)}>
                                            <i className='trash-icon' data-feather="trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PaginationRounded count={totalPages} page={currentPage} onChange={handlePageChange} />
                    {deleteConfirmation && (
                        <Popup isOpen={deleteConfirmation} onClose={cancelDeleteRasi} title="Confirmation">
                            <p>Are you sure you want to delete this rasi?</p>
                            <button className="blue-button" onClick={confirmDeleteRasi}>Yes</button>
                            <button className="blue-button" onClick={cancelDeleteRasi}>No</button>
                        </Popup>
                    )}
                    {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editRasiId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
                    
                    
                </div>
            </div>
        </div>
    );
};

export default RasiList;
