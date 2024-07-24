
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Sidebar';
import Navbar from '../../../Navbar';
import '../../../css/tableView.css';
import Popup from '../../../Popup';
import { Link } from 'react-router-dom';
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

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                        Profile ID {sortOrder === 'asc' ? '▲' : '▼'}
                                    </th>
                                    <th>S.No</th>
                                    <th>Profile For</th>
                                    <th>Gender</th>
                                    <th>Mobile No</th>
                                    <th>Email ID</th>
                                    {/* <th>Password</th> */}
                                    <th>Profile Name</th>
                                    <th>Marital Status</th>
                                    <th>Date of Birth</th>
                                    <th>Height</th>
                                    <th>Complexion</th>
                                    {/* <th>OTP</th> */}
                                    <th>Stage</th>
                                    <th>Admin Permission</th>
                                    <th>Payment</th>
                                    <th>Payment Expire</th>
                                    <th>Payment Type</th>
                                    <th>Date Of Join</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedDetails.map(detail => (
                                    <tr key={detail.ContentId}>
                                        <td>{detail.ProfileId}</td>
                                        <td>{detail.ContentId}</td>
                                        <td>{detail.Profile_for}</td>
                                        <td>{detail.Gender}</td>
                                        <td>{detail.Mobile_no}</td>
                                        <td>{detail.EmailId}</td>
                                        {/* <td>{detail.Password}</td> */}
                                        <td>{detail.Profile_name}</td>
                                        <td>{detail.Profile_marital_status}</td>
                                        <td>{detail.Profile_dob}</td>
                                        <td>{detail.Profile_height}</td>
                                        <td>{detail.Profile_complexion}</td>
                                        {/* <td>{detail.Otp}</td> */}
                                        <td>{detail.Stage}</td>
                                        <td>{detail.AdminPermission}</td>
                                        <td>{detail.Payment}</td>
                                        <td>{detail.PaymentExpire}</td>
                                        <td>{detail.PaymentType}</td>
                                        <td>{detail.DateOfJoin}</td>
                                        <td>
                                            <button onClick={() => handleAccept(detail.ContentId)}>
                                                <i data-feather="check-circle"></i>
                                            </button>
                                            <button onClick={() => handleDecline(detail.ContentId)}>
                                                <i data-feather="x-circle"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
