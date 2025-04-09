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
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    address: '',
  });

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

  // Handle submit
  const handleSubmit = async () => {
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
        <img src="Images/Bg-blue.png" alt="" />
      </div>

      <button className={styles.backButton}>
        <img src="Svg/back-arrow.svg" alt="" onClick={() => navigate(-1)} />
        <h2 className={styles.title}>Edit Profile</h2>
      </button>

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
          <label>Full Name<span>*</span></label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full name"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email<span>*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="YourEmail@gmail.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number<span>*</span></label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="88-XXX-XXX-88"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Company Name<span>*</span></label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="XYZ Company Name"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address<span>*</span></label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address..."
            rows={2}
          />
        </div>

        <div className={styles.updateBtn} onClick={handleSubmit}>
          <p>Update</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
