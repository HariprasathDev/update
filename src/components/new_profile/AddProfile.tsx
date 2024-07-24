import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '../Fromfield/Inputfield';
import RasiGrid from '../HoroDetails/RasiGrid';
import AmsamGrid from '../HoroDetails/AmsamGrid';
import MatchingStars from '../PartnerPreference/MatchingStars';
import { ChangeEvent } from 'react';

interface MaritalStatusOption {
  marital_sts_id: number;
  marital_sts_name: string;
}

interface ComplexionOption {
  complexion_id: number;
  complexion_description: string;
}


interface CountryOption {
  country_id: number;
  country_name: string;
}


interface StateOption {
  state_id: number;
  state_name: string;
}

interface HighesEducation {
  education_id: number;
  education_description: string;
}

interface Ugdegree {
  degree_id: number;
  degree_description: string;
}


interface AnnualIncome {
  income_id: number;
  income_description: string;
}

interface Occupation {
  occupation_id: number;
  occupation_description: string;
}

interface PropertyWorth {
  property_id: number;
  property_description: string;
}

interface BirthStar {
  birth_id: number;
  birth_star: string;
}


interface Rasi {
  rasi_id: number;
  rasi_name: string;
}


interface Lagnam {
  didi_id: number;
  didi_description: string;
}


interface FamilyType {
  family_id: number;
  family_description: string;
}

interface FamilyStatus {
  family_status_id: number;
  family_status_name: string;
  family_status_description: string;
}

interface FamilyValue {
  family_value_id: number;
  family_value_name: string;
}



