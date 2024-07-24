import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import BreadCrumbs from '../../../Breadcrumbs';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';
import { getFamilyTypes, addFamilyType, updateFamilyType, deleteFamilyType } from '../../../api';


const FamilyTypeList = () => {
    const [familyTypes, setFamilyTypes] = useState([]);
    const [newFamilyType, setNewFamilyType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [familyTypeToDelete, setFamilyTypeToDelete] = useState(null);
    const [editFamilyTypeId, setEditFamilyTypeId] = useState(null);
    const [editedFamilyTypeName, setEditedFamilyTypeName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [validationError, setValidationError] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    
    useEffect(() => {
        fetchFamilyTypes();
        const interval = setInterval(() => {
            fetchFamilyTypes();
        }, 10000); // Reload every 10 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [familyTypes, showPopup, deleteConfirmation]);

    const fetchFamilyTypes = async () => {
        const response = await getFamilyTypes();
        setFamilyTypes(response.data);
    };

    const handleAddFamilyType = async () => {
        if (newFamilyType.trim() === '') {
            setValidationError();
            return;
        }
        await addFamilyType({ name: newFamilyType });
        setNewFamilyType('');
        setShowPopup(false);
        setValidationError('');
        fetchFamilyTypes();
        setShowSuccessPopup(true);
    };

    const handleDeleteFamilyType = async (id) => {
        setFamilyTypeToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteFamilyType = async () => {
        await deleteFamilyType(familyTypeToDelete);
        setDeleteConfirmation(false);
        setFamilyTypeToDelete(null);
        fetchFamilyTypes();
    };

    const cancelDeleteFamilyType = () => {
        setDeleteConfirmation(false);
        setFamilyTypeToDelete(null);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleEditFamilyType = (id, name) => {
        setEditFamilyTypeId(id);
        setEditedFamilyTypeName(name);
        setNewFamilyType(''); // Reset new family type to avoid conflicts
        setShowPopup(true);
    };

    const handleUpdateFamilyType = async () => {
        if (editedFamilyTypeName.trim() === '') {
            setValidationError();
            return;
        }
        await updateFamilyType(editFamilyTypeId, { name: editedFamilyTypeName });
        setEditFamilyTypeId(null);
        setEditedFamilyTypeName('');
        setShowPopup(false);
        setValidationError('');
        fetchFamilyTypes();
    };

    const handleAddButtonClick = () => {
        setEditFamilyTypeId(null);
        setEditedFamilyTypeName('');
        setNewFamilyType('');
        setValidationError('');
        setShowPopup(true);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
    };

    const sortedFamilyTypes = [...familyTypes].sort((a, b) => {
        if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredFamilyTypes = sortedFamilyTypes.filter(familyType =>
        familyType.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedFamilyTypes = filteredFamilyTypes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const totalPages = Math.ceil(filteredFamilyTypes.length / itemsPerPage);

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'family Master' },
        { name: 'family type ', }
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
                                placeholder="Search Family Type"
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
                                    Family Type {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFamilyTypes.map(familyType => (
                                <tr key={familyType.id}>
                                    <td>{familyType.name}</td>
                                    <td>
                                        <button onClick={() => handleEditFamilyType(familyType.id, familyType.name)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteFamilyType(familyType.id)}>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteFamilyType} title="Confirmation">
                        <p>Are you sure you want to delete this family type?</p>
                        <button className="blue-button" onClick={confirmDeleteFamilyType}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteFamilyType}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} title={editFamilyTypeId ? "Edit Family Type" : "Add Family Type"}>
                    <input
                        type="text"
                        value={editFamilyTypeId ? editedFamilyTypeName : newFamilyType}
                        onChange={(e) => editFamilyTypeId ? setEditedFamilyTypeName(e.target.value) : setNewFamilyType(e.target.value)}
                        placeholder="Family Type Name"
                    />
                    {validationError && <p className="validation-error">{validationError}</p>}
                    <button className="blue-button" onClick={editFamilyTypeId ? handleUpdateFamilyType : handleAddFamilyType}>{editFamilyTypeId ? "Update" : "Submit"}</button>
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editFamilyTypeId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default FamilyTypeList;
