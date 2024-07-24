import React, { useState, useEffect } from 'react';
import { getCountries, getStates, addState, updateState, deleteState } from '../../../api';
import BreadCrumbs from '../../../Breadcrumbs';
import Popup from '../../../Popup';
import '../../../css/app.css';
import feather from 'feather-icons';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';


function PaginationRounded({ count, page, onChange }) {
    return (
        <Stack spacing={2}>
            <Pagination count={count} page={page} onChange={onChange} shape="rounded" />
        </Stack>
    );
}

function State() {
    const [states, setStates] = useState([]);
    const [newState, setNewState] = useState('');
    const [countryId, setCountryId] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [countries, setCountries] = useState([]);
    const [editStateId, setEditStateId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [stateToDelete, setStateToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    useEffect(() => {
        fetchStates();
        fetchCountries();
        feather.replace();

        const interval = setInterval(() => {
            fetchStates();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const removeDuplicates = (arr, key) => {
        const unique = arr.map(e => e[key])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e]).map(e => arr[e]);
        return unique;
    };

    const fetchStates = () => {
        getStates().then(response => {
            const uniqueStates = removeDuplicates(response.data, 'name');
            setStates(uniqueStates);
        }).catch(error => {
            console.error(error);
        });
    };

    const fetchCountries = () => {
        getCountries().then(response => {
            setCountries(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    useEffect(() => {
        feather.replace();
    }, [states]);

    const handleAddOrEditState = () => {
        const stateData = { name: newState, country: countryId, is_active: isActive };
        if (editStateId) {
            // Update existing state
            updateState(editStateId, stateData).then(response => {
                setStates(states.map(s => s.id === editStateId ? response.data : s));
                resetForm();
                setShowSuccessPopup(true); // Show success popup
            }).catch(error => {
                console.error(error);
            });
        } else {
            // Check for duplicates before adding a new state
            const existingState = states.find(s => s.name.toLowerCase() === newState.toLowerCase() && s.country === countryId);
            if (existingState) {
                alert('This state already exists in the selected country.');
                return;
            }

            // Add new state
            addState(stateData).then(response => {
                setStates([...states, response.data]);
                resetForm();
                setShowSuccessPopup(true); // Show success popup
            }).catch(error => {
                console.error(error);
            });
        }
        setShowPopup(false);
    };

    const handleEditState = (state) => {
        setEditStateId(state.id);
        setNewState(state.name);
        setCountryId(state.country);
        setIsActive(state.is_active);
        setShowPopup(true);
    };

    const handleDeleteState = (id) => {
        setStateToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteState = () => {
        deleteState(stateToDelete)
            .then(() => {
                setStates(states.filter(state => state.id !== stateToDelete));
                setStateToDelete(null);
                setDeleteConfirmation(false);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const cancelDeleteState = () => {
        setStateToDelete(null);
        setDeleteConfirmation(false);
    };

    const resetForm = () => {
        setNewState('');
        setCountryId('');
        setIsActive(true);
        setEditStateId(null);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        fetchStates();
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
        resetForm();
    };

    const handleSort = (field, direction) => {
        setSortField(field);
        setSortDirection(direction);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const filteredStates = states.filter(state =>
        state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (countries.find(country => country.id === state.country)?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const sortedStates = [...filteredStates].sort((a, b) => {
        if (!sortField) return 0;
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedStates = sortedStates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredStates.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const isFormValid = newState.trim() !== '' && countryId !== '';

    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'master location', },
        { name: 'state', }
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
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search State"
                    />
                    <button className="add-button" onClick={handlePopupOpen}>
                        <i data-feather="plus-square"></i>
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name', sortDirection === 'asc' ? 'desc' : 'asc')}>State {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('country', sortDirection === 'asc' ? 'desc' : 'asc')}>Country {sortField === 'country' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('is_active', sortDirection === 'asc' ? 'desc' : 'asc')}>Status {sortField === 'is_active' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedStates.map(state => (
                        <tr key={state.id}>
                            <td>{state.name}</td>
                            <td>{countries.find(country => country.id === state.country)?.name}</td>
                            <td>{state.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => handleEditState(state)}>
                                    <i data-feather="edit"></i>
                                </button>
                                <button onClick={() => handleDeleteState(state.id)}>
                                    <i className='trash-icon' data-feather="trash-2"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PaginationRounded count={totalPages} page={currentPage} onChange={handlePageChange} />
            {deleteConfirmation && (
                <Popup isOpen={deleteConfirmation} onClose={cancelDeleteState} title="Confirmation">
                    <p>Are you sure you want to delete this state?</p>
                    <button className="blue-button" onClick={confirmDeleteState}>Yes</button>
                    <button className="blue-button" onClick={cancelDeleteState}>No</button>
                </Popup>
            )}
            <Popup isOpen={showPopup} onClose={handlePopupClose} title={editStateId ? 'Edit State' : 'Add State'}>
                <label>
                    Country:
                </label>
                <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                    <option value="">Select Country</option>
                    {countries.map(country => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <div>
                    State:
                    <input
                        type="text"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        placeholder="State Name"
                    />
                </div>
                <label>
                    Active:
                </label>
                <select
                    value={isActive ? 'active' : 'inactive'}
                    onChange={(e) => setIsActive(e.target.value === 'active')}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button className="blue-button" onClick={handleAddOrEditState} disabled={!isFormValid}>
                    {editStateId ? 'Update' : 'Submit'}
                </button>
            </Popup>
            {showSuccessPopup && (
                <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                    <p>State has been successfully {editStateId ? 'updated' : 'added'}!</p>
                    <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                </Popup>
            )}
        </div>
    );
}

export default State;
