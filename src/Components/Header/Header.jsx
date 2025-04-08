import React, { useState } from 'react'
import styles from './header.module.css'
import OffCanvas from '../OffCanvas/OffCanvas'
import { useNavigate } from 'react-router-dom';

function Header() {
  const [showCanvas, setShowCanvas] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('selectedProjectId');
    navigate('/');
  };

  return (
    <div>

      <div className={styles.headerMain}>
        <div className={styles.headerLogo}>
          <img src="/Svg/Logo-Bhouse.svg" alt="logo" className={styles.logo} />
        </div>

        <div className={styles.headerSideIcon}>
          <img src="/Svg/searchIcon.svg" alt="searchIcon" className={styles.vector1} />
          <img src="/Svg/BellIcon.svg" alt="BellIcon" className={styles.vector1} />
          <img src="/Svg/UserIcon1.svg" alt="UserIcon" className={styles.vector1} onClick={() => setShowCanvas(true)} />
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

          <button className={`${styles.btn} ${styles.active}`}>
            <img src="Svg/person.svg" alt="person" className={styles.icon} />
            Delivery Details
          </button>

          <button className={styles.btn}>
            <img src="Svg/setting.svg" alt="icon" className={styles.icon} />
            Settings
          </button>

          <button className={`${styles.btn} ${styles.logoutBtn}`} onClick={handleLogout}>
           <img src="Svg/Left-icon.svg" alt="icon" className={styles.icon} />
           Log out
          </button>


          <div className={styles.divider}></div>
        </div>
      </OffCanvas>





    </div>
  )
}

export default Header