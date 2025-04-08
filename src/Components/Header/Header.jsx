import React, { useState } from 'react';
import styles from './header.module.css';
import OffCanvas from '../OffCanvas/OffCanvas';
import Modal from '../Modal/Modal';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deliveryHours, setDeliveryHours] = useState('');
  const [customHours, setCustomHours] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('selectedProjectId');
    navigate('/');
  };
  const handleEdit = () => {
    navigate('/edit-profile')
  }

  return (
    <div>
      <div className={styles.headerMain}>
        <div className={styles.headerLogo}>
          <img src="/Svg/Logo-Bhouse.svg" alt="logo" className={styles.logo} />
        </div>

        <div className={styles.headerSideIcon}>
          <img src="/Svg/searchIcon.svg" alt="searchIcon" className={styles.vector1} />
          <img src="/Svg/BellIcon.svg" alt="BellIcon" className={styles.vector1} />
          <img
            src="/Svg/UserIcon1.svg"
            alt="UserIcon"
            className={styles.vector1}
            onClick={() => setShowCanvas(true)}
          />
        </div>
      </div>

      <OffCanvas isOpen={showCanvas} onClose={() => setShowCanvas(false)} direction="right" width="300px">
        <div className={styles.sidebarContainer}>
          <p className={styles.sectionTitle}>Profile</p>

          <div className={styles.userInfo}>
            <img src="Svg/DP.svg" alt="user" className={styles.avatar} />
            <div>
              <p className={styles.userName}>Jenny Wilson</p>
              <p className={styles.userEmail}>J.wilson@example.com</p>
            </div>
          </div>

          <button className={`${styles.btn} ${styles.active}`} onClick={() => setShowModal(true)}>
            <img src="Svg/person.svg" alt="person" className={styles.icon} />
            Delivery Details
          </button>

          <button className={styles.btn} onClick={handleEdit}>
            <img src="Svg/black-edit.svg" alt="icon" className={styles.icon} />
            Edit Profile
          </button>

          <button className={`${styles.btn} ${styles.logoutBtn}`} onClick={handleLogout}>
            <img src="Svg/Left-icon.svg" alt="icon" className={styles.icon} />
            Log out
          </button>

          <div className={styles.divider}></div>
        </div>
      </OffCanvas>

      {/* Modal UI  Start */}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} height="70vh">
        <>
          <div className={styles.formGroup}>
            <label>Delivery Address*</label>
            <input type="text" placeholder="Write delivery address" />
          </div>

          <div className={styles.formGroup}>
            <label>Delivery Hours*</label>
            <select
              value={deliveryHours}
              onChange={(e) => setDeliveryHours(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Regular Hours">Regular Hours</option>
              <option value="Before 9 AM">Before 9 AM</option>
              <option value="After 6 PM">After 6 PM</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {deliveryHours === 'Other' && (
            <div className={styles.formGroup}>
              <label>Other</label>
              <textarea
                placeholder="Enter custom hours"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
              />
            </div>
          )}

          <button className={styles.submitButton}>Update</button>
        </>
      </Modal>
      {/* Modal UI  End */}

    </div>
  );
}

export default Header;
