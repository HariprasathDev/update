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


const HighestEducationList = () => {
    const [highestEducations, setHighestEducations] = useState([]);
    const [newHighestEducation, setNewHighestEducation] = useState('');
    const [editHighestEducationData, setEditHighestEducationData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default items per page
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [educationToDelete, setEducationToDelete] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup
   
    useEffect(() => {
        fetchHighestEducations();
        const interval = setInterval(() => {
            fetchHighestEducations();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [highestEducations, showAddPopup, showEditPopup, deleteConfirmation]); // Replace icons after render

    const fetchHighestEducations = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/highest-educations/');
        setHighestEducations(response.data);
    };

    const addHighestEducation = async () => {
        await axios.post('http://localhost:8000/api/accounts/highest-educations/', { degree: newHighestEducation });
        setNewHighestEducation('');
        setShowAddPopup(false);
        fetchHighestEducations();
        setShowSuccessPopup(true); // Show success popup
    };

    const deleteHighestEducation = async (id) => {
        setEducationToDelete(id);
        setDeleteConfirmation(true);
        setShowSuccessPopup(true); // Show success popup
    };

    const confirmDeleteEducation = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/highest-educations/${educationToDelete}/`);
        setDeleteConfirmation(false);
        setEducationToDelete(null);
        fetchHighestEducations();
    };

    const cancelDeleteEducation = () => {
        setDeleteConfirmation(false);
        setEducationToDelete(null);
    };

    const editHighestEducation = async () => {
        await axios.put(`http://localhost:8000/api/accounts/highest-educations/${editHighestEducationData.id}/`, editHighestEducationData);
        setEditHighestEducationData(null);
        setShowEditPopup(false);
        fetchHighestEducations();
        setShowSuccessPopup(true); // Show success popup
    };

    const handleEditClick = (highestEducation) => {
        setEditHighestEducationData(highestEducation);
        setShowEditPopup(true);
    };

    const handleCancelEdit = () => {
        setEditHighestEducationData(null);
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

    const sortedHighestEducations = [...highestEducations].sort((a, b) => {
        if (a.degree < b.degree) return sortOrder === 'asc' ? -1 : 1;
        if (a.degree > b.degree) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Filter highest educations based on search query
    const filteredHighestEducations = sortedHighestEducations.filter(highestEducation =>
        highestEducation.degree.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate the filtered highest educations
    const paginatedHighestEducations = filteredHighestEducations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(filteredHighestEducations.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'highest education', }
    ];
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };



    return (
        <div>
            <div className="state-select"> {/* Apply the layout class */}
                <Sidebar /> {/* Assuming this is your sidebar component */}
                <div className="main-content">
                    <Navbar className="component" /> {/* Assuming this is your navbar component */}
                    <BreadCrumbs paths={breadcrumbPaths} />
                    {/* Add select dropdown for items per page */}
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
                                placeholder="Search Highest Education"
                            />
                            <button onClick={() => setShowAddPopup(true)}> <i data-feather="plus-square"></i></button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Highest Education {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHighestEducations.map(highestEducation => (
                                <tr key={highestEducation.id}>
                                    <td>{highestEducation.degree}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(highestEducation)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => deleteHighestEducation(highestEducation.id)}>
                                            <i className='trash-icon' data-feather="trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            shape="rounded"
                        />
                    </Stack>
                </div>
            </div>
            {/* Add Highest Education Popup */}
            <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)} title="Add Highest Education">
                <input
                    type="text"
                    value={newHighestEducation}
                    onChange={(e) => setNewHighestEducation(e.target.value)}
                    placeholder="Degree"
                />
                <button 
                    onClick={addHighestEducation} 
                    disabled={!newHighestEducation.trim()}
                >
                    Submit
                </button>
            </Popup>
            {/* Edit Highest Education Popup */}
            <Popup isOpen={showEditPopup} onClose={handleCancelEdit} title="Edit Highest Education">
                {editHighestEducationData && (
                    <>
                        <input
                            type="text"
                            value={editHighestEducationData.degree}
                            onChange={(e) => setEditHighestEducationData({ ...editHighestEducationData, degree: e.target.value })}
                            placeholder="Degree"
                        />
                        <button 
                            onClick={editHighestEducation} 
                            disabled={!editHighestEducationData.degree.trim()}
                        >
                            Update
                        </button>
                       
                    </>
                )}
            </Popup>
            {/* Delete Confirmation Popup */}
            <Popup isOpen={deleteConfirmation} onClose={cancelDeleteEducation} title="Confirmation">
                <p>Are you sure you want to delete this highest education?</p>
                <button onClick={confirmDeleteEducation}>Yes</button>
                <button onClick={cancelDeleteEducation}>No</button>
            </Popup>
            {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editHighestEducationData ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
        </div>
    );
};

export default HighestEducationList;
