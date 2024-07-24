import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';
import BreadCrumbs from '../../../Breadcrumbs';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import '../../../css/app.css'; 
import Popup from '../../../Popup';

const AnnualIncomeList = () => {
    const [annualIncomes, setAnnualIncomes] = useState([]);
    const [newAnnualIncome, setNewAnnualIncome] = useState('');
    const [editAnnualIncomeData, setEditAnnualIncomeData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default items per page
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [incomeToDelete, setIncomeToDelete] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup
    useEffect(() => {
        fetchAnnualIncomes();
        const interval = setInterval(() => {
            fetchAnnualIncomes();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [annualIncomes, showAddPopup, showEditPopup, deleteConfirmation]); // Replace icons after render

    const fetchAnnualIncomes = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/annual-incomes/');
        setAnnualIncomes(response.data);
    };

    const addAnnualIncome = async () => {
        await axios.post('http://localhost:8000/api/accounts/annual-incomes/', { income: newAnnualIncome });
        setNewAnnualIncome('');
        setShowAddPopup(false);
        fetchAnnualIncomes();
        setShowSuccessPopup(true); // Show success popup
    };

    const handleDeleteIncome = (id) => {
        setIncomeToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteIncome = async () => {
        await axios.delete(`http://localhost:8000/api/accounts/annual-incomes/${incomeToDelete}/`);
        setDeleteConfirmation(false);
        setIncomeToDelete(null);
        fetchAnnualIncomes();
    };

    const cancelDeleteIncome = () => {
        setDeleteConfirmation(false);
        setIncomeToDelete(null);
    };

    const editAnnualIncome = async () => {
        await axios.put(`http://localhost:8000/api/accounts/annual-incomes/${editAnnualIncomeData.id}/`, editAnnualIncomeData);
        setEditAnnualIncomeData(null);
        setShowEditPopup(false);
        fetchAnnualIncomes();
        setShowSuccessPopup(true); // Show success popup
    };

    const handleEditClick = (annualIncome) => {
        setEditAnnualIncomeData(annualIncome);
        setShowEditPopup(true);
    };

    const handleCancelEdit = () => {
        setEditAnnualIncomeData(null);
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

    const sortedIncomes = [...annualIncomes].sort((a, b) => {
        if (a.income < b.income) return sortOrder === 'asc' ? -1 : 1;
        if (a.income > b.income) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Filter annual incomes based on search query
    const filteredAnnualIncomes = sortedIncomes.filter(annualIncome =>
        annualIncome.income.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate the filtered annual incomes
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedAnnualIncomes = filteredAnnualIncomes.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(filteredAnnualIncomes.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'profile master' },
        { name: 'Annual Income', }
    ];
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <div className="state-select"> {/* Apply the layout class */}
            <Sidebar /> {/* Assuming this is your sidebar component */}
            <div className="main-content">
                <Navbar className="component" /> {/* Assuming this is your navbar component */}
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
                            className='marital-input'
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search Annual Income"
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
                                Income {sortOrder === 'asc' ? '▲' : '▼'}
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAnnualIncomes.map(annualIncome => (
                            <tr key={annualIncome.id}>
                                <td>{annualIncome.income}</td>
                                <td>
                                    <button onClick={() => handleEditClick(annualIncome)}>
                                        <i data-feather="edit"></i>
                                    </button>
                                    <button onClick={() => handleDeleteIncome(annualIncome.id)}>
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
                    <Popup isOpen={deleteConfirmation} onClose={cancelDeleteIncome} title="Confirmation">
                        <p>Are you sure you want to delete this income?</p>
                        <button className="blue-button" onClick={confirmDeleteIncome}>Yes</button>
                        <button className="blue-button" onClick={cancelDeleteIncome}>No</button>
                    </Popup>
                )}
                <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)} title="Add Annual Income">
                    <input
                        type="number"
                        value={newAnnualIncome}
                        onChange={(e) => setNewAnnualIncome(e.target.value)}
                        placeholder="Income"
                    />
                    <button
                        className="blue-button"
                        onClick={addAnnualIncome}
                        disabled={!newAnnualIncome.trim()} // Disable if the input is empty
                    >
                        Submit
                    </button>
                </Popup>
                <Popup isOpen={showEditPopup} onClose={handleCancelEdit} title="Edit Annual Income">
                    {editAnnualIncomeData && (
                        <>
                            <input
                                type="number"
                                value={editAnnualIncomeData.income}
                                onChange={(e) => setEditAnnualIncomeData({ ...editAnnualIncomeData, income: e.target.value })}
                                placeholder="Income"
                            />
                            <button
                                className="blue-button"
                                onClick={editAnnualIncome}
                                disabled={!editAnnualIncomeData.income.trim()} // Disable if the input is empty
                            >
                                Update
                            </button>
                            
                        </>
                    )}
                </Popup>
                {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editAnnualIncomeData ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
            </div>
        </div>
    );
};

export default AnnualIncomeList;
