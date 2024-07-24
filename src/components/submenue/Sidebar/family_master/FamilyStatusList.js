import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import BreadCrumbs from '../../../Breadcrumbs';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';
import { getFamilyStatuses, addFamilyStatus, updateFamilyStatus, deleteFamilyStatus } from '../../../api';


const FamilyStatusList = () => {
    const [familyStatuses, setFamilyStatuses] = useState([]);
    const [newFamilyStatus, setNewFamilyStatus] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [familyStatusToDelete, setFamilyStatusToDelete] = useState(null);
    const [editFamilyStatusId, setEditFamilyStatusId] = useState(null);
    const [editedFamilyStatusName, setEditedFamilyStatusName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [formError, setFormError] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    useEffect(() => {
        fetchFamilyStatuses();
        const interval = setInterval(() => {
            fetchFamilyStatuses();
        }, 10000); // Fetch data every 10 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [familyStatuses, showPopup, deleteConfirmation]);

    const fetchFamilyStatuses = async () => {
        const response = await getFamilyStatuses();
        setFamilyStatuses(response.data);
    };

    const handleAddFamilyStatus = async () => {
        if (newFamilyStatus.trim() === '') {
            setFormError();
            return;
        }
        setFormError('');
        await addFamilyStatus({ status: newFamilyStatus });
        setNewFamilyStatus('');
        setShowPopup(false);
        fetchFamilyStatuses();
        setShowSuccessPopup(true);
    };

    const handleUpdateFamilyStatus = async () => {
        if (editedFamilyStatusName.trim() === '') {
            setFormError();
            return;
        }
        setFormError('');
        await updateFamilyStatus(editFamilyStatusId, { status: editedFamilyStatusName });
        setEditFamilyStatusId(null);
        setEditedFamilyStatusName('');
        setShowPopup(false);
        fetchFamilyStatuses();
        setShowSuccessPopup(true);
    };

    const handleDeleteFamilyStatus = async (id) => {
        setFamilyStatusToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteFamilyStatus = async () => {
        await deleteFamilyStatus(familyStatusToDelete);
        setDeleteConfirmation(false);
        setFamilyStatusToDelete(null);
        fetchFamilyStatuses();
    };

    const cancelDeleteFamilyStatus = () => {
        setDeleteConfirmation(false);
        setFamilyStatusToDelete(null);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleEditFamilyStatus = (id, status) => {
        setEditFamilyStatusId(id);
        setEditedFamilyStatusName(status);
        setNewFamilyStatus('');
        setShowPopup(true);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const sortedFamilyStatuses = [...familyStatuses].sort((a, b) => {
        if (a.status < b.status) return sortOrder === 'asc' ? -1 : 1;
        if (a.status > b.status) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredFamilyStatuses = sortedFamilyStatuses.filter(familyStatus =>
        familyStatus.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedFamilyStatuses = filteredFamilyStatuses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const totalPages = Math.ceil(filteredFamilyStatuses.length / itemsPerPage);

    const handleShowPopup = () => {
        setEditFamilyStatusId(null);
        setEditedFamilyStatusName('');
        setNewFamilyStatus('');
        setShowPopup(true);
    };

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'family Master' },
        { name: 'family status', }
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
                            <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
                                <option value={10}>20</option>
                                <option value={20}>40</option>
                                <option value={30}>80</option>
                                <option value={50}>100</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search Family Status"
                            />
                            <button className="add-button" onClick={handleShowPopup}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Family Status {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFamilyStatuses.map(familyStatus => (
                                <tr key={familyStatus.id}>
                                    <td>{familyStatus.status}</td>
                                    <td>
                                        <button onClick={() => handleEditFamilyStatus(familyStatus.id, familyStatus.status)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteFamilyStatus(familyStatus.id)}>
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
                </div>
                {deleteConfirmation && (
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteFamilyStatus} title="Confirmation">
                        <p>Are you sure you want to delete this family status?</p>
                        <button className="blue-button" onClick={confirmDeleteFamilyStatus}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteFamilyStatus}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} title={editFamilyStatusId ? "Edit Family Status" : "Add Family Status"}>
                    <input
                        type="text"
                        value={editFamilyStatusId ? editedFamilyStatusName : newFamilyStatus}
                        onChange={(e) => editFamilyStatusId ? setEditedFamilyStatusName(e.target.value) : setNewFamilyStatus(e.target.value)}
                        placeholder="Family Status Name"
                    />
                    {formError && <p className="error-message">{formError}</p>}
                    <button className="blue-button" onClick={editFamilyStatusId ? handleUpdateFamilyStatus : handleAddFamilyStatus}>{editFamilyStatusId ? "Update" : "Submit"}</button>
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editFamilyStatusId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default FamilyStatusList;
