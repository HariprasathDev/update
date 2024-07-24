import React, { useState, useEffect } from 'react';
import axios from 'axios';
import feather from 'feather-icons';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import BreadCrumbs from '../../../Breadcrumbs';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import '../../../css/app.css'; 
import Popup from '../../../Popup';


const ComplexionList = () => {
    const [complexions, setComplexions] = useState([]);
    const [newComplexion, setNewComplexion] = useState('');
    const [editComplexionData, setEditComplexionData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [complexionToDelete, setComplexionToDelete] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        fetchComplexions();
        feather.replace();

        const interval = setInterval(() => {
            fetchComplexions();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [complexions, currentPage, showAddPopup, showEditPopup, deleteConfirmation]);

    const fetchComplexions = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/complexions/');
        setComplexions(response.data);
    };

    const addComplexion = async () => {
        await axios.post('http://localhost:8000/api/accounts/complexions/', { type: newComplexion });
        setNewComplexion('');
        fetchComplexions();
        setShowAddPopup(false);
        setShowSuccessPopup(true);
    };

    const handleDeleteComplexion = (id) => {
        setComplexionToDelete(id);
        setDeleteConfirmation(true);
        setShowSuccessPopup(true);
    };

    const confirmDeleteComplexion = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/complexions/${complexionToDelete}/`);
        setDeleteConfirmation(false);
        setComplexionToDelete(null);
        fetchComplexions();
    };

    const cancelDeleteComplexion = () => {
        setDeleteConfirmation(false);
        setComplexionToDelete(null);
    };

    const editComplexion = async () => {
        await axios.put(`http://localhost:8000/api/accounts/complexions/${editComplexionData.id}/`, editComplexionData);
        fetchComplexions();
        setShowEditPopup(false);
        setShowSuccessPopup(true);
    };

    const handleEditClick = (complexion) => {
        setEditComplexionData(complexion);
        setShowEditPopup(true);
    };

    const handleCancelEdit = () => {
        setEditComplexionData(null);
        setShowEditPopup(false);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const sortedComplexions = [...complexions].sort((a, b) => {
        if (a.type < b.type) return sortOrder === 'asc' ? -1 : 1;
        if (a.type > b.type) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredComplexions = sortedComplexions.filter(complexion =>
        complexion.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedComplexions = filteredComplexions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredComplexions.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'complexion', }
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
                            <select className="marital-select" onChange={handleItemsPerPageChange} value={itemsPerPage}>
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
                                onChange={handleSearch}
                                placeholder="Search Complexion"
                            />
                            <button onClick={() => setShowAddPopup(true)}> <i data-feather="plus-square"></i></button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Complexion {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedComplexions.map(complexion => (
                                <tr key={complexion.id}>
                                    <td>{complexion.type}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(complexion)}><i data-feather="edit"></i></button>
                                        <button onClick={() => handleDeleteComplexion(complexion.id)}><i className='trash-icon' data-feather="trash-2"></i></button>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteComplexion} title="Confirmation">
                        <p>Are you sure you want to delete this complexion?</p>
                        <button className="blue-button" onClick={confirmDeleteComplexion}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteComplexion}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)} title="Add Complexion">
                    <input
                        type="text"
                        value={newComplexion}
                        onChange={(e) => setNewComplexion(e.target.value)}
                        placeholder="Complexion"
                    />
                    <button onClick={addComplexion} disabled={!newComplexion}>Submit</button>
                </Popup>
                <Popup isOpen={showEditPopup} onClose={handleCancelEdit} title="Edit Complexion">
                    {editComplexionData && (
                        <>
                            <input
                                type="text"
                                value={editComplexionData.type}
                                onChange={(e) => setEditComplexionData({ ...editComplexionData, type: e.target.value })}
                                placeholder="Complexion"
                            />
                            <button onClick={editComplexion} disabled={!editComplexionData.type}>Update</button>
                            {/* <button onClick={handleCancelEdit}>Cancel</button> */}
                        </>
                    )}
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editComplexionData ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default ComplexionList;
