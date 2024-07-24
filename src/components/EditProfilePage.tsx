// src/pages/EditProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/EditProfilePage.css';

const EditProfilePage: React.FC = () => {
  const { ContentId } = useParams<{ ContentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const refreshData = location.state?.refreshData;
  const [profile, setProfile] = useState<any | null>(null);
  const [familyDetails, setFamilyDetails] = useState<any | null>(null);
  const [educationDetails, setEducationDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const profileFields = [
    'ProfileId',
    'Gender',
    'Mobile_no',
    'EmailId',
    'Profile_marital_status',
    'Profile_dob',
    'Profile_complexion',
    'Profile_address',
    'Profile_country',
    'Profile_state',
    'Profile_city',
    'Profile_pincode',
  ];

  const familyFields = [
    'father_name',
    'father_occupation',
    'mother_name',
    'mother_occupation',
    'family_name',
    'about_self',
    'hobbies',
    'blood_group',
    'Pysically_changed',
    'property_details',
    'property_worth',
    'suya_gothram',
    'uncle_gothram',
    'ancestor_origin',
    'about_family',
  ];

  const educationFields = [
    'highest_education',
    'ug_degeree',
    'about_edu',
    'anual_income',
    'actual_income',
    'work_country',
    'work_state',
    'work_pincode',
    'career_plans',
  ];

  useEffect(() => {
    if (!ContentId) {
      console.error('ContentId is undefined');
      setError('ContentId is undefined');
      setLoading(false);
      return;
    }

    console.log('Fetching profile for ContentId:', ContentId);

    const fetchDetails = async () => {
      try {
        const profileResponse = await axios.get(`http://localhost:8000/api/logindetails/${ContentId}/`);
        setProfile(profileResponse.data);

        const profileId = profileResponse.data.ProfileId;
        if (profileId) {
          const familyResponse = await axios.get(`http://localhost:8000/api/profile-familydetails/${profileId}/`);
          setFamilyDetails(familyResponse.data);

          const educationResponse = await axios.get(`http://localhost:8000/api/profile-edudetails/${profileId}/`);
          setEducationDetails(educationResponse.data);
        } else {
          setError('ProfileId is missing from profile data');
        }
      } catch (error) {
        setError('Error fetching profile, family, or education details data');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [ContentId]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFamilyDetails({ ...familyDetails, [name]: value });
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEducationDetails({ ...educationDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8000/api/logindetails/${ContentId}/`, profile);

      if (profile?.ProfileId) {
        await axios.put(`http://localhost:8000/api/profile-familydetails/${profile.ProfileId}/`, familyDetails);
        await axios.put(`http://localhost:8000/api/profile-edudetails/${profile.ProfileId}/`, educationDetails);
      }

      if (refreshData) {
        refreshData();
      }
      navigate('/admin'); // Redirect back to admin page after saving
    } catch (error) {
      setError('Error saving profile, family, or education details data');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/logindetails/${ContentId}/`);

      if (profile?.ProfileId) {
        await axios.delete(`http://localhost:8000/api/profile-familydetails/${profile.ProfileId}/`);
        await axios.delete(`http://localhost:8000/api/profile-edudetails/${profile.ProfileId}/`);
      }

      if (refreshData) {
        refreshData();
      }
      navigate('/admin'); // Redirect back to admin page after deleting
    } catch (error) {
      setError('Error deleting profile, family, or education details data');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      <div className="form-container">
        {profile && profileFields.map(key => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type="text"
              value={profile[key] || ''}
              onChange={handleProfileChange}
            />
          </div>
        ))}
        {familyDetails && familyFields.map(key => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type="text"
              value={familyDetails[key] || ''}
              onChange={handleFamilyChange}
            />
          </div>
        ))}
        {educationDetails && educationFields.map(key => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type="text"
              value={educationDetails[key] || ''}
              onChange={handleEducationChange}
            />
          </div>
        ))}
      </div>
      <div className="button">
        <button onClick={handleSave} className="btn btn-primary">Save</button>
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        <button onClick={() => navigate('/admin')} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

export default EditProfilePage;
