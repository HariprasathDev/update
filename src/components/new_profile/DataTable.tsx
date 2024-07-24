// src/pages/AdminPage.tsx
import React from 'react';
import DataTable from '../../components/DataTablel';

const newProfileColumns = [
  { id: 'ProfileId', label: 'Profile ID', minWidth: 100 },
  { id: 'Gender', label: 'Gender', minWidth: 100 },
  { id: 'Mobile_no', label: 'Mobile No', minWidth: 150 },
  { id: 'EmailId', label: 'Email', minWidth: 150 },
  { id: 'Profile_marital_status', label: 'Marital Status', minWidth: 100 },
  { id: 'Profile_dob', label: 'Date of Birth', minWidth: 100 },
  { id: 'Profile_complexion', label: 'Complexion', minWidth: 100 },
  { id: 'Profile_address', label: 'Address', minWidth: 200 },
  { id: 'Profile_country', label: 'Country', minWidth: 100 },
  { id: 'Profile_state', label: 'State', minWidth: 100 },
  { id: 'Profile_city', label: 'City', minWidth: 100 },
  { id: 'Profile_pincode', label: 'Pincode', minWidth: 100 },
];

const AdminPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">New Registered Profiles</h1>
      <DataTable columns={newProfileColumns} apiEndpoint="http://localhost:8000/api/newprofile_get/" />
    </div>
  );
};

export default AdminPage;
