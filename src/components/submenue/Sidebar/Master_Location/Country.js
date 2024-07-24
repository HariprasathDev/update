import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import feather from 'feather-icons';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import BreadCrumbs from '../../../Breadcrumbs';
import { getCountries, addCountry, updateCountry, deleteCountry } from '../../../api';
import Popup from '../../../Popup';
import '../../../css/app.css';

function Country() {
    const [countries, setCountries] = useState([]);
    const [newCountry, setNewCountry] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [editCountryId, setEditCountryId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [showImportPopup, setShowImportPopup] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileToImport, setFileToImport] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const containerRef = useRef(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchCountries();
        feather.replace();

        const interval = setInterval(() => {
            fetchCountries();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [countries]);

    useEffect(() => {
        setFilteredCountries(filterCountries(countries, searchQuery));
    }, [countries, searchQuery]);

    const filterCountries = (countries, searchQuery) => {
        return countries.filter(country =>
            country.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const fetchCountries = () => {
        getCountries().then(response => {
            setCountries(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const handleAddOrEditCountry = () => {
        if (!newCountry.trim()) {
            setFormError('Country name cannot be empty');
            return;
        }
        setFormError('');

        const countryData = { name: newCountry, is_active: isActive };
        if (editCountryId) {
            updateCountry(editCountryId, countryData).then(response => {
                setCountries(countries.map(c => c.id === editCountryId ? response.data : c));
                resetForm();
                setShowSuccessPopup(true);
            }).catch(error => {
                console.error(error);
            });
        } else {
            const existingCountry = countries.find(c => c.name.toLowerCase() === newCountry.toLowerCase());
            if (existingCountry) {
                setFormError('Country already exists');
                return;
            }

            addCountry(countryData).then(response => {
                setCountries([...countries, response.data]);
                resetForm();
                setShowSuccessPopup(true);
            }).catch(error => {
                console.error(error);
            });
        }
        setShowPopup(false);
    };

    const handleEditCountry = (country) => {
        setEditCountryId(country.id);
        setNewCountry(country.name);
        setIsActive(country.is_active);
        setShowPopup(true);
    };

    const handleDeleteCountry = (countryId) => {
        setCountryToDelete(countryId);
        setDeleteConfirmation(true);
    };

    const confirmDeleteCountry = () => {
        deleteCountry(countryToDelete)
            .then(() => {
                setCountries(countries.filter(country => country.id !== countryToDelete));
                setCountryToDelete(null);
                setDeleteConfirmation(false);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const cancelDeleteCountry = () => {
        setCountryToDelete(null);
        setDeleteConfirmation(false);
    };

    const resetForm = () => {
        setNewCountry('');
        setIsActive(true);
        setEditCountryId(null);
        setFormError('');
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        fetchCountries();
    };

    const handlePopupOpen = () => {
        console.log("Opening Popup"); // Debug log
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

    const handleSort = (field, direction) => {
        setSortField(field);
        setSortDirection(direction);
    };

    const sortedCountries = [...filteredCountries].sort((a, b) => {
        if (!sortField) return 0;
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedCountries = sortedCountries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

    const handleImport = (event) => {
        setFileToImport(event.target.files[0]);
        setShowImportPopup(true);
    };

    const confirmImport = () => {
        if (!fileToImport) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    setUploadError('The selected file is empty or not formatted correctly.');
                    return;
                }

                const totalCountries = jsonData.length;
                let processedCountries = 0;

                jsonData.forEach((country, index) => {
                    // Check if the country already exists
                    const existingCountry = countries.find(c => c.name.toLowerCase() === country.name.toLowerCase());
                    if (existingCountry) {
                        processedCountries++;
                        setUploadProgress((processedCountries / totalCountries) * 100);
                    } else {
                        addCountry(country).then(response => {
                            setCountries(prevCountries => [...prevCountries, response.data]);
                            processedCountries++;
                            setUploadProgress((processedCountries / totalCountries) * 100);
                        }).catch(error => {
                            console.error(error);
                            setUploadError('Error uploading file to the database. Please try again.');
                            setUploadProgress(0); // Reset progress on error
                        });
                    }
                });
            } catch (error) {
                setUploadError('The selected file is not a valid Excel file.');
                console.error(error);
            }
        };

        reader.onerror = () => {
            setUploadError('Failed to read the file. Please try again.');
        };

        reader.readAsArrayBuffer(fileToImport);
        setShowImportPopup(false);
    };

    const handleExport = async () => {
        try {
            const options = {
                types: [
                    {
                        description: 'Excel Files',
                        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
                    },
                ],
            };

            const handle = await window.showSaveFilePicker(options);
            const writableStream = await handle.createWritable();

            const ws = XLSX.utils.json_to_sheet(countries);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Countries");

            const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

            await writableStream.write(wbout);
            await writableStream.close();
        } catch (error) {
            console.error('Error during export:', error);
        }

    };
    const breadcrumbPaths = [
        { name: 'Home' },
        { name: 'master location' },
        { name: 'country' }
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
                        <option value={10}>20</option>
                        <option value={20}>40</option>
                        <option value={30}>80</option>
                        <option value={50}>100</option>
                    </select>
                </div>
                <div className='right-corner'>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search Country"
                    />
                    <button className="add-button" onClick={handlePopupOpen}>
                        <i data-feather="plus-square"></i>
                    </button>
                    <input
                        type="file"
                        onChange={handleImport}
                        accept=".xlsx, .xls"
                        style={{ display: 'none' }}
                        id="file-input"
                    />
                    {/* <label htmlFor="file-input" className="add-button">
                        <i data-feather="upload"></i>
                    </label>
                    <button className="add-button" onClick={handleExport}>
                        <i data-feather="download"></i>
                    </button> */}
                </div>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress-box">
                    <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}>
                        {`Uploading: ${uploadProgress.toFixed(2)}%`}
                    </div>
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name', sortDirection === 'asc' ? 'desc' : 'asc')}>
                            Country List {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => handleSort('is_active', sortDirection === 'asc' ? 'desc' : 'asc')}>
                            Status {sortField === 'is_active' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCountries.map(country => (
                        <tr key={country.id}>
                            <td>{country.name}</td>
                            <td>{country.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => handleEditCountry(country)}>
                                    <i data-feather="edit"></i>
                                </button>
                                <button onClick={() => handleDeleteCountry(country.id)}>
                                    <i className='trash-icon' data-feather="trash-2"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <Stack spacing={2}>
                    <Typography>Page: {currentPage}</Typography>
                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                </Stack>
            </div>
            {deleteConfirmation && (
                <Popup isOpen={deleteConfirmation} onClose={cancelDeleteCountry} title="Confirmation">
                    <p>Are you sure you want to delete this country?</p>
                    <button className="blue-button" onClick={confirmDeleteCountry}>Yes</button>
                    <button className="blue-button" onClick={cancelDeleteCountry}>No</button>
                </Popup>
            )}
            {showPopup && (
                <Popup isOpen={showPopup} onClose={handlePopupClose} title={editCountryId ? 'Edit Country' : 'Add Country'}>
                    {formError && <p className="error">{formError}</p>}
                    <input
                        type="text"
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        placeholder="Country Name"
                    />
                    <select
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value === 'true')}
                    >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                    <button className="blue-button" onClick={handleAddOrEditCountry}>
                        {editCountryId ? 'Update' : 'Submit'}
                    </button>
                </Popup>
            )}
            {showImportPopup && (
                <Popup isOpen={showImportPopup} onClose={() => setShowImportPopup(false)} title="Confirm Import">
                    <p>Are you sure you want to import this file?</p>
                    <button className="blue-button" onClick={confirmImport}>Yes</button>
                    <button className="blue-button" onClick={() => setShowImportPopup(false)}>No</button>
                </Popup>
            )}
            {uploadError && (
                <Popup isOpen={!!uploadError} onClose={() => setUploadError(null)} title="Upload Error">
                    <p>{uploadError}</p>
                    <button className="blue-button" onClick={() => setUploadError(null)}>Close</button>
                </Popup>
            )}
            {showSuccessPopup && (
                <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                    <p>District has been successfully {editCountryId ? 'updated' : 'added'}!</p>
                    <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                </Popup>
            )}
        </div>
    );
}

export default Country;
