import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import Popup from '../../../Popup';
import '../../../css/app.css';
import feather from 'feather-icons';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import BreadCrumbs from '../../../Breadcrumbs';

const DasaBalanceList = () => {
    const [dasaBalances, setDasaBalances] = useState([]);
    const [newDasaBalance, setNewDasaBalance] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [dasaBalanceToDelete, setDasaBalanceToDelete] = useState(null);
    const [editDasaBalanceId, setEditDasaBalanceId] = useState(null);
    const [editedDasaBalance, setEditedDasaBalance] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        fetchDasaBalances();
        const interval = setInterval(() => {
            fetchDasaBalances();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feather.replace();
    }, [dasaBalances, showPopup, deleteConfirmation]);

    const fetchDasaBalances = async () => {
        const response = await axios.get('http://localhost:8000/api/accounts/dasa-balances/');
        setDasaBalances(response.data);
    };

    const addDasaBalance = async () => {
        await axios.post('http://localhost:8000/api/accounts/dasa-balances/', { balance: newDasaBalance });
        setNewDasaBalance('');
        setShowPopup(false);
        fetchDasaBalances();
        setShowSuccessPopup(true);
    };

    const deleteDasaBalance = async (id) => {
        await axios.delete(`http://localhost:8000/api/accounts/dasa-balances/${id}/`);
        fetchDasaBalances();
    };

    const handleDeleteDasaBalance = (id) => {
        setDasaBalanceToDelete(id);
        setDeleteConfirmation(true);
    };

    const confirmDeleteDasaBalance = () => {
        deleteDasaBalance(dasaBalanceToDelete);
        setDasaBalanceToDelete(null);
        setDeleteConfirmation(false);
    };

    const cancelDeleteDasaBalance = () => {
        setDasaBalanceToDelete(null);
        setDeleteConfirmation(false);
    };

    const handleEditDasaBalance = (id, balance) => {
        setEditDasaBalanceId(id);
        setEditedDasaBalance(balance);
        setShowPopup(true);
    };

    const updateDasaBalance = async () => {
        await axios.put(`http://localhost:8000/api/accounts/dasa-balances/${editDasaBalanceId}/`, { balance: editedDasaBalance });
        setEditDasaBalanceId(null);
        setEditedDasaBalance('');
        setShowPopup(false);
        fetchDasaBalances();
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

    const filteredDasaBalances = dasaBalances.filter(dasaBalance =>
        dasaBalance.balance.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedDasaBalances = [...filteredDasaBalances].sort((a, b) => {
        if (a.balance < b.balance) return sortOrder === 'asc' ? -1 : 1;
        if (a.balance > b.balance) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedDasaBalances = sortedDasaBalances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(filteredDasaBalances.length / itemsPerPage);

    // Function to check if the input field is empty
    const isInputEmpty = () => {
        return (editDasaBalanceId ? editedDasaBalance.trim() : newDasaBalance.trim()) === '';
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setEditDasaBalanceId(null);
        setNewDasaBalance('');
        setEditedDasaBalance('');
    };
    const breadcrumbPaths = [
        { name: 'Home', },
        { name: 'Horoscope Master' },
        { name: 'dasa balance', }
    ];
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };


    return (
        <div>
            
            <div className="state-select">
                <Sidebar />
                <div className="main-content">
                    <Navbar />
                    <BreadCrumbs paths={breadcrumbPaths} />
                    <div className="header-buttons">
                        <div className="left-corner">
                            <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
                                <option value={20}>20</option>
                                <option value={40}>40</option>
                                <option value={80}>80</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Dasa Balance"
                            />
                            <button className="add-button" onClick={() => setShowPopup(true)}>
                                <i data-feather="plus-square"></i>
                            </button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Balance {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDasaBalances.map(dasaBalance => (
                                <tr key={dasaBalance.id}>
                                    <td>{dasaBalance.balance}</td>
                                    <td>
                                        <button onClick={() => handleEditDasaBalance(dasaBalance.id, dasaBalance.balance)}>
                                            <i data-feather="edit"></i>
                                        </button>
                                        <button onClick={() => handleDeleteDasaBalance(dasaBalance.id)}>
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
            </div>
            {deleteConfirmation && (
                <Popup isOpen={deleteConfirmation} onClose={cancelDeleteDasaBalance} title="Confirmation">
                    <p>Are you sure you want to delete this dasa balance?</p>
                    <button className="blue-button" onClick={confirmDeleteDasaBalance}>Yes</button>
                    <button className="blue-button" onClick={cancelDeleteDasaBalance}>No</button>
                </Popup>
            )}
            <Popup isOpen={showPopup} onClose={handlePopupClose} title={editDasaBalanceId ? "Edit Dasa Balance" : "Add Dasa Balance"}>
                <input
                    type="text"
                    value={editDasaBalanceId ? editedDasaBalance : newDasaBalance}
                    onChange={(e) => editDasaBalanceId ? setEditedDasaBalance(e.target.value) : setNewDasaBalance(e.target.value)}
                    placeholder="Dasa Balance"
                />
                <button className="blue-button" onClick={editDasaBalanceId ? updateDasaBalance : addDasaBalance} disabled={isInputEmpty()}>{editDasaBalanceId ? "Update" : "Submit"}</button>
            </Popup>
            {showSuccessPopup && (
                    <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                        <p>Marital status has been successfully {editDasaBalanceId ? 'updated' : 'added'}!</p>
                        <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                    </Popup>
                )}
        </div>
    );
};

export default DasaBalanceList;
