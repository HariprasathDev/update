import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import '../../../css/app.css';
import BreadCrumbs from '../../../Breadcrumbs';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';


const ReligionList = () => {
    const [religions, setReligions] = useState([]);
    const [newReligion, setNewReligion] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [religionToDelete, setReligionToDelete] = useState(null);
    const [editReligionId, setEditReligionId] = useState(null);
    const [editedReligionName, setEditedReligionName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    useEffect(() => {
        fetchReligions();
        const interval = setInterval(() => {
            fetchReligions();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [religions, showPopup, deleteConfirmation]);

    const fetchReligions = async () => {
        const response = await axios.get('http://localhost:8000/api/religions/');
        setReligions(response.data);
    };

    const handleAddReligion = async () => {
        if (newReligion.trim() === '') return; // Prevent empty submission
        await axios.post('http://localhost:8000/api/religions/', { name: newReligion });
        setNewReligion('');
        setShowPopup(false);
        setShowSuccessPopup(true); // Show success popup
        fetchReligions();
    };

    const handleDeleteReligion = async (id) => {
        setReligionToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteReligion = async () => {
        await axios.delete(`http://localhost:8000/api/religions/${religionToDelete}/`);
        setDeleteConfirmation(false);
        setReligionToDelete(null);
        fetchReligions();
    };

    const cancelDeleteReligion = () => {
        setDeleteConfirmation(false);
        setReligionToDelete(null);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleEditReligion = (id, name) => {
        setEditReligionId(id);
        setEditedReligionName(name);
        setShowPopup(true);
    };

    const handleUpdateReligion = async () => {
        if (editedReligionName.trim() === '') return; // Prevent empty submission
        await axios.put(`http://localhost:8000/api/religions/${editReligionId}/`, { name: editedReligionName });
        setEditReligionId(null);
        setEditedReligionName('');
        setShowPopup(false);
        setShowSuccessPopup(true); // Show success popup
        fetchReligions();
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const sortedReligions = [...religions].sort((a, b) => {
        if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredReligions = sortedReligions.filter(religion =>
        religion.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedReligions = filteredReligions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const totalPages = Math.ceil(filteredReligions.length / itemsPerPage);

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'Religious and community' },
        { name: 'Religious ', }
    ];

    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <div className="state-select">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div>
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
                        <div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search Religion"
                            />
                            <button className="add-button" onClick={() => { setShowPopup(true); setEditReligionId(null); }}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Religion {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReligions.map(religion => (
                                <tr key={religion.id}>
                                    <td>{religion.name}</td>
                                    <td>
                                        <button onClick={() => handleEditReligion(religion.id, religion.name)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteReligion(religion.id)}>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteReligion} title="Confirmation">
                        <p>Are you sure you want to delete this religion?</p>
                        <button className="blue-button" onClick={confirmDeleteReligion}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteReligion}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} title={editReligionId ? "Edit Religion" : "Add Religion"}>
                    <input
                        type="text"
                        value={editReligionId ? editedReligionName : newReligion}
                        onChange={(e) => editReligionId ? setEditedReligionName(e.target.value) : setNewReligion(e.target.value)}
                        placeholder="Religion Name"
                    />
                    <button className="blue-button" onClick={editReligionId ? handleUpdateReligion : handleAddReligion} disabled={editReligionId ? editedReligionName.trim() === '' : newReligion.trim() === ''}>
                        {editReligionId ? "Update" : "Submit"}
                    </button>
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Religion has been successfully {editReligionId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default ReligionList;
