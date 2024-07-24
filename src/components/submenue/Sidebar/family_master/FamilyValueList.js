import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import BreadCrumbs from '../../../Breadcrumbs';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';
import { getFamilyValues, addFamilyValue, updateFamilyValue, deleteFamilyValue } from '../../../api';

const FamilyValueList = () => {
    const [familyValues, setFamilyValues] = useState([]);
    const [newFamilyValue, setNewFamilyValue] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [familyValueToDelete, setFamilyValueToDelete] = useState(null);
    const [editFamilyValueId, setEditFamilyValueId] = useState(null);
    const [editedFamilyValueName, setEditedFamilyValueName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        fetchFamilyValues();
        const interval = setInterval(() => {
            fetchFamilyValues();
        }, 10000); // Reload every 10 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [familyValues, showPopup, deleteConfirmation]);

    const fetchFamilyValues = async () => {
        try {
            const response = await getFamilyValues();
            console.log('Fetched family values:', response.data);
            setFamilyValues(response.data);
        } catch (error) {
            console.error('Error fetching family values:', error);
        }
    };

    const handleAddFamilyValue = async () => {
        if (newFamilyValue.trim() === '') {
            setErrorMessage('Family value cannot be empty');
            return;
        }
        try {
            await addFamilyValue({ value: newFamilyValue });
            setNewFamilyValue('');
            setShowPopup(false);
            setErrorMessage('');
            fetchFamilyValues();
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Error adding family value:', error);
            setErrorMessage('Failed to add family value');
        }
    };

    const handleDeleteFamilyValue = (id) => {
        setFamilyValueToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteFamilyValue = async () => {
        try {
            await deleteFamilyValue(familyValueToDelete);
            setDeleteConfirmation(false);
            setFamilyValueToDelete(null);
            fetchFamilyValues();
        } catch (error) {
            console.error('Error deleting family value:', error);
            setErrorMessage('Failed to delete family value');
        }
    };

    const cancelDeleteFamilyValue = () => {
        setDeleteConfirmation(false);
        setFamilyValueToDelete(null);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleEditFamilyValue = (id, value) => {
        setEditFamilyValueId(id);
        setEditedFamilyValueName(value);
        setNewFamilyValue(''); // Reset new family value to avoid conflicts
        setShowPopup(true);
        setErrorMessage('');
    };

    const handleUpdateFamilyValue = async () => {
        if (editedFamilyValueName.trim() === '') {
            setErrorMessage('Family value cannot be empty');
            return;
        }
        try {
            await updateFamilyValue(editFamilyValueId, { value: editedFamilyValueName });
            setEditFamilyValueId(null);
            setEditedFamilyValueName('');
            setShowPopup(false);
            setErrorMessage('');
            fetchFamilyValues();
        } catch (error) {
            console.error('Error updating family value:', error);
            setErrorMessage('Failed to update family value');
        }
    };

    const handleAddButtonClick = () => {
        setEditFamilyValueId(null);
        setEditedFamilyValueName('');
        setNewFamilyValue('');
        setShowPopup(true);
        setErrorMessage('');
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const sortedFamilyValues = [...familyValues].sort((a, b) => {
        if (a.value < b.value) return sortOrder === 'asc' ? -1 : 1;
        if (a.value > b.value) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredFamilyValues = sortedFamilyValues.filter(familyValue =>
        familyValue.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedFamilyValues = filteredFamilyValues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const totalPages = Math.ceil(filteredFamilyValues.length / itemsPerPage);

    const breadcrumbPaths = [
        { name: 'Home' },
        { name: 'Family Master' },
        { name: 'Family Value' }
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
                                placeholder="Search Family Value"
                            />
                            <button className="add-button" onClick={handleAddButtonClick}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Family Value {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFamilyValues.map(familyValue => (
                                <tr key={familyValue.id}>
                                    <td>{familyValue.value}</td>
                                    <td>
                                        <button onClick={() => handleEditFamilyValue(familyValue.id, familyValue.value)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteFamilyValue(familyValue.id)}>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteFamilyValue} title="Confirmation">
                        <p>Are you sure you want to delete this family value?</p>
                        <button className="blue-button" onClick={confirmDeleteFamilyValue}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteFamilyValue}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} title={editFamilyValueId ? "Edit Family Value" : "Add Family Value"}>
                    <input
                        type="text"
                        value={editFamilyValueId ? editedFamilyValueName : newFamilyValue}
                        onChange={(e) => editFamilyValueId ? setEditedFamilyValueName(e.target.value) : setNewFamilyValue(e.target.value)}
                        placeholder="Family Value Name"
                    />
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button className="blue-button" onClick={editFamilyValueId ? handleUpdateFamilyValue : handleAddFamilyValue}>
                        {editFamilyValueId ? "Update" : "Add"}
                    </button>
                </Popup>
                <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                    <p>Family value added successfully!</p>
                    <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                </Popup>
            </div>
        </div>
    );
};

export default FamilyValueList;
