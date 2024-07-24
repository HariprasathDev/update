import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BreadCrumbs from '../../../Breadcrumbs';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import '../../../css/app.css'; 
import Popup from '../../../Popup';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';


const ParentsOccupationList = () => {
    const [parentsOccupations, setParentsOccupations] = useState([]);
    const [newParentsOccupation, setNewParentsOccupation] = useState('');
    const [editParentsOccupationData, setEditParentsOccupationData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default items per page
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [occupationToDelete, setOccupationToDelete] = useState(null);
    
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order

    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup
    useEffect(() => {
        fetchParentsOccupations();
        feather.replace();
        const interval = setInterval(fetchParentsOccupations, 2000); // Auto-reload every 2 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        feather.replace();
    }, [parentsOccupations, showAddPopup, showEditPopup, deleteConfirmation]);

    const fetchParentsOccupations = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/parents-occupations/');
        setParentsOccupations(response.data);
    };

    const addParentsOccupation = async () => {
        await axios.post('http://localhost:8000/api/accounts/parents-occupations/', { occupation: newParentsOccupation });
        setNewParentsOccupation('');
        fetchParentsOccupations();
        setShowAddPopup(false);
        setShowSuccessPopup(true);
    };

    const handleDeleteOccupation = (id) => {
        setOccupationToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteOccupation = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/parents-occupations/${occupationToDelete}/`);
        setDeleteConfirmation(false);
        setOccupationToDelete(null);
        fetchParentsOccupations();
    };

    const cancelDeleteOccupation = () => {
        setDeleteConfirmation(false);
        setOccupationToDelete(null);
    };

    const editParentsOccupation = async () => {
        await axios.put(`http://localhost:8000/api/accounts/parents-occupations/${editParentsOccupationData.id}/`, editParentsOccupationData);
        fetchParentsOccupations();
        setShowEditPopup(false);
        setShowSuccessPopup(true);
    };

    const handleEditClick = (parentsOccupation) => {
        setEditParentsOccupationData(parentsOccupation);
        setShowEditPopup(true);
    };

    const handleCancelEdit = () => {
        setEditParentsOccupationData(null);
        setShowEditPopup(false);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const sortedOccupations = [...parentsOccupations].sort((a, b) => {
        if (a.occupation < b.occupation) return sortOrder === 'asc' ? -1 : 1;
        if (a.occupation > b.occupation) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredOccupations = sortedOccupations.filter(occupation =>
        occupation.occupation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedOccupations = filteredOccupations.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredOccupations.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'parents occupation ', }
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
                            <select className="items-per-page-select" onChange={handleItemsPerPageChange} value={itemsPerPage}>
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
                                placeholder="Search Parents Occupation"
                            />
                            <button onClick={() => setShowAddPopup(true)}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Occupation {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOccupations.map(parentsOccupation => (
                                <tr key={parentsOccupation.id}>
                                    <td>{parentsOccupation.occupation}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(parentsOccupation)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteOccupation(parentsOccupation.id)}>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteOccupation} title="Confirmation">
                        <p>Are you sure you want to delete this occupation?</p>
                        <button className="blue-button" onClick={confirmDeleteOccupation}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteOccupation}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)} title="Add Parents Occupation">
                    <input
                        type="text"
                        value={newParentsOccupation}
                        onChange={(e) => setNewParentsOccupation(e.target.value)}
                        placeholder="Occupation"
                    />
                    <button
                        className="blue-button"
                        onClick={addParentsOccupation}
                        disabled={!newParentsOccupation.trim()}
                    >
                        Submit
                    </button>
                </Popup>
                <Popup isOpen={showEditPopup} onClose={handleCancelEdit} title="Edit Parents Occupation">
                    {editParentsOccupationData && (
                        <>
                            <input
                                type="text"
                                value={editParentsOccupationData.occupation}
                                onChange={(e) => setEditParentsOccupationData({ ...editParentsOccupationData, occupation: e.target.value })}
                                placeholder="Occupation"
                            />
                            <button
                                className="blue-button"
                                onClick={editParentsOccupation}
                                disabled={!editParentsOccupationData.occupation.trim()}
                            >
                                Update
                            </button>
                            
                        </>
                    )}
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editParentsOccupationData ? 'update' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>

        
    );
};

export default ParentsOccupationList;
