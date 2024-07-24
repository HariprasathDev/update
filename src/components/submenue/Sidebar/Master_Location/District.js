import React, { useState, useEffect } from 'react';

import feather from 'feather-icons';
import BreadCrumbs from '../../../Breadcrumbs';
import { getDistricts, getStates, addDistrict, updateDistrict, deleteDistrict } from '../../../api';
import Popup from '../../../Popup';
import '../../../css/app.css';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

function PaginationRounded({ count, page, onChange }) {
    return (
        <Stack spacing={2}>
            <Pagination count={count} page={page} onChange={onChange} shape="rounded" />
        </Stack>
    );
}

function District() {
    const [districts, setDistricts] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [newDistrict, setNewDistrict] = useState('');
    const [stateId, setStateId] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [states, setStates] = useState([]);
    const [editDistrictId, setEditDistrictId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [districtToDelete, setDistrictToDelete] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    useEffect(() => {
        fetchDistricts();
        fetchStates();
        feather.replace();

        const interval = setInterval(() => {
            fetchDistricts();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [districts]);

    useEffect(() => {
        setFilteredDistricts(filterDistricts(districts, searchInput));
    }, [districts, searchInput]);

    const filterDistricts = (districts, searchInput) => {
        return districts.filter(district =>
            (typeof district.name === 'string' && district.name.toLowerCase().includes(searchInput.toLowerCase())) ||
            (typeof district.state === 'string' && states.find(state => state.id === district.state)?.name.toLowerCase().includes(searchInput.toLowerCase()))
        );
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const fetchDistricts = () => {
        getDistricts().then(response => {
            setDistricts(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const fetchStates = () => {
        getStates().then(response => {
            setStates(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const handleAddOrEditDistrict = () => {
        const districtData = { name: newDistrict, state: stateId, is_active: isActive };
        if (editDistrictId) {
            updateDistrict(editDistrictId, districtData).then(response => {
                setDistricts(districts.map(d => d.id === editDistrictId ? response.data : d));
                resetForm();
                setShowSuccessPopup(true); // Show success popup
            }).catch(error => {
                console.error(error);
            });
        } else {
            addDistrict(districtData).then(response => {
                setDistricts([...districts, response.data]);
                resetForm();
                setShowSuccessPopup(true); // Show success popup
            }).catch(error => {
                console.error(error);
            });
        }
        setShowPopup(false);
    };

    const handleEditDistrict = (district) => {
        setEditDistrictId(district.id);
        setNewDistrict(district.name);
        setStateId(district.state);
        setIsActive(district.is_active);
        setShowPopup(true);
    };

    const handleDeleteDistrict = (id) => {
        setDistrictToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteDistrict = () => {
        deleteDistrict(districtToDelete)
            .then(() => {
                setDistricts(districts.filter(district => district.id !== districtToDelete));
                setDistrictToDelete(null);
                setDeleteConfirmation(false);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const cancelDeleteDistrict = () => {
        setDistrictToDelete(null);
        setDeleteConfirmation(false);
    };

    const resetForm = () => {
        setNewDistrict('');
        setStateId('');
        setIsActive(true);
        setEditDistrictId(null);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        fetchDistricts();
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
        resetForm();
    };

    const handleSort = (field) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
    };

    const sortedDistricts = [...filteredDistricts].sort((a, b) => {
        if (!sortField) return 0;
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedDistricts = sortedDistricts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const breadcrumbPaths = [
        { name: 'Home' },
        { name: 'master location' },
        { name: 'District' }
    ];

    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <div className="state-select">
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
                <div className="right-corner">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        placeholder="Search District"
                    />
                    <button className="add-button" onClick={handlePopupOpen}>
                        <i data-feather="plus-square"></i>
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>District</th>
                        <th onClick={() => handleSort('state')}>State</th>
                        <th onClick={() => handleSort('is_active')}>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedDistricts.map(district => (
                        <tr key={district.id}>
                            <td>{district.name}</td>
                            <td>{states.find(state => state.id === district.state)?.name}</td>
                            <td>{district.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => handleEditDistrict(district)}>
                                    <i data-feather="edit"></i>
                                </button>
                                <button onClick={() => handleDeleteDistrict(district.id)}>
                                    <i className='trash-icon' data-feather="trash-2"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PaginationRounded count={totalPages} page={currentPage} onChange={handlePageChange} />
            {deleteConfirmation && (
                <Popup isOpen={deleteConfirmation} onClose={cancelDeleteDistrict} title="Confirmation">
                    <p>Are you sure you want to delete this district?</p>
                    <button className="blue-button" onClick={confirmDeleteDistrict}>Yes</button>
                    <button className="blue-button" onClick={cancelDeleteDistrict}>No</button>
                </Popup>
            )}
            <Popup isOpen={showPopup} onClose={handlePopupClose} title={editDistrictId ? 'Edit District' : 'Add District'}>
                <select value={stateId} onChange={(e) => setStateId(e.target.value)}>
                    <option value="">Select State</option>
                    {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    placeholder="District Name"
                />
                <select value={isActive} onChange={(e) => setIsActive(e.target.value === 'true')}>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                </select>
                <button className="blue-button" onClick={handleAddOrEditDistrict} disabled={newDistrict.trim() === '' || !stateId}>
                    {editDistrictId ? 'Update' : 'Submit'}
                </button>
            </Popup>
            {showSuccessPopup && (
                <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                    <p>District has been successfully {editDistrictId ? 'updated' : 'added'}!</p>
                    <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                </Popup>
            )}
        </div>
    );
}

export default District;
