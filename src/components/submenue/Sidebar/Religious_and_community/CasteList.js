import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import '../../../css/app.css';
import BreadCrumbs from '../../../Breadcrumbs';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';


const CasteList = () => {
    const [castes, setCastes] = useState([]);
    const [newCaste, setNewCaste] = useState({ name: '' });
    const [editingCaste, setEditingCaste] = useState({ id: null, name: '' });
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [casteToDelete, setCasteToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    useEffect(() => {
        fetchCastes();
        const interval = setInterval(() => {
            fetchCastes();
        }, 10000); // Reload page every 10 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [castes, showPopup, deleteConfirmation]);

    const fetchCastes = async () => {
        const response = await axios.get('http://localhost:8000/api/castes/');
        setCastes(response.data);
    };

    const addCaste = async () => {
        if (newCaste.name.trim() === '') return; 
        await axios.post('http://localhost:8000/api/castes/', newCaste);
        setNewCaste({ name: '' });
        setShowPopup(false);
        setShowSuccessPopup(true); // Show success popup
        fetchCastes();
    };

    const deleteCaste = async (id) => {
        await axios.delete(`http://localhost:8000/api/castes/${id}/`);
        fetchCastes();
    };

    const editCaste = async () => {
        if (editingCaste.name.trim() === '') return;
        await axios.put(`http://localhost:8000/api/castes/${editingCaste.id}/`, editingCaste);
        setEditingCaste({ id: null, name: '' });
        setShowPopup(false);
        setShowSuccessPopup(true); // Show success popup
        fetchCastes();
    };

    const handleEdit = (id, name) => {
        setEditingCaste({ id, name });
        setShowPopup(true);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleDeleteConfirmation = (id) => {
        setCasteToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteCaste = async () => {
        await deleteCaste(casteToDelete);
        setCasteToDelete(null);
        setDeleteConfirmation(false);
    };

    const cancelDeleteCaste = () => {
        setCasteToDelete(null);
        setDeleteConfirmation(false);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const sortedCastes = [...castes].sort((a, b) => {
        if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredCastes = sortedCastes.filter(caste =>
        caste.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedCastes = filteredCastes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredCastes.length / itemsPerPage);

    const breadcrumbPaths = [
        { name: 'Home' },
        { name: 'Religious and community' },
        { name: 'Caste' }
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
                            placeholder="Search Caste"
                        />
                        <button className="add-button" onClick={() => { setShowPopup(true); setEditingCaste({ id: null, name: '' }); }}>
                            <i data-feather="plus-square"></i>
                        </button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                Caste {sortOrder === 'asc' ? '▲' : '▼'}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCastes.map(caste => (
                            <tr key={caste.id}>
                                <td>{caste.name}</td>
                                <td>
                                    <button onClick={() => handleEdit(caste.id, caste.name)}>
                                        <i data-feather="edit"></i>
                                    </button>
                                    <button onClick={() => handleDeleteConfirmation(caste.id)}>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteCaste} title="Confirmation">
                        <p>Are you sure you want to delete this caste?</p>
                        <button className="blue-button" onClick={confirmDeleteCaste}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteCaste}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} title={editingCaste.id ? "Edit Caste" : "Add Caste"}>
                    <input
                        type="text"
                        value={editingCaste.id ? editingCaste.name : newCaste.name}
                        onChange={(e) => editingCaste.id ? setEditingCaste({ ...editingCaste, name: e.target.value }) : setNewCaste({ ...newCaste, name: e.target.value })}
                        placeholder="Caste Name"
                    />
                    <button className="blue-button" onClick={editingCaste.id ? editCaste : addCaste} disabled={editingCaste.id ? editingCaste.name.trim() === '' : newCaste.name.trim() === ''}>
                        {editingCaste.id ? "Update" : "Submit"}
                    </button>
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Caste has been successfully {editingCaste.id ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default CasteList;
