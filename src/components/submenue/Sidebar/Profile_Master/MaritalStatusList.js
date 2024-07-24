import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BreadCrumbs from '../../../Breadcrumbs';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import '../../../css/app.css'; 
import Popup from '../../../Popup';
import feather from 'feather-icons';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const MaritalStatusList = () => {
    const [maritalStatuses, setMaritalStatuses] = useState([]);
    const [newMaritalStatus, setNewMaritalStatus] = useState('');
    const [editMaritalStatusData, setEditMaritalStatusData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    useEffect(() => {
        fetchMaritalStatuses();
        const intervalId = setInterval(fetchMaritalStatuses, 2000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [maritalStatuses, showAddPopup, showEditPopup, deleteConfirmation, showSuccessPopup]);

    const fetchMaritalStatuses = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/marital-statuses/');
        setMaritalStatuses(response.data);
    };

    const addMaritalStatus = async () => {
        try {
            await axios.post('http://localhost:8000/api/accounts/marital-statuses/', { status: newMaritalStatus });
            setNewMaritalStatus('');
            setShowAddPopup(false);
            setShowSuccessPopup(true); // Show success popup
            fetchMaritalStatuses();
        } catch (error) {
            console.error('Error adding marital status:', error);
        }
    };

    const editMaritalStatus = async () => {
        await axios.put(`http://localhost:8000/api/accounts/marital-statuses/${editMaritalStatusData.id}/`, editMaritalStatusData);
        fetchMaritalStatuses();
        setShowEditPopup(false);
        setShowSuccessPopup(true); // Show success popup
    };

    const deleteMaritalStatus = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/marital-statuses/${statusToDelete}/`);
        setDeleteConfirmation(false);
        setStatusToDelete(null);
        setShowSuccessPopup(true); // Show success popup
        fetchMaritalStatuses();
    };

    const handleEditClick = (maritalStatus) => {
        setEditMaritalStatusData(maritalStatus);
        setShowEditPopup(true);
    };

    const handleCancelEdit = () => {
        setEditMaritalStatusData(null);
        setShowEditPopup(false);
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const filteredMaritalStatuses = maritalStatuses.filter(maritalStatus =>
        maritalStatus.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedMaritalStatuses = filteredMaritalStatuses.sort((a, b) => {
        if (sortField) {
            const fieldA = a[sortField].toLowerCase();
            const fieldB = b[sortField].toLowerCase();
            if (fieldA < fieldB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (fieldA > fieldB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });

    const paginatedMaritalStatuses = sortedMaritalStatuses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(sortedMaritalStatuses.length / itemsPerPage);
    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'marital status ', }
    ];

    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <div className="state-select">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <BreadCrumbs paths={breadcrumbPaths} />
                <div>
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
                                className='marital-input'
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search Marital Status"
                            />
                            <button onClick={() => setShowAddPopup(true)}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                    Marital Status {sortDirection === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedMaritalStatuses.map(maritalStatus => (
                                <tr key={maritalStatus.id}>
                                    <td>{maritalStatus.status}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(maritalStatus)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => {
                                            setStatusToDelete(maritalStatus.id);
                                            setDeleteConfirmation(true);
                                        }}>
                                            <i className='trash-icon' data-feather="trash"></i>
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
                </div>
                {deleteConfirmation && (
                    <Popup isOpen={deleteConfirmation} onClose={() => setDeleteConfirmation(false)} title="Confirmation">
                        <p>Are you sure you want to delete this marital status?</p>
                        <button className="blue-button" onClick={deleteMaritalStatus}>Yes</button>
                        <button className="blue-button" onClick={() => setDeleteConfirmation(false)}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)} title="Add Marital Status">
                    <input
                        type="text"
                        value={newMaritalStatus}
                        onChange={(e) => setNewMaritalStatus(e.target.value)}
                        placeholder="Marital Status"
                    />
                    <button className="blue-button" onClick={addMaritalStatus}>Submit</button>
                </Popup>
                <Popup isOpen={showEditPopup} onClose={handleCancelEdit} title="Edit Marital Status">
                    {editMaritalStatusData && (
                        <>
                            <input
                                type="text"
                                value={editMaritalStatusData.status}
                                onChange={(e) => setEditMaritalStatusData({ ...editMaritalStatusData, status: e.target.value })}
                                placeholder="Marital Status"
                            />
                            <button className="blue-button" onClick={editMaritalStatus}>Update</button>
                            
                        </>
                    )}
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editMaritalStatusData ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default MaritalStatusList;
