import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import '../../../css/tableView.css';
import Popup from '../../../Popup';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import feather from 'feather-icons';
import BreadCrumbs from '../../../Breadcrumbs';

const LoginDetailsTempList = () => {
    const [loginDetails, setLoginDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showDeclinePopup, setShowDeclinePopup] = useState(false); 

    useEffect(() => {
        fetchLoginDetails();
    }, []);

    useEffect(() => {
        feather.replace();
    }, [loginDetails, currentPage]);

    const fetchLoginDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/logindetails_temp/');
            const filteredData = response.data.filter(detail => detail.status !== 0);
            setLoginDetails(filteredData);
        } catch (error) {
            console.error("Error fetching login details:", error);
        }
    };

    const handleAccept = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/logindetails_temp/${id}/accept/`);
            fetchLoginDetails();
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Error accepting profile:", error);
        }
    };

    const handleDecline = async (id) => {
        try {
            await axios.patch(`http://localhost:8000/api/logindetails_temp/${id}/`, { status: 0 });
            fetchLoginDetails();
            setShowDeclinePopup(true);
        } catch (error) {
            console.error("Error declining profile:", error);
        }
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

    const sortedDetails = [...loginDetails].sort((a, b) => {
        if (a.ProfileId < b.ProfileId) return sortOrder === 'asc' ? -1 : 1;
        if (a.ProfileId > b.ProfileId) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredDetails = sortedDetails.filter(detail =>
        detail.ProfileId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedDetails = filteredDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);

    const breadcrumbPaths = [
        { name: 'Home' },
        { name: 'profile' }
    ];

    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
    };

    const handleCloseDeclinePopup = () => {
        setShowDeclinePopup(false);
    };

    return (
        <div className="state-select">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div>
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
                        <div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search Profile ID"
                            />
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                    Profile ID {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDetails.map(detail => (
                                <tr key={detail.ContentId}>
                                    <td>{detail.ProfileId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-container">
                        <Stack spacing={2}>
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                        </Stack>
                    </div>
                </div>
            
                <Popup isOpen={showSuccessPopup} onClose={handleCloseSuccessPopup} title="Success">
                    <p>Login details accepted successfully!</p>
                    <button className="blue-button" onClick={handleCloseSuccessPopup}>Close</button>
                </Popup>
                <Popup isOpen={showDeclinePopup} onClose={handleCloseDeclinePopup} title="Declined">
                    <p>Profile has been declined!</p>
                    <button className="blue-button" onClick={handleCloseDeclinePopup}>Close</button>
                </Popup>
            </div>
        </div>
    );
};

export default LoginDetailsTempList;
