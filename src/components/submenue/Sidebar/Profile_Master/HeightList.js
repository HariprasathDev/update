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
const HeightList = () => {
    const [heights, setHeights] = useState([]);
    const [newHeight, setNewHeight] = useState({ value: '' });
    const [editHeightId, setEditHeightId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [heightToDelete, setHeightToDelete] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    useEffect(() => {
        fetchHeights();
        feather.replace();

        const interval = setInterval(() => {
            fetchHeights();
            feather.replace();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const fetchHeights = () => {
        axios.get('http://localhost:8000/api/heights/')
            .then(response => {
                setHeights(response.data);
            }).catch(error => {
                console.error(error);
            });
    };

    const handleAddOrEditHeight = () => {
        if (editHeightId) {
            axios.put(`http://localhost:8000/api/heights/${editHeightId}/`, newHeight)
                .then(response => {
                    setHeights(heights.map(height => height.id === editHeightId ? response.data : height));
                    resetForm();
                    setShowSuccessPopup(true); // Show success popup on update
                }).catch(error => {
                    console.error(error);
                });
        } else {
            axios.post('http://localhost:8000/api/heights/', newHeight)
                .then(response => {
                    setHeights([...heights, response.data]);
                    resetForm();
                    setShowSuccessPopup(true); // Show success popup on add
                }).catch(error => {
                    console.error(error);
                });
        }
        setShowPopup(false);
    };

    const handleEditHeight = (height) => {
        setEditHeightId(height.id);
        setNewHeight({ value: height.value });
        setShowPopup(true);
    };

    const handleDeleteHeight = (id) => {
        setHeightToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteHeight = () => {
        axios.delete(`http://localhost:8000/api/heights/${heightToDelete}/`)
            .then(() => {
                setHeights(heights.filter(height => height.id !== heightToDelete));
                setHeightToDelete(null);
                setDeleteConfirmation(false);
                setShowSuccessPopup(true); // Show success popup on delete
            })
            .catch(error => {
                console.error(error);
            });
    };

    const cancelDeleteHeight = () => {
        setHeightToDelete(null);
        setDeleteConfirmation(false);
    };

    const resetForm = () => {
        setNewHeight({ value: '' });
        setEditHeightId(null);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        fetchHeights();
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
        resetForm();
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const filteredHeights = heights.filter(height =>
        height.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedHeights = [...filteredHeights].sort((a, b) => {
        if (a.value < b.value) return sortOrder === 'asc' ? -1 : 1;
        if (a.value > b.value) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedHeights = sortedHeights.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredHeights.length / itemsPerPage);

    const isFormValid = newHeight.value.trim() !== '';

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'height', }
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
                                placeholder="Search Height"
                            />
                            <button className="add-button" onClick={handlePopupOpen}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Height {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHeights.map(height => (
                                <tr key={height.id}>
                                    <td>{height.value}</td>
                                    <td>
                                        <button onClick={() => handleEditHeight(height)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteHeight(height.id)}>
                                            <i data-feather="trash-2"></i>
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
                        <Popup isOpen={deleteConfirmation} onClose={cancelDeleteHeight} title="Confirmation">
                            <p>Are you sure you want to delete this height?</p>
                            <button className="blue-button" onClick={confirmDeleteHeight}>Yes</button>
                            <button className="blue-button" onClick={cancelDeleteHeight}>No</button>
                        </Popup>
                    )}
                    <Popup isOpen={showPopup} onClose={handlePopupClose} title={editHeightId ? 'Edit Height' : 'Add Height'}>
                        <label>
                            Value:
                        </label>
                        <input
                            type="text"
                            value={newHeight.value}
                            onChange={(e) => setNewHeight({ ...newHeight, value: e.target.value })}
                            placeholder="Height Value"
                        />
                        <button className="blue-button" onClick={handleAddOrEditHeight} disabled={!isFormValid}>
                            {editHeightId ? 'Update' : 'Submit'}
                        </button>
                    </Popup>
                    {showSuccessPopup && (
                        <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                            <p>Height has been successfully {editHeightId ? 'updated' : 'added'}!</p>
                            <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                        </Popup>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeightList;
