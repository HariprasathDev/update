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

const UgDegreeList = () => {
    const [ugDegrees, setUgDegrees] = useState([]);
    const [newUgDegree, setNewUgDegree] = useState('');
    const [editUgDegreeId, setEditUgDegreeId] = useState(null);
    const [editedUgDegree, setEditedUgDegree] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [degreeToDelete, setDegreeToDelete] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    
    useEffect(() => {
        fetchUgDegrees();
        const interval = setInterval(() => {
            fetchUgDegrees();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [ugDegrees, showAddPopup, showEditPopup, deleteConfirmation]);

    const fetchUgDegrees = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/ug-degrees/');
        setUgDegrees(response.data);
    };

    const addUgDegree = async () => {
        await axios.post('http://localhost:8000/api/accounts/ug-degrees/', { degree: newUgDegree });
        setNewUgDegree('');
        setShowAddPopup(false);
        fetchUgDegrees();
        setShowSuccessPopup(true); // Show success popup
    };

    const handleDeleteClick = (id) => {
        setDegreeToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteUgDegree = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/ug-degrees/${degreeToDelete}/`);
        setDeleteConfirmation(false);
        setDegreeToDelete(null);
        fetchUgDegrees();
    };

    const cancelDeleteUgDegree = () => {
        setDeleteConfirmation(false);
        setDegreeToDelete(null);
    };

    const handleEditClick = (id, degree) => {
        setEditUgDegreeId(id);
        setEditedUgDegree(degree);
        setShowEditPopup(true);
    };

    const editUgDegree = async () => {
        await axios.put(`http://localhost:8000/api/accounts/ug-degrees/${editUgDegreeId}/`, { degree: editedUgDegree });
        setEditUgDegreeId(null);
        setEditedUgDegree('');
        setShowEditPopup(false);
        fetchUgDegrees();
        setShowSuccessPopup(true); // Show success popup
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

    const filteredDegrees = ugDegrees.filter(degree =>
        degree.degree.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedDegrees = [...filteredDegrees].sort((a, b) => {
        if (a.degree < b.degree) return sortOrder === 'asc' ? -1 : 1;
        if (a.degree > b.degree) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedDegrees = sortedDegrees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredDegrees.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'ug Degree  ', }
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
                        <select className='marital-select' onChange={handleItemsPerPageChange} value={itemsPerPage}>
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
                            placeholder="Search UG Degree"
                        />
                        <button className="add-button" onClick={() => setShowAddPopup(true)}>
                            <i data-feather="plus-square"></i>
                        </button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                               Ug Degree {sortOrder === 'asc' ? '▲' : '▼'}
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDegrees.map(ugDegree => (
                            <tr key={ugDegree.id}>
                                <td>{ugDegree.degree}</td>
                                <td>
                                    <button onClick={() => handleEditClick(ugDegree.id, ugDegree.degree)}>
                                        <i data-feather="edit"></i>
                                    </button>
                                    <button onClick={() => handleDeleteClick(ugDegree.id)}>
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
                <Popup isOpen={deleteConfirmation} onClose={cancelDeleteUgDegree} title="Confirmation">
                    <p>Are you sure you want to delete this degree?</p>
                    <button className="blue-button" onClick={confirmDeleteUgDegree}>Yes</button>
                    <button className="blue-button" onClick={cancelDeleteUgDegree}>No</button>
                </Popup>
            )}
            <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)} title="Add UG Degree">
                <input
                    type="text"
                    value={newUgDegree}
                    onChange={(e) => setNewUgDegree(e.target.value)}
                    placeholder="Degree"
                />
                <button
                    className="blue-button"
                    onClick={addUgDegree}
                    disabled={!newUgDegree.trim()} // Disable if the input is empty
                >
                    Submit
                </button>
            </Popup>
            <Popup isOpen={showEditPopup} onClose={() => setShowEditPopup(false)} title="Edit UG Degree">
                <input
                    type="text"
                    value={editedUgDegree}
                    onChange={(e) => setEditedUgDegree(e.target.value)}
                    placeholder="Degree"
                />
                <button
                    className="blue-button"
                    onClick={editUgDegree}
                    disabled={!editedUgDegree.trim()} // Disable if the input is empty
                >
                    Update
                </button>
            </Popup>
            {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editedUgDegree ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
        </div>
    );
};

export default UgDegreeList;
