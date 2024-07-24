import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BreadCrumbs from '../../../Breadcrumbs';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import '../../../css/app.css'; 
import Popup from '../../../Popup';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';


const ProfileHolderList = () => {
    const [profileHolders, setProfileHolders] = useState([]);
    const [newProfileHolder, setNewProfileHolder] = useState({ name: '', relation: '' });
    const [editHolderId, setEditHolderId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [holderToDelete, setHolderToDelete] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    
    useEffect(() => {
        fetchProfileHolders();
        feather.replace(); // Initialize Feather Icons

        const interval = setInterval(() => {
            fetchProfileHolders();
            feather.replace(); // Re-initialize Feather Icons after data fetch
        }, 2000); // Refresh every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchProfileHolders = () => {
        axios.get('http://localhost:8000/api/accounts/profile-holders/')
            .then(response => {
                setProfileHolders(response.data);
            }).catch(error => {
                console.error(error);
            });
    };

    const handleAddOrEditHolder = () => {
        if (editHolderId) {
            axios.put(`http://localhost:8000/api/accounts/profile-holders/${editHolderId}/`, newProfileHolder)
                .then(response => {
                    setProfileHolders(profileHolders.map(holder => holder.id === editHolderId ? response.data : holder));
                    resetForm();
                    setShowSuccessPopup(true);
                }).catch(error => {
                    console.error(error);
                });
        } else {
            axios.post('http://localhost:8000/api/accounts/profile-holders/', newProfileHolder)
                .then(response => {
                    setProfileHolders([...profileHolders, response.data]);
                    resetForm();
                    setShowSuccessPopup(true);
                }).catch(error => {
                    console.error(error);
                });
        }
        setShowPopup(false);
    };

    const handleEditHolder = (holder) => {
        setEditHolderId(holder.id);
        setNewProfileHolder({ name: holder.name, relation: holder.relation });
        setShowPopup(true);
    };

    const handleDeleteHolder = (id) => {
        setHolderToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteHolder = () => {
        axios.delete(`http://localhost:8000/api/accounts/profile-holders/${holderToDelete}/`)
            .then(() => {
                setProfileHolders(profileHolders.filter(holder => holder.id !== holderToDelete));
                setHolderToDelete(null);
                setDeleteConfirmation(false);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const cancelDeleteHolder = () => {
        setHolderToDelete(null);
        setDeleteConfirmation(false);
    };

    const resetForm = () => {
        setNewProfileHolder({ name: '', relation: '' });
        setEditHolderId(null);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        fetchProfileHolders();
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
        resetForm();
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleSort = (field, direction) => {
        setSortField(field);
        setSortDirection(direction);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const filteredHolders = profileHolders.filter(holder =>
        holder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holder.relation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedHolders = [...filteredHolders].sort((a, b) => {
        if (!sortField) return 0;
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedHolders = sortedHolders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredHolders.length / itemsPerPage);

    const isFormValid = newProfileHolder.name.trim() !== '' && newProfileHolder.relation.trim() !== '';

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'profile holder ', }
    ];
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };



    return (
        <div className="state-select">
             
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Navbar />
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
                        <div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search Profile Holder"
                            />
                            <button className="add-button" onClick={handlePopupOpen}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name', sortDirection)}>Profile Holder</th>
                                <th onClick={() => handleSort('relation', sortDirection)}>Relation</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHolders.map(holder => (
                                <tr key={holder.id}>
                                    <td>{holder.name}</td>
                                    <td>{holder.relation}</td>
                                    <td>
                                        <button onClick={() => handleEditHolder(holder)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteHolder(holder.id)}>
                                            <i className='trash-icon' data-feather="trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Stack spacing={2}>
                        <Typography>Page: {currentPage}</Typography>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </Stack>
                </div>
            </div>
            {deleteConfirmation && (
                <Popup isOpen={deleteConfirmation} onClose={cancelDeleteHolder} title="Confirmation">
                    <p>Are you sure you want to delete this profile holder?</p>
                    <button className="blue-button" onClick={confirmDeleteHolder}>Yes</button>
                    <button className="blue-button" onClick={cancelDeleteHolder}>No</button>
                </Popup>
            )}
            <Popup isOpen={showPopup} onClose={handlePopupClose} title={editHolderId ? 'Edit Profile Holder' : 'Add Profile Holder'}>
                <label>
                    Name:
                </label>
                <input
                    type="text"
                    value={newProfileHolder.name}
                    onChange={(e) => setNewProfileHolder({ ...newProfileHolder, name: e.target.value })}
                    placeholder="Profile Holder Name"
                />
                <label>
                    Relation:
                </label>
                <input
                    type="text"
                    value={newProfileHolder.relation}
                    onChange={(e) => setNewProfileHolder({ ...newProfileHolder, relation: e.target.value })}
                    placeholder="Profile Holder Relation"
                />
                <button className="blue-button" onClick={handleAddOrEditHolder} disabled={!isFormValid}>
                    {editHolderId ? 'Update' : 'Submit'}
                </button>
            </Popup>
            {showSuccessPopup && (
                <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                    <p>State has been successfully {editHolderId ? 'updated' : 'added'}!</p>
                    <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                </Popup>
            )}
        </div>
    );
};

export default ProfileHolderList;
