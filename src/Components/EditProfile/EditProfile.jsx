import React, { useEffect, useRef, useState } from 'react';
import styles from '../EditProfile/EditProfile.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import URL from '../../config/api';

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState('Images/profle.png');
  const [customer, setCustomer] = useState({});
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    address: '',
  });
console.log(customer)
  const customerId = JSON.parse(localStorage.getItem('customerInfo'))?.id;

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${URL}/customer/${customerId}`);
        setCustomer(res.data);
        setFormData({
          full_name: res.data.full_name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          company_name: res.data.company_name || '',
          address: res.data.address || '',
        });
      } catch (err) {
        console.error('Failed to fetch customer data:', err);
      }
    };

    if (customerId) fetchCustomer();
  }, [customerId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear the error message for the input as the user types.
    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image change
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
  
    // Full Name: required, only letters & spaces, min 2, max 50
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (!nameRegex.test(formData.full_name.trim())) {
      errors.full_name = 'Full name should contain only letters & spaces (2–50 chars)';
    }
  
    // Email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Email format is not valid';
      }
    }
  
    // Phone: exactly 10 digits
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'Phone must be exactly 10 digits';
      }
    }
  
    // Company Name: required, alphanumeric with spaces
    const companyRegex = /^[a-zA-Z0-9\s]{2,50}$/;
    if (!formData.company_name.trim()) {
      errors.company_name = 'Company name is required';
    } else if (!companyRegex.test(formData.company_name.trim())) {
      errors.company_name = 'Company name must be alphanumeric (2–50 chars)';
    }
  
    // Address
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters';
    } else if (formData.address.trim().length > 100) {
      errors.address = 'Address must be under 100 characters';
    }
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return; 
    }
    
    try {
      await axios.put(`${URL}/customer/${customerId}`, formData);
      alert('Profile updated successfully');
      navigate('/home');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.BlueImg}>
        <img src="Images/Bg-blue.png" alt="Background blue" />
      </div>

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <img src="Svg/back-arrow.svg" alt="Back" />
        <h2 className={styles.title}>Edit Profile</h2>

      </button>
      <div className={styles.LampDiv}><img src='Svg/lamp.svg' alt=''/></div>

      <div className={styles.ProfileSection}>
        <div className={styles.imageSection}>
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
          <button className={styles.editIcon} onClick={handleImageClick}>
            <img src="/Svg/roundEdit.svg" alt="Edit" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <div className={styles.detalis}>
          <p className={styles.name}>{formData.full_name}</p>
          <p className={styles.email}>{formData.email}</p>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label>
            Full Name<span>*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full name"
          />
          {errors.full_name && (
            <span className={styles.error}>{errors.full_name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>
            Email<span>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="YourEmail@gmail.com"
          />
          {errors.email && (
            <span className={styles.error}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>
            Phone Number<span>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="88-XXX-XXX-88"
          />
          {errors.phone && (
            <span className={styles.error}>{errors.phone}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>
            Company Name<span>*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="XYZ Company Name"
          />
          {errors.company_name && (
            <span className={styles.error}>{errors.company_name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>
            Address<span>*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address..."
            rows={2}
          />
          {errors.address && (
            <span className={styles.error}>{errors.address}</span>
          )}
        </div>

        <div className={styles.updateBtn} onClick={handleSubmit}>
          <p>Update</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