const ProfileForm = () => {
  const initialDetails = {
    temp_profileid: '',
    Gender: '',
    Mobile_no: '',
    EmailId: '',
    Password: '',
    Profile_marital_status: '',
    Profile_dob: '',
    Profile_complexion: '',
    Profile_address: '',
    Profile_country: '',
    Profile_state: '',
    Profile_city: '',
    Profile_pincode: '',
    Profile_whatsapp: '',
    Profile_alternate_mobile: '',
  };

  const initialFamilyDetails = {
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    family_name: '',
    about_self: '',
    hobbies: '',
    blood_group: '',
    Pysically_changed: '',
    property_details: '',
    property_worth: '',
    suya_gothram: '',
    uncle_gothram: '',
    ancestor_origin: '',
    about_family: '',
  };

  const initialEducationDetails = {
    highest_education: '',
    ug_degeree: '',
    about_edu: '',
    anual_income: '',
    actual_income: '',
    work_country: '',
    work_state: '',
    work_pincode: '',
    career_plans: '',
  };

  const initialPartnerPreferences = {
    pref_age_differences: '',
    from_month: '',
    from_year: '',
    age_pref: '',
    pref_height_from: '',
    pref_education: '',
    pref_profession: '',
    pref_chevvai: '',
    pref_anual_income: '',
    pref_ragukethu: '',
    pref_marital_status: '',
    pref_foreign_intrest: '',
    family_value_pref: '',
    place_of_stay_pref: '',
    city_pref: '',
  };

  const [rasiContent, setRasiContent] = useState([]);
  const [amsamContent, setAmsamContent] = useState([]);
  const [selectedMaritalStatuses, setSelectedMaritalStatuses] = useState<
    string[]
  >([]);

  const [selectedStarIds, setSelectedStarIds] = useState<string[]>([]);


  const [basicDetails, setBasicDetails] = useState(initialDetails);
  // const [annualIncome, setAnnualIncome] = useState<AnnualIncome[]>([]);
  const [selectedAnnualIncomes, setSelectedAnnualIncomes] = useState<string[]>(
    [],
  );
  const [familyDetails, setFamilyDetails] = useState(initialFamilyDetails);
  const [educationDetails, setEducationDetails] = useState(
    initialEducationDetails,
  );
  const [partnerPreferences, setPartnerPreferences] = useState(
    initialPartnerPreferences,
  );
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [highestEducations, setHighestEducations] = useState([]);
  // const [ugDegrees, setUgDegrees] = useState([]);
  // const [annualIncomes, setAnnualIncomes] = useState([]);
  const [isPartnerPreferencesOpen, setIsPartnerPreferencesOpen] =
    useState(false);
  const [formKey, setFormKey] = useState(0);
  const [matchStars, setMatchStars] = useState<MatchingStar[][]>([]);

  const onRasiContentsChange = (newContent: React.SetStateAction<never[]>) => {
    setRasiContent(newContent);
  };

  const onAmsamContentsChange = (newContent: React.SetStateAction<never[]>) => {
    setAmsamContent(newContent);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'Mobile_no':
        return value.length === 10 && /^[0-9]+$/.test(value)
          ? ''
          : 'Invalid mobile number';
      case 'EmailId':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email';
      case 'Password':
        return value.length >= 6
          ? ''
          : 'Password must be at least 6 characters';
      case 'Profile_pincode':
        return /^[0-9]{6}$/.test(value) ? '' : 'Invalid pincode';
      case 'father_name':
      case 'mother_name':
      case 'family_name':
      case 'about_self':
      case 'hobbies':
      case 'blood_group':
      case 'property_details':
      case 'suya_gothram':
      case 'uncle_gothram':
      case 'ancestor_origin':
      case 'about_family':
      case 'age_pref':
        return value.trim() === '' ? 'This field is required' : '';
      case 'father_occupation':
      case 'mother_occupation':
      case 'property_worth':
        return value === '' ? 'This field is required' : '';
      case 'Pysically_changed':
        return value === '' ? 'This field is required' : '';
      case 'highest_education':
      case 'ug_degeree':
      case 'about_edu':
      case 'anual_income':
      case 'work_country':
      case 'work_state':
      case 'work_pincode':
      case 'career_plans':
        return value === '' ? 'This field is required' : '';
      default:
        return value.trim() === '' ? 'This field is required' : '';
    }
  };
  const handleCheckboxChange = (updatedIds: string[]) => {
    setSelectedStarIds(updatedIds);
  };

  const handleInputChange = (e, section = 'basicDetails') => {
    const { name, value } = e.target;
    if (section === 'basicDetails') {
      setBasicDetails({ ...basicDetails, [name]: value });
    } else if (section === 'familyDetails') {
      setFamilyDetails({ ...familyDetails, [name]: value });
    } else if (section === 'educationDetails') {
      setEducationDetails({ ...educationDetails, [name]: value });
    } else if (section === 'partnerPreferences') {
      setPartnerPreferences({ ...partnerPreferences, [name]: value });
    }
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    let isValid = true;

    Object.keys(basicDetails).forEach((key) => {
      const error = validateField(key, basicDetails[key]);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    });

    Object.keys(familyDetails).forEach((key) => {
      const error = validateField(key, familyDetails[key]);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    });

    Object.keys(educationDetails).forEach((key) => {
      const error = validateField(key, educationDetails[key]);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    });

    Object.keys(partnerPreferences).forEach((key) => {
      const error = validateField(key, partnerPreferences[key]);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(formErrors);

    if (!isValid) {
      return;
    }

    try {
      const loginDetailsResponse = await axios.post(
        'http://localhost:8000/api/logindetails/',
        basicDetails,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const profileId = loginDetailsResponse.data.ProfileId;

      await axios.post(
        'http://localhost:8000/api/profile-familydetails/',
        {
          profile_id: profileId,
          ...familyDetails,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      await axios.post(
        'http://localhost:8000/api/profile-edudetails/',
        {
          profile_id: profileId,
          ...educationDetails,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      await axios.post(
        'http://localhost:8000/api/profile-partner-pref/',
        {
          profile_id: profileId,
          ...partnerPreferences,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      alert('Profile created successfully');
      setBasicDetails(initialDetails); // Reset the form
      setFamilyDetails(initialFamilyDetails); // Reset family details form
      setEducationDetails(initialEducationDetails); // Reset education details form
      setPartnerPreferences(initialPartnerPreferences); // Reset partner preferences form
      setFormKey((prevKey) => prevKey + 1); // Update the formKey to trigger re-render
    } catch (error) {
      console.error('Error creating profile:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(`Error creating profile: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(
          'Error creating profile. Please check the console for more details.',
        );
      }
    }
  };



  /* API CALL START */

  //Basic
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatusOption[]>([]);
  const [complexionOptions, setComplexionOptions] = useState<ComplexionOption[]>([]);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);


  //Educational
  const [highestEdu, setHighestEdu] = useState<HighesEducation[]>([]);
  const [ugdegree, setUgdegree] = useState<Ugdegree[]>([]);
  const [annualIncome, setAnnualIncome] = useState<AnnualIncome[]>([]);


  //Family

  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [propertyworth, setPropertyworth] = useState<PropertyWorth[]>([]);


  const [familyTypes, setFamilyTypes] = useState<FamilyType[]>([]);
  const [selectedFamilyType, setSelectedFamilyType] = useState<number | null>(null);


  const [familyStatus, setFamilyStatus] = useState<FamilyStatus[]>([]);
  const [selectedFamilyStatus, setSelectedFamilyStatus] = useState<number | null>(null);

  const [familyValue, setFamilyValue] = useState<FamilyValue[]>([]);
  const [selectedFamilyValue, setSelectedFamilyValue] = useState<number | null>(null);






  const [selectedSisterValue, setSelectedSisterValue] = useState<string>('');
  const [sisterMarriedValues, setSisterMarriedValues] = useState<string[]>([]);
  const [selectedSisterMarriedValue, setSelectedSisterMarriedValue] = useState<string>('');

  const [selectedBrotherValue, setSelectedBrotherValue] = useState<string>('');
  const [brotherMarriedValues, setBrotherMarriedValues] = useState<string[]>([]);
  const [selectedBrotherMarriedValue, setSelectedBrotherMarriedValue] = useState<string>('');




  //HoroScope

  const [birthStar, setBirthStar] = useState<BirthStar[]>([]);
  const [rasi, setRasiOptions] = useState<Rasi[]>([]);
  const [lagnam, setLagnamOptions] = useState<Lagnam[]>([]);




  //Maritalstatus
  useEffect(() => {
    const fetchMaritalStatuses = async () => {
      try {
        const response = await axios.post<{
          [key: string]: MaritalStatusOption;
        }>('http://103.214.132.20:8000/auth/Get_Marital_Status/');
        const options = Object.values(response.data);
        setMaritalStatuses(options);
      } catch (error) {
        console.error('Error fetching marital statuses:', error);
      }
    };

    fetchMaritalStatuses();
  }, []);


  //complextion
  useEffect(() => {
    const fetchComplexionStatus = async () => {
      try {
        const response = await axios.post("http://103.214.132.20:8000/auth/Get_Complexion/");
        const options = Object.values(response.data) as ComplexionOption[];
        setComplexionOptions(options);
      } catch (error) {
        console.error("Error fetching complexion options:", error);
      }
    };
    fetchComplexionStatus();
  }, []);



  //country
  useEffect(() => {
    const fetchCountryStatus = async () => {
      try {
        const response = await axios.post("http://103.214.132.20:8000/auth/Get_Country/");
        const options = Object.values(response.data) as CountryOption[];
        setCountryOptions(options);
      } catch (error) {
        console.error("Error fetching country options:", error);
      }
    };
    fetchCountryStatus();
  }, []);



  const handleInputChange1 = (e: ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    setSelectedCountryId(countryId);
    console.log('Selected Country ID:', countryId);
    setErrors({});
  };


  //state
  useEffect(() => {
    const fetchStateStatus = async () => {
      try {
        if (selectedCountryId) {
          const response = await axios.post(
            'http://103.214.132.20:8000/auth/Get_State/',
            { country_id: selectedCountryId }
          );
          const options = Object.values(response.data) as StateOption[];
          setStateOptions(options);
        }
      } catch (error) {
        console.error('Error fetching state options:', error);
        setErrors({ Profile_country: 'Error fetching states' });
      }
    };

    fetchStateStatus();
  }, [selectedCountryId]);



  //HighestEducation
  useEffect(() => {
    const fetchHighestEdu = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Highest_Education/`);
        const options = Object.values(response.data) as HighesEducation[];
        setHighestEdu(options);
      } catch (error) {
        console.error("Error fetching Highest Education options:", error);
      }
    };
    fetchHighestEdu();
  }, []);


  //UGDegree
  useEffect(() => {
    const fetchUgDegree = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Ug_Degree/`);
        const options = Object.values(response.data) as Ugdegree[];
        setUgdegree(options);
      } catch (error) {
        console.error("Error fetching UG Degree  options:", error);
      }
    };
    fetchUgDegree();
  }, []);



  //AnnualIncome
  useEffect(() => {
    const fetchAnnualIncome = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Annual_Income/`);
        const options = Object.values(response.data) as AnnualIncome[];
        setAnnualIncome(options);
      } catch (error) {
        console.error("Error fetching Annual Income  options:", error);
      }
    };
    fetchAnnualIncome();
  }, []);


  //Occupation
  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Parent_Occupation/`);
        const options = Object.values(response.data) as Occupation[];
        setOccupations(options);
      } catch (error) {
        console.error("Error fetching marital status options:", error);
      }
    };
    fetchOccupations();
  }, []);



  //PropertyWorth
  useEffect(() => {
    const fetchPropertyworth = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Property_Worth/`);
        const options = Object.values(response.data) as PropertyWorth[];
        setPropertyworth(options);
      } catch (error) {
        console.error("Error fetching property worth options:", error);
      }
    };
    fetchPropertyworth();
  }, []);


  //Birthstar
  useEffect(() => {
    const fetchBirthStar = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Birth_Star/`, { state_id: " " });
        const options = Object.values(response.data) as BirthStar[];
        setBirthStar(options);
      } catch (error) {
        console.error("Error fetching birth star options:", error);
      }
    };
    fetchBirthStar();
  }, []);



  //Rasi
  const [selectedBirthStarId, setSelectedBirthStarId] = useState<string>('');

  const handleBirthStarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedBirthStarId(selectedId);
    console.log('Selected Birth Star ID:', selectedId);
  };


  useEffect(() => {
    if (selectedBirthStarId) {
      const fetchStateStatus = async () => {
        try {
          const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Rasi/`, { birth_id: selectedBirthStarId });
          const options = Object.values(response.data) as Rasi[];
          setRasiOptions(options);
        } catch (error) {
          console.error("Error fetching rasi options:", error);
        }
      };
      fetchStateStatus();
    }
  }, [selectedBirthStarId]);




  //Lagnam

  useEffect(() => {
    const fetchLagnam = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_Lagnam_Didi/`);
        const options = Object.values(response.data) as Lagnam[];
        setLagnamOptions(options);
      } catch (error) {
        console.error("Error fetching Laganam options:", error);
      }
    };
    fetchLagnam();
  }, []);



  //FamilyType

  const handleTypeSelection = (typeId: number) => {
    setSelectedFamilyType(typeId);
    // Perform any other actions based on selected type
  };


  useEffect(() => {
    const fetchFamilyTypes = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_FamilyType/`);
        const data = response.data;
        const familyTypesArray = Object.values(data) as FamilyType[];
        setFamilyTypes(familyTypesArray);
      } catch (error) {
        console.error("Error fetching family types:", error);
      }
    };

    fetchFamilyTypes();
  }, []);


  //familystatus

  const handleTypeSelectionStatus = (typeId: number) => {
    setSelectedFamilyStatus(typeId);
    // Perform any other actions based on selected type
  };

  useEffect(() => {
    const fetchFamilyStatus = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_FamilyStatus/`);
        const data = response.data;
        const familyTypesArray = Object.values(data) as FamilyStatus[];
        setFamilyStatus(familyTypesArray);
      } catch (error) {
        console.error("Error fetching family status:", error);
      }
    };

    fetchFamilyStatus();
  }, []);



  //FamilyValue

  const handleTypeSelectionValue = (typeId: number) => {
    setSelectedFamilyValue(typeId);
    // Perform any other actions based on selected type
  };

  useEffect(() => {
    const fetchFamilyValue = async () => {
      try {
        const response = await axios.post(`http://103.214.132.20:8000/auth/Get_FamilyValue/`);
        const data = response.data;
        const familyTypesArray = Object.values(data) as FamilyValue[];
        setFamilyValue(familyTypesArray);
      } catch (error) {
        console.error("Error fetching family value:", error);
      }
    };

    fetchFamilyValue();
  }, []);




  //brother


  const handleBrotherValueSelection = (value: string) => {
    setSelectedBrotherValue(value);
    setSelectedBrotherMarriedValue(''); // Reset selected Brother Married value

    // Define the array of Brother Married values based on selected Brother value
    let values: string[] = [];
    switch (value) {
      case '1':
        values = ['0', '1'];
        break;
      case '2':
        values = ['0', '1', '2'];
        break;
      case '3':
        values = ['0', '1', '2', '3'];
        break;
      case '4':
        values = ['0', '1', '2', '3', '4'];
        break;
      case '5+':
        values = ['0', '1', '2', '3', '4', '5+'];
        break;
      default:
        values = [];
    }

    setBrotherMarriedValues(values);
  };


  //sister
  const handleSisterValueSelection = (value: string) => {
    setSelectedSisterValue(value);
    setSelectedSisterMarriedValue(''); // Reset selected Sister Married value

    // Define the array of Sister Married values based on selected Sister value
    let values: string[] = [];
    switch (value) {
      case '1':
        values = ['0', '1'];
        break;
      case '2':
        values = ['0', '1', '2'];
        break;
      case '3':
        values = ['0', '1', '2', '3'];
        break;
      case '4':
        values = ['0', '1', '2', '3', '4'];
        break;
      case '5+':
        values = ['0', '1', '2', '3', '4', '5+'];
        break;
      default:
        values = [];
    }

    setSisterMarriedValues(values);
  };









  /*Form API ENDS*/



  const storedBirthStar = 25;
  console.log(storedBirthStar);
  const storedGender = 'female';

  useEffect(() => {
    if (storedBirthStar && storedGender) {
      const fetchMatchingStars = async () => {
        try {
          const response = await axios.post(
            `http://103.214.132.20:8000/auth/Get_Matchstr_Pref/`,
            {
              birth_star_id: storedBirthStar,
              gender: storedGender,
            },
          );

          const matchCountArrays: MatchingStar[][] = Object.values(
            response.data,
          ).map((matchCount: any) => matchCount);
          setMatchStars(matchCountArrays);
          console.log('Response from server:', matchCountArrays);
        } catch (error) {
          console.error('Error fetching matching star options:', error);
        }
      };
      fetchMatchingStars();
    }
  }, [storedBirthStar, storedGender]);
  console.log(matchStars);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/api/countries/',
        );
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/api/states/',
        );
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchHighestEducations = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/api/highest-educations/',
        );
        setHighestEducations(response.data);
      } catch (error) {
        console.error('Error fetching highest educations:', error);
      }
    };

    fetchHighestEducations();




    const fetchAnnualIncomes = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/api/annual-incomes/',
        );
        setAnnualIncomes(response.data);
      } catch (error) {
        console.error('Error fetching annual incomes:', error);
      }
    };

    fetchAnnualIncomes();
  }, []);



  const [isBasicDetailsOpen, setIsBasicDetailsOpen] = useState(true);
  const [isFamilyDetailsOpen, setIsFamilyDetailsOpen] = useState(true);
  const [isEducationDetailsOpen, setIsEducationDetailsOpen] = useState(true);
  const [isHoroscopeDetailsOpen, setIsHoroscopeDetailsOpen] = useState(true);
  const [isPartnerPreferenceOpen, setIsPartnerPreferenceOpen] = useState(true);
  const [isFeaturePreferenceOpen, setIsFeaturePreferenceOpen] = useState(true);
  const [isUploadImagesOpen, setIsUploadImagesOpen] = useState(true);

  const toggleSection1 = () => {
    setIsBasicDetailsOpen(!isBasicDetailsOpen);
  }

  const toggleSection2 = () => {
    setIsFamilyDetailsOpen(!isFamilyDetailsOpen);
  }
  const toggleSection3 = () => {
    setIsEducationDetailsOpen(!isEducationDetailsOpen);
  }
  const toggleSection4 = () => {
    setIsHoroscopeDetailsOpen(!isHoroscopeDetailsOpen);
  }
  const toggleSection5 = () => {
    setIsPartnerPreferenceOpen(!isPartnerPreferenceOpen);
  }
  const toggleSection6 = () => {
    setIsFeaturePreferenceOpen(!isFeaturePreferenceOpen);
  }
  const toggleSection7 = () => {
    setIsUploadImagesOpen(!isUploadImagesOpen);
  }


  // Initialize state: 
  // 0: Family Image (array of arrays for each button)
  // 1: Horoscope Image (single list)
  // 2: ID Proof (single list)
  const [selectedFiles, setSelectedFiles] = useState<string[][]>([
    Array(10).fill([]), // Family Image: 10 buttons
    [], // Horoscope Image: Single list
    []  // ID Proof: Single list
  ]);

  // Handle file change
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number,
    buttonIndex?: number
  ) => {
    const files = Array.from(event.target.files || []);
    const newSelectedFiles = [...selectedFiles] as string[][];

    if (buttonIndex !== undefined) {
      // For Family Image: Append new files to existing ones for the specified button
      const existingFiles = newSelectedFiles[sectionIndex][buttonIndex] || [];
      newSelectedFiles[sectionIndex][buttonIndex] = [
        ...existingFiles,
        ...files.map(file => file.name)
      ].slice(0, 10); // Limit to 10 files
    } else {
      // For Horoscope Image and ID Proof: Append new files to the existing list
      newSelectedFiles[sectionIndex] = [
        ...newSelectedFiles[sectionIndex],
        ...files.map(file => file.name)
      ].slice(0, 10); // Limit to 10 files
    }

    setSelectedFiles(newSelectedFiles);
  };

  // Trigger file input click
  const triggerFileInput = (inputId: string) => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    }
  };

  // Define sections for file upload
  const sections = [
    { label: 'Family Image', sectionIndex: 0, isMultiple: true },
    { label: 'Horoscope Image', sectionIndex: 1, isMultiple: false },
    { label: 'ID Proof', sectionIndex: 2, isMultiple: false }
  ];

  return (
    <div>
      <form className="" onSubmit={onSubmit} key={formKey}>
        <div className='bg-white p-5 mb-10 rounded shadow-md'>
          <h4 className="text-red-600 flex row items-center justify-between text-xl font-semibold text-black dark:text-white cursor-pointer  after-red-line::after" onClick={toggleSection1}>
            Basic Details
            <svg className={`fill-current transform ${isBasicDetailsOpen ? 'rotate-180' : ''}`} width={"20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path></svg>
          </h4>
          {isBasicDetailsOpen && (
            <div className="flex flex-col gap-5 pt-2">
              <div className="flex w-full flex-row gap-4">
                <div className="w-2/4">
                  <Input
                    label={'Name'}
                    name="temp_profileid"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.temp_profileid && (
                    <span className="text-red-500">{errors.temp_profileid}</span>
                  )}
                </div>
                <div className="w-2/4 py-1">
                  <label className="block text-black font-medium mb-1">
                    Select Gender
                  </label>
                  <input
                    type="radio"
                    value="Male"
                    name="Gender"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  <label className="text-black px-4">Male</label>
                  <input
                    type="radio"
                    value="Female"
                    name="Gender"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  <label className="text-black px-4">Female</label>
                  {errors.Gender && (
                    <span className="text-red-500">{errors.Gender}</span>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-row gap-4">
                <div className="w-2/4">
                  <Input
                    label={'Mobile Number'}
                    name="Mobile_no"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.Mobile_no && (
                    <span className="text-red-500">{errors.Mobile_no}</span>
                  )}
                </div>
                <div className="w-2/4">
                  <Input
                    label={'Email'}
                    name="EmailId"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.EmailId && (
                    <span className="text-red-500">{errors.EmailId}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-2/4">
                  <Input
                    label={'Whatsapp Number'}
                    name="Profile_whatsapp"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.Profile_whatsapp && (
                    <span className="text-red-500">{errors.Profile_whatsapp}</span>
                  )}
                </div>
                <div className="w-2/4">
                  <Input
                    label={'Alternate Mobile Number'}
                    name="Profile_alternate_mobile"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.Profile_alternate_mobile && (
                    <span className="text-red-500">
                      {errors.Profile_alternate_mobile}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'Create Password'}
                    name="Password"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.Password && (
                    <span className="text-red-500">{errors.Password}</span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Select your Marital Status
                  </label>
                  <select
                    name="Profile_marital_status"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  >
                    <option value="" selected disabled>
                      Select your Marital Status
                    </option>
                    {maritalStatuses.map((option) => (
                      <option
                        key={option.marital_sts_id}
                        value={option.marital_sts_id}
                      >
                        {option.marital_sts_name}
                      </option>
                    ))}
                  </select>
                  {errors.Profile_marital_status && (
                    <span className="text-red-500">
                      {errors.Profile_marital_status}
                    </span>
                  )}
                </div>
              </div>

              {
                <div className="flex w-full flex-row gap-4">
                  <div className="w-2/4">
                    <Input
                      label={'Date of Birth'}
                      type={'date'}
                      name="Profile_dob"
                      onChange={(e) => handleInputChange(e, 'basicDetails')}
                    />
                    {errors.Profile_dob && (
                      <span className="text-red-500">{errors.Profile_dob}</span>
                    )}
                  </div>

                  <div className="w-2/4">
                    <label className="block text-black font-medium mb-1">
                      Select your complexion
                    </label>
                    <select
                      id="complexion"
                      name="Profile_complexion"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      onChange={(e) => handleInputChange(e, 'basicDetails')}
                    >
                      <option value="" selected disabled>
                        Select your complexion
                      </option>
                      {complexionOptions.map((option) => (
                        <option
                          key={option.complexion_id}
                          value={option.complexion_id}
                        >
                          {option.complexion_description}
                        </option>
                      ))}
                    </select>
                    {errors.Profile_complexion && (
                      <span className="text-red-500">
                        {errors.Profile_complexion}
                      </span>
                    )}
                  </div>
                </div>
              }

              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'Address'}
                    name="Profile_address"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.Profile_address && (
                    <span className="text-red-500">{errors.Profile_address}</span>
                  )}
                </div>


                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Country
                  </label>
                  <select
                    name="Profile_country"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange1(e, 'basicDetails')}
                  >
                    <option value="" >
                      -- Select your Country --
                    </option>
                    {countryOptions.map((option) => (
                      <option key={option.country_id} value={option.country_id}>
                        {option.country_name}
                      </option>
                    ))}
                  </select>

                  {errors.Profile_country && (
                    <span className="text-red-500">{errors.Profile_country}</span>
                  )}
                </div>
              </div>


              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    State (Based on country selection)
                  </label>
                  <select
                    name="Profile_state"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  >
                    <option value="">Select your state</option>
                    <option value="" selected disabled>
                      -- Select State --
                    </option>
                    {stateOptions.map((option) => (
                      <option key={option.state_id} value={option.state_id}>
                        {option.state_name}
                      </option>
                    ))}
                  </select>
                  {errors.Profile_state && (
                    <span className="text-red-500">{errors.Profile_state}</span>
                  )}
                </div>






                <div className="w-full">
                  <Input
                    label={'Profile City'}
                    name="Profile_address"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.Profile_city && (
                    <span className="text-red-500">{errors.Profile_city}</span>
                  )}
                </div>







              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'Pincode'}
                    type={'text'}
                    name="Profile_pincode"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                  {errors.Profile_pincode && (
                    <span className="text-red-500">{errors.Profile_pincode}</span>
                  )}
                </div>
              </div>
              <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                For Admin Verification
              </h4>
              <div className="flex w-full flex-row gap-4">
                <div className="w-2/4">
                  <Input
                    label={'Son Mobile Number'}
                    name=""
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                </div>
                <div className="w-2/4">
                  <Input
                    label={'Son Daughter Email'}
                    name=""
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>





        <div className='bg-white p-5 mb-10 rounded shadow-md '>
          <h4 className="text-red-600 flex row items-center justify-between text-xl font-semibold text-black dark:text-white cursor-pointer  after-red-line::after" onClick={toggleSection2}>
            Family Details
            <svg className={`fill-current transform ${isFamilyDetailsOpen ? 'rotate-180' : ''}`} width={"20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path></svg>
          </h4>
          {isFamilyDetailsOpen && (
            <div className="flex flex-col gap-5 pt-2">
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'Father name'}
                    name="father_name"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.father_name && (
                    <span className="text-red-500">{errors.father_name}</span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Father Occupation
                  </label>
                  <select
                    name="father_occupation"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  >
                    <option value="" disabled selected>
                      -- Select Occupation --
                    </option>
                    {occupations.map((occupation) => (
                      <option key={occupation.occupation_id} value={occupation.occupation_description}>
                        {occupation.occupation_description}
                      </option>
                    ))}
                  </select>
                  {errors.father_occupation && (
                    <span className="text-red-600">{errors.father_occupation}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'Mother name'}
                    name="mother_name"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.mother_name && (
                    <span className="text-red-500">{errors.mother_name}</span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Mother Occupation
                  </label>
                  <select
                    name="mother_occupation"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  >
                    <option value="" disabled selected>
                      -- Select Occupation --
                    </option>
                    {occupations.map((occupation) => (
                      <option key={occupation.occupation_id} value={occupation.occupation_description}>
                        {occupation.occupation_description}
                      </option>
                    ))}
                  </select>
                  {errors.mother_occupation && (
                    <span className="text-red-600">{errors.mother_occupation}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'Family name'}
                    type={'text'}
                    name="family_name"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.family_name && (
                    <span className="text-red-500">{errors.family_name}</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    label={'About Myself'}
                    type={'text'}
                    name="about_self"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.about_self && (
                    <span className="text-red-500">{errors.about_self}</span>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'My Hobbies'}
                    type={'text'}
                    name="hobbies"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.hobbies && (
                    <span className="text-red-500">{errors.hobbies}</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    label={'Blood Group'}
                    type={'text'}
                    name="blood_group"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.blood_group && (
                    <span className="text-red-500">{errors.blood_group}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full py-1">
                  <label className="block text-black font-medium mb-1">
                    Physically Challenged
                  </label>
                  <input
                    type="radio"
                    value="Yes"
                    name="Pysically_changed"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  <label className="text-black px-4">Yes</label>
                  <input
                    type="radio"
                    value="No"
                    name="Pysically_changed"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  <label className="text-black px-4">No</label>
                  {errors.Pysically_changed && (
                    <span className="text-red-600">
                      Physically Challenged is required
                    </span>
                  )}
                </div>




                <div className="w-full">
                  <Input
                    label={'Property Details'}
                    type={'text'}
                    name="property_details"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.property_details && (
                    <span className="text-red-500">{errors.property_details}</span>
                  )}
                </div>

              </div>


              <div className="flex w-full flex-row gap-4">
                <div className="w-full py-1">
                  <label className="block text-black font-medium mb-1">
                    Family Type
                  </label>
                  <div className="w-full inline-flex rounded">
                    {familyTypes.map((type) => (
                      <button
                        key={type.family_id}
                        type="button"
                        className={`w-full px-5 py-3 text-sm font-medium border ${selectedFamilyType === type.family_id ? 'bg-blue-500 text-white' : ''
                          }`}
                        onClick={() => handleTypeSelection(type.family_id)}
                      >
                        {type.family_description}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full py-1">
                  <label className="block text-black font-medium mb-1">
                    Family Value
                  </label>
                  <div className="w-full inline-flex rounded">
                    {familyValue.map((type) => (
                      <button
                        key={type.family_value_id}
                        type="button"
                        className={`w-full px-5 py-3 text-sm font-medium border ${selectedFamilyValue === type.family_value_id ? 'bg-blue-500 text-white' : ''
                          }`}
                        onClick={() => handleTypeSelectionValue(type.family_value_id)}
                      >
                        {type.family_value_name}
                      </button>
                    ))}
                  </div>
                </div>


              </div>




              <div className="w-full py-1">
                <label className="block text-black font-medium mb-1">
                  Family Status
                </label>
                <div className="w-full inline-flex rounded">
                  {familyStatus.map((type) => (
                    <button
                      key={type.family_status_id}
                      type="button"
                      className={`w-full px-5 py-3 text-sm font-medium border ${selectedFamilyStatus === type.family_status_id ? 'bg-blue-500 text-white' : ''
                        }`}
                      onClick={() => handleTypeSelectionStatus(type.family_status_id)}
                    >
                      {type.family_status_name}
                    </button>
                  ))}
                </div>
              </div>




              <div className="flex w-full flex-row gap-4">
                <div className="w-2/4 py-1">
                  <div className="mb-4">
                    <label className="block text-black font-medium mb-1">
                      Brother
                    </label>
                    <div className="w-full inline-flex rounded">
                      {['0', '1', '2', '3', '4', '5+'].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`w-full px-5 py-3 text-sm font-medium border ${selectedBrotherValue === value ? 'bg-blue-500 text-white' : ''
                            }`}
                          onClick={() => handleBrotherValueSelection(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {parseInt(selectedBrotherValue) > 0 && (
                  <div className="mb-4 w-2/4">
                    <label className="block text-black font-medium mb-1">
                      Brother Married
                    </label>
                    <div className="w-full inline-flex rounded">
                      {brotherMarriedValues.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`w-full px-5 py-3 text-sm font-medium border ${selectedBrotherMarriedValue === value ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                          onClick={() => setSelectedBrotherMarriedValue(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>





              <div className="flex w-full flex-row gap-4">

                <div className="w-2/4 mb-4">
                  <label className="block text-black font-medium mb-1">
                    Sister
                  </label>
                  <div className="w-full inline-flex rounded">
                    {['0', '1', '2', '3', '4', '5+'].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`w-full px-5 py-3 text-sm font-medium border ${selectedSisterValue === value ? 'bg-blue-500 text-white' : ''
                          }`}
                        onClick={() => handleSisterValueSelection(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {parseInt(selectedSisterValue) > 0 && (
                  <div className=" w-2/4 mb-4">
                    <label className="block text-black font-medium mb-1">
                      Sister Married
                    </label>
                    <div className="w-full inline-flex rounded">
                      {sisterMarriedValues.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`w-full px-5 py-3 text-sm font-medium border ${selectedSisterMarriedValue === value ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                          onClick={() => setSelectedSisterMarriedValue(value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>















              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Property Worth
                  </label>
                  <select
                    name="property_worth"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  >
                    <option value="" disabled>
                      -- Select Property Worth --
                    </option>
                    {propertyworth.map(property => (
                      <option key={property.property_id} value={property.property_id}>
                        {property.property_description}
                      </option>
                    ))}
                  </select>
                  {errors.property_worth && (
                    <span className="text-red-600">Property Worth is required</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    label={'Suya Gothram'}
                    name="suya_gothram"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.suya_gothram && (
                    <span className="text-red-500">{errors.suya_gothram}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <Input
                    label={'Uncle Gothram'}
                    type={'text'}
                    name="uncle_gothram"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.uncle_gothram && (
                    <span className="text-red-500">{errors.uncle_gothram}</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    label={'Ancestor Origin'}
                    type={'text'}
                    name="ancestor_origin"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  />
                  {errors.ancestor_origin && (
                    <span className="text-red-500">{errors.ancestor_origin}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    About my Family
                  </label>
                  <textarea
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    name="about_family"
                    onChange={(e) => handleInputChange(e, 'familyDetails')}
                  ></textarea>
                  {errors.about_family && (
                    <span className="text-red-600">
                      About my Family is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>




        <div className='bg-white p-5 mb-10 rounded shadow-md'>
          <h4 className="text-red-600 flex row items-center justify-between text-xl font-semibold text-black dark:text-white cursor-pointer  after-red-line::after" onClick={toggleSection3}>
            Education Details
            <svg className={`fill-current transform ${isEducationDetailsOpen ? 'rotate-180' : ''}`} width={"20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path></svg>
          </h4>
          {isEducationDetailsOpen && (
            <div className="flex flex-col gap-5 pt-2">
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Highest Education Level *
                  </label>
                  <select
                    name="highest_education"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'educationDetails')}
                  >
                    <option value="" disabled selected>
                      -- Select your Highest Education Level --
                    </option>
                    {highestEdu.map((option) => (
                      <option key={option.education_id} value={option.education_id}>
                        {option.education_description}
                      </option>
                    ))}
                  </select>
                  {errors.highest_education && (
                    <span className="text-red-500">{errors.highest_education}</span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    UG Degree (Only if masters selected in highest education)
                  </label>
                  <select
                    name="ug_degeree"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'educationDetails')}
                  >
                    <option value="">Select education level</option>
                    {ugdegree.map((education) => (
                      <option key={education.degree_id} value={education.degree_description}>
                        {education.degree_description}
                      </option>
                    ))}
                  </select>
                  {errors.ug_degeree && (
                    <span className="text-red-500">{errors.ug_degeree}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">
                <Input
                  label={'About your Education *'}
                  name="about_edu"
                  onChange={(e) => handleInputChange(e, 'educationDetails')}
                />
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Annual Income
                  </label>
                  <select
                    name="anual_income"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'educationDetails')}
                  >
                    <option value="">Annual Income</option>
                    {annualIncome.map((education) => (
                      <option key={education.income_id} value={education.income_description}>
                        {education.income_description}
                      </option>
                    ))}
                  </select>
                  {errors.anual_income && (
                    <span className="text-red-500">{errors.anual_income}</span>
                  )}
                </div>
              </div>

              <div className="flex w-2/4 flex-row gap-4">
                <Input
                  label={'Actual Income'}
                  name="actual_income"
                  onChange={(e) => handleInputChange(e, 'educationDetails')}
                />
              </div>

              <div className="mt-3">
                <h1 className="block text-black font-medium mb-1">Profession</h1>

                <div className="w-full inline-flex rounded">
                  {[
                    'Employed',
                    'Business',
                    'Student',
                    'Not Working',
                    'Not Mentioned',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="w-full px-5 py-3 text-sm font-medium border"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Location */}
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Work Location
              </h4>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Country
                  </label>
                  <select
                    name="work_country"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange1(e, 'educationDetails')}
                  >
                    <option value="" >
                      -- Select your Country --
                    </option>
                    {countryOptions.map((option) => (
                      <option key={option.country_id} value={option.country_id}>
                        {option.country_name}
                      </option>
                    ))}
                  </select>

                  {errors.work_country && (
                    <span className="text-red-500">{errors.work_country}</span>
                  )}
                </div>


                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    State (Based on country selection)
                  </label>
                  <select
                    name="work_state"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'educationDetails')}
                  >
                    <option value="">Select your state</option>
                    <option value="" selected disabled>
                      -- Select State --
                    </option>
                    {stateOptions.map((option) => (
                      <option key={option.state_id} value={option.state_id}>
                        {option.state_name}
                      </option>
                    ))}
                  </select>
                  {errors.work_state && (
                    <span className="text-red-500">{errors.work_state}</span>
                  )}
                </div>
              </div>



              <div className="flex w-full flex-row gap-4">
                <div className="flex w-full flex-row gap-4">
                  <Input
                    label={'Pincode (Based on Country Selection)'}
                    name="work_pincode"
                    onChange={(e) => handleInputChange(e, 'educationDetails')}
                  />
                </div>
                <div className="flex w-full flex-row gap-4">
                  <div className="w-full">
                    <label className="block text-black font-medium mb-1">
                      Career Plans / Notes
                    </label>
                    <textarea
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      name="career_plans"
                      onChange={(e) => handleInputChange(e, 'educationDetails')}
                    ></textarea>
                    {errors.career_plans && (
                      <span className="text-red-500">{errors.career_plans}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Horoscope Details */}

        <div className='bg-white p-5 mb-10 rounded shadow-md'>
          <h4 className="text-red-600 flex row items-center justify-between text-xl font-semibold text-black dark:text-white cursor-pointer  after-red-line::after" onClick={toggleSection4}>
            Horoscope Details
            <svg className={`fill-current transform ${isHoroscopeDetailsOpen ? 'rotate-180' : ''}`} width={"20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path></svg>
          </h4>
          {isHoroscopeDetailsOpen && (
            <>
              <div className="flex flex-col gap-5 pt-2">
                <div className="flex w-full flex-row gap-4">
                  <Input type={'time'} label={'Time of Birth'} />
                  <Input label={'Place of Birth'} />
                </div>

                <div className="flex w-full flex-row gap-4">
                  <div className='w-full'>
                    <label htmlFor="birthStar" className="block text-black font-medium mb-1">
                      Birth Star
                    </label>
                    <select
                      id="birthStar"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      onChange={handleBirthStarChange}
                      value={selectedBirthStarId}
                    >
                      <option value="" disabled>
                        -- Select your Birth Star --
                      </option>
                      {birthStar.map((option) => (
                        <option key={option.birth_id} value={option.birth_id}>
                          {option.birth_star}
                        </option>
                      ))}
                      {/* Add more static options as needed */}
                    </select>
                    {/* Remove errors handling */}
                  </div>



                  <div className='w-full'>
                    <label htmlFor="rasi" className='block text-black font-medium mb-1'>Rasi</label>
                    <select
                      id="rasi"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                    >
                      <option value="" selected disabled>
                        -- Select your Rasi --
                      </option>
                      {rasi.map((option) => (
                        <option key={option.rasi_id} value={option.rasi_id}>
                          {option.rasi_name}
                        </option>
                      ))}
                      {/* Add more static options as needed */}
                    </select>
                    {/* Remove errors handling */}
                  </div>
                </div>
                <div>
                </div>


                <div className="flex w-full flex-row gap-4">
                  <div className='w-full'>
                    <label htmlFor="lagnam" className="block text-black font-medium mb-1">
                      lagnam / Didi
                    </label>
                    <select
                      id="lagnam"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                    >
                      <option value="" selected disabled>
                        -- Select your lagnam / Didi --
                      </option>
                      {lagnam.map((option) => (
                        <option key={option.didi_id} value={option.didi_id}>
                          {option.didi_description}
                        </option>
                      ))}
                      {/* Add more static options as needed */}
                    </select>
                    {/* Remove errors handling */}
                  </div>
                  <div className='w-full'>
                    <label htmlFor="chevvaiDhosam" className="block text-black font-medium mb-1">
                      Chevvai Dhosam
                    </label>
                    <select
                      id="chevvaiDhosam"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                    >
                      <option value="" disabled>
                        -- Select Chevvai Dhosam --
                      </option>
                      <option value="UnKnown">UnKnown</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>


                <div className="flex w-full flex-row gap-4">

                  <div className='w-full'>
                    <label htmlFor="sarpaDhosham" className="block text-black font-medium mb-1">
                      Sarpa Dhosham
                    </label>
                    <select
                      id="sarpaDhosham"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                    >
                      <option value="" disabled>
                        -- Select Sarpa Dhosham --
                      </option>
                      <option value="UnKnown">UnKnown</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className='w-full'>
                    <label htmlFor="naalikai" className="block text-black font-medium mb-1">
                      Naalikai
                    </label>
                    <input
                      id="naalikai"
                      type="text"
                      className="outline-none w-full px-4 py-2 border border-black rounded" />
                  </div>


                </div>
                <div className="flex w-full flex-row gap-4">
                  <div className='w-2/4'>
                    <label htmlFor="dasaName" className="block mb-1">
                      Dasa Name
                    </label>
                    <input
                      id="dasaName"
                      type="text"
                      className="outline-none w-full px-4 py-2 border border-black rounded" />
                  </div>

                  <div className='w-2/4'>
                    <label htmlFor="dateOfBirth" className="block mb-1">
                      Dasa Balance
                    </label>
                    <div className="flex space-x-2">
                      <div className='w-full'>
                        <select
                          id="day"
                          className="outline-none w-full px-4 py-2 border border-black rounded"
                        >
                          <option value="" disabled>
                            Day
                          </option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='w-full'>
                        <select
                          id="month"
                          className="outline-none w-full px-4 py-2 border border-black rounded"
                        >
                          <option value="" disabled>
                            Month
                          </option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='w-full'>
                        <select
                          id="year"
                          className="outline-none w-full px-4 py-2 border border-black rounded"
                        >
                          <option value="" disabled>
                            Year
                          </option>
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                <div className=' mb-1'>
                  <label htmlFor="dasaName" className="block">
                    Horoscope Hints
                  </label>
                  <input
                    id="dasaName"
                    type="text"
                    className="outline-none w-full px-4 py-2 border border-black rounded" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                  Rasi Grid
                </h4>
                <RasiGrid
                  centerLabel={'Rasi'}
                  onRasiContentsChange={onRasiContentsChange} />
              </div><br /><div>
                <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                  Amsam Grid
                </h4>
                <AmsamGrid
                  centerLabel={'Amsam'}
                  onAmsamContentsChange={onAmsamContentsChange} />
              </div></>
          )}
        </div>



        {/* Partner Preference */}
        <div className='bg-white p-5 mb-10 rounded shadow-md'>
          <h4 className="text-red-600 flex row items-center justify-between text-xl font-semibold text-black dark:text-white " onClick={toggleSection5}>
            {' '}
            Partner Preference
            <svg className={`fill-current transform ${isPartnerPreferenceOpen ? 'rotate-180' : ''}`} width={"20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path></svg>

          </h4>
          {isPartnerPreferenceOpen && (
            <div className="flex flex-col gap-5">
              <div className="flex w-full flex-row gap-4 pt-2">
                {/* <div className="w-full">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Select your Marital Status
                  </label>
                  <select
                    name="feature_preference"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  >
                    <option value="" selected disabled>
                      Select your Marital Status
                    </option>
                    {maritalStatuses.map((option) => (
                      <option
                        key={option.marital_sts_id}
                        value={option.marital_sts_id}
                      >
                        {option.marital_sts_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}
                <div className="w-full">
                  <Input
                    label={'Height from'}
                    name="from_month"
                    onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                  />
                  {errors.age_pref && (
                    <span className="text-red-500">From Month is required</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    label={'Height To'}
                    name="from_year"
                    onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                  />
                  {errors.from_year && (
                    <span className="text-red-500">From Year is required</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    label={'Age Preference'}
                    name="age_pref"
                    onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                  />
                  {errors.age_pref && (
                    <span className="text-red-500">{errors.age_pref}</span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-row gap-4">

                <div className="w-full">
                  <Input
                    label={'Height Preference'}
                    name="pref_height_from"
                    onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                  />
                  {errors.pref_height_from && (
                    <span className="text-red-500">
                      Height Preference is required
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <div className="w-full">
                    <label className="block text-black font-medium mb-1">
                      Chevvai
                    </label>
                    <select
                      name="pref_chevvai"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      onChange={(e) => handleInputChange(e, 'basicDetails')}
                    >
                      <option value="">Chevvai</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex w-full flex-row gap-4">
                    <div className="w-full">
                      <div className="w-full">
                        <label className="block text-black font-medium mb-1">
                          Rehu / Ketu
                        </label>
                        <select
                          name="pref_ragukethu"
                          className="outline-none w-full px-4 py-2 border border-black rounded"
                          onChange={(e) => handleInputChange(e, 'basicDetails')}
                        >
                          <option value="">Rehu / Ketu</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <div className="w-full">
                    <label className="block text-black font-medium mb-1">
                      Foreign Interest
                    </label>
                    <select
                      name="pref_foreign_intres"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      onChange={(e) => handleInputChange(e, 'basicDetails')}
                    >
                      <option value="">Foreign Interest</option>
                      <option value="Both">Both</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* <div className="w-full">
              <div className="w-full">
                <div className="w-full">
                  <div>
                    <h5 className="text-[18px] text-primary font-semibold mb-2">Marital Status</h5>
                    <div className="flex justify-between items-center">
                      <div>
                        <input
                          type="checkbox"
                          id="Bachelors,Engineering"
                          name="pref_education"
                          value="Bachelors,Engineering"
                        />
                        <label htmlFor="Bachelors,Engineering" className="pl-1">Bachelors,Engineering</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="Bachelors,Arts/science/commerce/B phil"
                          name="pref_education"
                          value="Bachelors,Arts/science/commerce/B phil"
                        />
                        <label htmlFor="Bachelors,Arts/science/commerce/B phil" className="pl-1">Bachelors,Arts/science/commerce/B phil</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="Legal-BL/ML/LLb/LLM Others"
                          name="pref_education"
                          value="Legal-BL/ML/LLb/LLM Others"
                        />
                        <label htmlFor="Legal-BL/ML/LLb/LLM Others" className="pl-1">Legal-BL/ML/LLb/LLM Others</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="Management - BBA/MBA/Others"
                          name="pref_education"
                          value="Management - BBA/MBA/Others"
                        />
                        <label htmlFor="Management - BBA/MBA/Others" className="pl-1">Management - BBA/MBA/Others</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="Doctorate"
                          name="pref_education"
                          value="Doctorate"
                        />
                        <label htmlFor="Doctorate" className="pl-1">Doctorate</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

              <div className="w-full">
                <div>
                  <h5 className="text-[18px] text-black font-semibold mb-2">
                    Profession
                  </h5>
                  <div className="flex justify-between items-center">
                    <div>
                      <input
                        type="checkbox"
                        id="employed"
                        name="pref_profession"
                        value="employed"
                      />
                      <label htmlFor="employed" className="pl-1">
                        Employed
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="business"
                        name="pref_profession"
                        value="business"
                      />
                      <label htmlFor="business" className="pl-1">
                        Business
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="student"
                        name="pref_profession"
                        value="student"
                      />
                      <label htmlFor="student" className="pl-1">
                        Student
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="notWorking"
                        name="pref_profession"
                        value="notWorking"
                      />
                      <label htmlFor="notWorking" className="pl-1">
                        Not Working
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="notMentioned"
                        name="pref_profession"
                        value="notMentioned"
                      />
                      <label htmlFor="notMentioned" className="pl-1">
                        Not Mentioned
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <div>
                  <h5 className="text-[18px] text-primary font-semibold mb-2">Annual Income Preference</h5>
                  <div className="flex justify-between items-center">
                    <div>
                      <input
                        type="checkbox"
                        id="No income"
                        name="pref_anual_income"
                        value="No income"
                      />
                      <label htmlFor="No income" className="pl-1">No income</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Under 50000"
                        name="pref_anual_income"
                        value="Under 50000"
                      />
                      <label htmlFor="Under 50000" className="pl-1">Under 50000</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Rs 50,001 - 1,00,000"
                        name="pref_anual_income"
                        value="Rs 50,001 - 1,00,000"
                      />
                      <label htmlFor="Rs 50,001 - 1,00,000" className="pl-1">Rs 50,001 - 1,00,000</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Rs 100,001 - 2,00,000"
                        name="pref_anual_income"
                        value="Rs 100,001 - 2,00,000"
                      />
                      <label htmlFor="Rs 100,001 - 2,00,000" className="pl-1">Rs 100,001 - 2,00,000</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Rs 3,00,001 - 4,00,000"
                        name="pref_anual_income"
                        value="Rs 3,00,001 - 4,00,000"
                      />
                      <label htmlFor="Rs 3,00,001 - 4,00,000" className="pl-1">Rs 3,00,001 - 4,00,000</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Rs 4,00,001 - 5,00,000"
                        name="pref_anual_income"
                        value="Rs 4,00,001 - 5,00,000"
                      />
                      <label htmlFor="Rs 4,00,001 - 5,00,000" className="pl-1">Rs 4,00,001 - 5,00,000</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Rs 5,00,001 - 75,00,000"
                        name="pref_anual_income"
                        value="Rs 5,00,001 - 75,00,000"
                      />
                      <label htmlFor="Rs 5,00,001 - 75,00,000" className="pl-1">Rs 5,00,001 - 75,00,000</label>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

              {/* <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <div>
                  <h5 className="text-[18px] text-primary font-semibold mb-2">Marital Status</h5>
                  <div className="flex justify-between items-center">
                    <div>
                      <input
                        type="checkbox"
                        id="Divorced"
                        name="pref_marital_status"
                        value="Divorced"
                      />
                      <label htmlFor="Divorced" className="pl-1">Divorced</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Not married"
                        name="pref_marital_status"
                        value="Not married"
                      />
                      <label htmlFor="Not married" className="pl-1">Not married</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Widow"
                        name="pref_marital_status"
                        value="Widow"
                      />
                      <label htmlFor="Widow" className="pl-1">Widow</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="Widower"
                        name="pref_marital_status"
                        value="Widower"
                      />
                      <label htmlFor="Widower" className="pl-1">Widower</label>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

              <div>
                <h5 className="text-[18px] text-black font-semibold mb-2">
                  Marital Status
                </h5>
                <div className="flex justify-between items-center">
                  {maritalStatuses.map((status) => (
                    <div key={status.marital_sts_id}>
                      <input
                        type="checkbox"
                        id={`maritalStatus-${status.marital_sts_id}`}
                        value={status.marital_sts_id.toString()}
                        checked={selectedMaritalStatuses.includes(
                          status.marital_sts_id.toString(),
                        )}
                        onChange={(e) =>
                          handleMaritalStatusChange(
                            status.marital_sts_id.toString(),
                            e.target.checked,
                          )
                        }
                      />
                      <label htmlFor={`maritalStatus-${status.marital_sts_id}`}>
                        {status.marital_sts_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[18px] text-black font-semibold mb-2">
                  Annual Income
                </label>
                <div className="grid grid-rows-1 grid-cols-4">
                  {annualIncome.map((option) => (
                    <div key={option.income_id} className="mb-2">
                      <input
                        type="checkbox"
                        id={`annualIncome-${option.income_id}`}
                        value={option.income_id.toString()}
                        checked={selectedAnnualIncomes.includes(
                          option.income_id.toString(),
                        )}
                        onChange={(e) =>
                          handleAnnualIncomeChange(
                            option.income_id.toString(),
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        htmlFor={`annualIncome-${option.income_id}`}
                        className="pl-1"
                      >
                        {option.income_description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>



              <div>
                <div className="justify-start items-center gap-x-5 text-black">
                  {matchStars
                    .sort((a, b) => b[0].match_count - a[0].match_count)
                    .map((matchCountArray, index) => {
                      const starAndRasi = matchCountArray.map((star) => ({
                        id: star.id.toString(),
                        star: star.matching_starname,
                        rasi: star.matching_rasiname,
                      }));

                      const matchCountValue = matchCountArray[0].match_count;

                      return (
                        <MatchingStars
                          key={index}
                          initialPoruthas={`No of porutham ${matchCountValue}`}
                          starAndRasi={starAndRasi}
                          selectedStarIds={selectedStarIds}
                          onCheckboxChange={handleCheckboxChange}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='bg-white p-5 mb-10 rounded shadow-md'>
          <h4 className="text-red-600 flex row items-center justify-between text-xl font-semibold text-black dark:text-white" onClick={toggleSection6}>
            {' '}
            Feature Preference{' '}
            <svg className={`fill-current transform ${isFeaturePreferenceOpen ? 'rotate-180' : ''}`} width={"20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path></svg>

          </h4>


          {/* feature_preference */}


          {isFeaturePreferenceOpen && (
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex w-full flex-row gap-4">
              {/* <div className="w-full">
      <div className="w-full">
        <label className="block text-black font-medium mb-1">
          Select your Marital Status
        </label>
        <select
          name="feature_preference"
          className="outline-none w-full px-4 py-2 border border-black rounded"
          onChange={(e) => handleInputChange(e, 'basicDetails')}
        >
          <option value="" selected disabled>
            Select your Marital Status
          </option>
          {maritalStatuses.map((option) => (
            <option
              key={option.marital_sts_id}
              value={option.marital_sts_id}
            >
              {option.marital_sts_name}
            </option>
          ))}
        </select>
        {errors.feature_preference && (
          <span className="text-red-500">
            {errors.feature_preference}
          </span>
        )}
      </div>
    </div> */}
              <div className="w-full">
                <Input
                  label={'Height from'}
                  name="feature_preference"
                  onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                />
                {errors.age_pref && (
                  <span className="text-red-500">From Month is required</span>
                )}
              </div>
              <div className="w-full">
                <Input
                  label={'Height To'}
                  name="feature_preference"
                  onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                />
                {errors.from_year && (
                  <span className="text-red-500">From Year is required</span>
                )}
              </div>
              <div className="w-full">
                <Input
                  label={'Age Preference'}
                  name="feature_preference"
                  onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                />
                {errors.age_pref && (
                  <span className="text-red-500">{errors.age_pref}</span>
                )}
              </div>
            </div>
            <div className="flex w-full flex-row gap-4">

              <div className="w-full">
                <Input
                  label={'Height Preference'}
                  name="feature_preference"
                  onChange={(e) => handleInputChange(e, 'partnerPreferences')}
                />
                {errors.feature_preference && (
                  <span className="text-red-500">
                    Height Preference is required
                  </span>
                )}
              </div>
              <div className="w-full">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Chevvai
                  </label>
                  <select
                    name="feature_preference"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  >
                    <option value="">Chevvai</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.feature_preference && (
                    <span className="text-red-500">required</span>
                  )}
                </div>
              </div>
              <div className="w-full">
                <div className="flex w-full flex-row gap-4">
                  <div className="w-full">
                    <div className="w-full">
                      <label className="block text-black font-medium mb-1">
                        Rehu / Ketu
                      </label>
                      <select
                        name="feature_preference"
                        className="outline-none w-full px-4 py-2 border border-black rounded"
                        onChange={(e) => handleInputChange(e, 'basicDetails')}
                      >
                        <option value="">Rehu / Ketu</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {errors.feature_preference && (
                        <span className="text-red-500">
                          Rahu/Ketu Dhosham is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <div className="w-full">
                  <label className="block text-black font-medium mb-1">
                    Foreign Interest
                  </label>
                  <select
                    name="feature_preference"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    onChange={(e) => handleInputChange(e, 'basicDetails')}
                  >
                    <option value="">Foreign Interest</option>
                    <option value="Both">Both</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {errors.feature_preference && (
                  <span className="text-red-500">
                    Foreign Interest is required
                  </span>
                )}
              </div>
            </div>
            {/* <div className="w-full">
    <div className="w-full">
      <div className="w-full">
        <div>
          <h5 className="text-[18px] text-primary font-semibold mb-2">Marital Status</h5>
          <div className="flex justify-between items-center">
            <div>
              <input
                type="checkbox"
                id="feature_preference"
                name="feature_preference"
                value="Bachelors,Engineering"
              />
              <label htmlFor="feature_preference" className="pl-1">Bachelors,Engineering</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="feature_preference"
                name="feature_preference"
                value="Bachelors,Arts/science/commerce/B phil"
              />
              <label htmlFor="feature_preference" className="pl-1">Bachelors,Arts/science/commerce/B phil</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="feature_preference"
                name="feature_preference"
                value="Legal-BL/ML/LLb/LLM Others"
              />
              <label htmlFor="feature_preference" className="pl-1">Legal-BL/ML/LLb/LLM Others</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="feature_preference"
                name="feature_preference"
                value="Management - BBA/MBA/Others"
              />
              <label htmlFor="feature_preference" className="pl-1">Management - BBA/MBA/Others</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="feature_preference"
                name="feature_preference"
                value="Doctorate"
              />
              <label htmlFor="feature_preference" className="pl-1">Doctorate</label>
            </div>
          </div>
        </div>
      </div>
      {errors.feature_preference && <span className="text-red-500">Education Preference is required</span>}
    </div>
  </div> */}
            <div className="w-full">
              <div>
                <h5 className="text-[18px] text-black font-semibold mb-2">
                  Profession
                </h5>
                <div className="flex justify-between items-center">
                  <div>
                    <input
                      type="checkbox"
                      id="feature_preference"
                      name="feature_preference"
                      value="employed"
                    />
                    <label htmlFor="feature_preference" className="pl-1">
                      Employed
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="feature_preference"
                      name="feature_preference"
                      value="business"
                    />
                    <label htmlFor="feature_preference" className="pl-1">
                      Business
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="feature_preference"
                      name="feature_preference"
                      value="student"
                    />
                    <label htmlFor="feature_preference" className="pl-1">
                      Student
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="feature_preference"
                      name="feature_preference"
                      value="notWorking"
                    />
                    <label htmlFor="feature_preference" className="pl-1">
                      Not Working
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="feature_preference"
                      name="feature_preference"
                      value="notMentioned"
                    />
                    <label htmlFor="feature_preference" className="pl-1">
                      Not Mentioned
                    </label>
                  </div>
                </div>
              </div>
              {errors.feature_preference && (
                <span className="text-red-500">
                  Profession Preference is required
                </span>
              )}
            </div>
            {/* <div className="flex w-full flex-row gap-4">
    <div className="w-full">
      <div>
        <h5 className="text-[18px] text-primary font-semibold mb-2">Annual Income Preference</h5>
        <div className="flex justify-between items-center">
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="No income"
            />
            <label htmlFor="feature_preference" className="pl-1">No income</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Under 50000"
            />
            <label htmlFor="feature_preference" className="pl-1">Under 50000</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Rs 50,001 - 1,00,000"
            />
            <label htmlFor="feature_preference" className="pl-1">Rs 50,001 - 1,00,000</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Rs 100,001 - 2,00,000"
            />
            <label htmlFor="feature_preference" className="pl-1">Rs 100,001 - 2,00,000</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Rs 3,00,001 - 4,00,000"
            />
            <label htmlFor="feature_preference" className="pl-1">Rs 3,00,001 - 4,00,000</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Rs 4,00,001 - 5,00,000"
            />
            <label htmlFor="feature_preference" className="pl-1">Rs 4,00,001 - 5,00,000</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Rs 5,00,001 - 75,00,000"
            />
            <label htmlFor="feature_preference" className="pl-1">Rs 5,00,001 - 75,00,000</label>
          </div>
        </div>
      </div>
      {errors.feature_preference && <span className="text-red-500">Annual Income is required</span>}
    </div>
  </div> */}
            {/* <div className="flex w-full flex-row gap-4">
    <div className="w-full">
      <div>
        <h5 className="text-[18px] text-primary font-semibold mb-2">Marital Status</h5>
        <div className="flex justify-between items-center">
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Divorced"
            />
            <label htmlFor="feature_preference" className="pl-1">Divorced</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Not married"
            />
            <label htmlFor="feature_preference" className="pl-1">Not married</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Widow"
            />
            <label htmlFor="feature_preference" className="pl-1">Widow</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="feature_preference"
              name="feature_preference"
              value="Widower"
            />
            <label htmlFor="feature_preference" className="pl-1">Widower</label>
          </div>
        </div>
      </div>
      {errors.feature_preference && <span className="text-red-500">Marital Status is required</span>}
    </div>
  </div> */}
          

          <div>
            <h5 className="text-[18px] text-black font-semibold mb-2">
              Marital Status
            </h5>
            <div className="flex justify-between items-center">
              {maritalStatuses.map((status) => (
                <div key={status.marital_sts_id}>
                  <input
                    type="checkbox"
                    id={`maritalStatus-${status.marital_sts_id}`}
                    value={status.marital_sts_id.toString()}
                    checked={selectedMaritalStatuses.includes(
                      status.marital_sts_id.toString(),
                    )}
                    onChange={(e) =>
                      handleMaritalStatusChange(
                        status.marital_sts_id.toString(),
                        e.target.checked,
                      )
                    }
                  />
                  <label htmlFor={`maritalStatus-${status.marital_sts_id}`}>
                    {status.marital_sts_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[18px] text-black font-semibold mb-2">
              Annual Income
            </label>
            <div className="grid grid-rows-1 grid-cols-4">
              {annualIncome.map((option) => (
                <div key={option.income_id} className="mb-2">
                  <input
                    type="checkbox"
                    id={`annualIncome-${option.income_id}`}
                    value={option.income_id.toString()}
                    checked={selectedAnnualIncomes.includes(
                      option.income_id.toString(),
                    )}
                    onChange={(e) =>
                      handleAnnualIncomeChange(
                        option.income_id.toString(),
                        e.target.checked,
                      )
                    }
                  />
                  <label
                    htmlFor={`annualIncome-${option.income_id}`}
                    className="pl-1"
                  >
                    {option.income_description}
                  </label>
                </div>
              ))}
            </div>
          </div>



          <div>
            <div className="justify-start items-center gap-x-5 text-black">
              {matchStars
                .sort((a, b) => b[0].match_count - a[0].match_count)
                .map((matchCountArray, index) => {
                  const starAndRasi = matchCountArray.map((star) => ({
                    id: star.id.toString(),
                    star: star.matching_starname,
                    rasi: star.matching_rasiname,
                  }));

                  const matchCountValue = matchCountArray[0].match_count;

                  return (
                    <MatchingStars
                      key={index}
                      initialPoruthas={`No of porutham ${matchCountValue}`}
                      starAndRasi={starAndRasi}
                      selectedStarIds={selectedStarIds}
                      onCheckboxChange={handleCheckboxChange}
                    />
                  );
                })}
            </div>
          </div>
          </div>
          )}

        </div>

        <div className='bg-white p-5 mb-10 rounded shadow-md'>
        <h4 className="text-red-600 flex row items-center justify-between text-xl font-semibold text-black dark:text-white" onClick={toggleSection7}>
            {' '}
            Upload Images{' '}
            <svg className={`fill-current transform ${isUploadImagesOpen ? 'rotate-180' : ''}`} width={"20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path></svg>

          </h4>
          {isUploadImagesOpen && (
        <div className="w-full py-2">
            {sections.map(({ label, sectionIndex, isMultiple }) => (
              <div key={sectionIndex} className={`mb-8 ${sectionIndex > 0 ? 'inline-block w-48 mr-4' : ''}`}>
                <h2 className="text-lg font-semibold mb-4">{label}</h2>
                <div className={` ${sectionIndex > 0 ? '' : 'flex-col space-y-4'}`}>
                  {isMultiple ? (
                    <div className="grid grid-cols-5 gap-4">
                      {Array.from({ length: 10 }).map((_, buttonIndex) => (
                        <div key={buttonIndex} className="flex flex-col space-y-2">
                          {/* <label className="block text-sm font-medium mb-1">
                            Image
                          </label> */}
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-sm font-medium border rounded"
                            onClick={() => triggerFileInput(`fileInput${sectionIndex}-${buttonIndex}`)}
                          >
                            Image {buttonIndex + 1}
                          </button>
                          <input
                            type="file"
                            id={`fileInput${sectionIndex}-${buttonIndex}`}
                            style={{ display: 'none' }}
                            multiple
                            onChange={(e) => handleFileChange(e, sectionIndex, buttonIndex)}
                          />
                          <div className="flex flex-col space-y-1 mt-2">
                            {selectedFiles[sectionIndex][buttonIndex]?.map((fileName, fileIndex) => (
                              <span key={fileIndex} className="text-sm">{fileName}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {/* <label className="block text-sm font-medium mb-1">
                        Choose File
                      </label> */}
                      <button
                        type="button"
                        className="w-full px-4 py-2 bg-gray-200 text-sm font-medium border rounded"
                        onClick={() => triggerFileInput(`fileInput${sectionIndex}-0`)}
                      >
                        Select File
                      </button>
                      <input
                        type="file"
                        id={`fileInput${sectionIndex}-0`}
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(e, sectionIndex)}
                      />
                      <div className="flex flex-col space-y-1 mt-2">
                        {selectedFiles[sectionIndex]?.map((fileName, fileIndex) => (
                          <span key={fileIndex} className="text-sm">{fileName}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}

          </div>


        <div className='w-full text-right'>
          <button
            type="submit"
            className="bg-red-600 font-medium text-white px-4 py-2 rounded tex"
          >
            Submit
          </button>
        </div>
      </form >
    </div >
  );
};

export default ProfileForm;
