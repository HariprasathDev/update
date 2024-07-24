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

const LagnamList = () => {
    const [lagnams, setLagnams] = useState([]);
    const [newLagnam, setNewLagnam] = useState('');
    const [editLagnamId, setEditLagnamId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [lagnamToDelete, setLagnamToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showPopup, setShowPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    
    useEffect(() => {
        fetchLagnams();
        const interval = setInterval(() => {
            fetchLagnams();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [lagnams, showPopup, deleteConfirmation]);

    const fetchLagnams = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/lagnams/');
        setLagnams(response.data);
    };

    const addOrUpdateLagnam = async () => {
        const lagnamData = { name: newLagnam };
        if (editLagnamId) {
            await axios.put(`http://localhost:8000/api/accounts/lagnams/${editLagnamId}/`, lagnamData);
        } else {
            await axios.post('http://localhost:8000/api/accounts/lagnams/', lagnamData);
        }
        setNewLagnam('');
        setShowPopup(false);
        setEditLagnamId(null);
        fetchLagnams();
        setShowSuccessPopup(true);
    };

    const handleDeleteLagnam = (id) => {
        setLagnamToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteLagnam = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/lagnams/${lagnamToDelete}/`);
        setDeleteConfirmation(false);
        setLagnamToDelete(null);
        fetchLagnams();
    };

    const cancelDeleteLagnam = () => {
        setDeleteConfirmation(false);
        setLagnamToDelete(null);
    };

    const handleEditLagnam = (lagnam) => {
        setEditLagnamId(lagnam.id);
        setNewLagnam(lagnam.name);
        setShowPopup(true);
    };

    const handleSort = () => {
        const newSortOrder = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newSortOrder);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const filteredLagnams = lagnams.filter(lagnam =>
        lagnam.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedLagnams = [...filteredLagnams].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedLagnams = sortedLagnams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredLagnams.length / itemsPerPage);

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'Horoscope Master' },
        { name: 'lagnam - dasai ', }
    ];
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <div className="state-select">
            <Sidebar />
            <div className="main-content">
                <Navbar className="component" />
                <BreadCrumbs paths={breadcrumbPaths} />
                <div className="header-buttons">
                    <div className="left-corner">
                        <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
                            <option value={20}>20</option>
                            <option value={40}>40</option>
                            <option value={80}>80</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className="right-corner">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Lagnam"
                        />
                        <button onClick={() => setShowPopup(true)}>
                            <i data-feather="plus-square"></i>
                        </button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                lagnam / Dasai {sortDirection === 'asc' ? '▲' : '▼'}
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLagnams.map(lagnam => (
                            <tr key={lagnam.id}>
                                <td>{lagnam.name}</td>
                                <td>
                                    <button onClick={() => handleEditLagnam(lagnam)}>
                                        <i data-feather="edit"></i>
                                    </button>
                                    <button onClick={() => handleDeleteLagnam(lagnam.id)}>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteLagnam} title="Confirmation">
                        <p>Are you sure you want to delete this lagnam?</p>
                        <button className="blue-button" onClick={confirmDeleteLagnam}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteLagnam}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} title={editLagnamId ? "Edit Lagnam" : "Add Lagnam"}>
                    <input
                        type="text"
                        value={newLagnam}
                        onChange={(e) => setNewLagnam(e.target.value)}
                        placeholder="Lagnam Name"
                    />
                    <button
                        className="blue-button"
                        onClick={addOrUpdateLagnam}
                        disabled={!newLagnam.trim()} // Disable the button if the input is empty
                    >
                        {editLagnamId ? "Update" : "Submit"}
                    </button>
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editLagnamId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default LagnamList;
