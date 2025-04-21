
import React, { useEffect, useState } from 'react';

import styles from './header.module.css';
import OffCanvas from '../OffCanvas/OffCanvas';
import Modal from '../Modal/Modal';
import ModalSearch from '../ModalSearch/ModalSearch';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import URL from '../../config/api';
import { url2 } from '../../config/url';

function Header() {
  const navigate = useNavigate();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const projectId = localStorage.getItem('selectedProjectId');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryHours, setDeliveryHours] = useState('');
  const [customHours, setCustomHours] = useState('');
  const [openOffcanvas, setOpenOffcanvas] = useState(false)
  const [notification, setNotification] = useState([])
  const info=JSON.parse(localStorage.getItem("customerInfo"))
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
  const handleUpdateDeliveryDetails = async () => {
    try {
      const data = {
        deliveryAddress,
        deliveryHours: deliveryHours === "Other" ? customHours : deliveryHours
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      await axios.put(`${URL}/projects/${projectId}`, formData);
      setShowModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update delivery details.");
    }
  };


  const handleOpenOffcanvas = () => {
    setOpenOffcanvas(true)
  }
  const handleCloseOffcanvas = () => {setOpenOffcanvas(false);}

  const getNotificationsByUser = async (id) => {
    const response = await axios.get(`${URL}/getNotificationsByClient/${id}`);
    return response
  }
  const fetchNotification = async () => {
    try {
      const response = await getNotificationsByUser(info?.id)
      console.log(response)
      setNotification(response.data.notifications
      )
    } catch (error) {
      console.log(error)
    }

  }
  function formatNotificationTime(dateString) {
    const inputDate = new Date(dateString);
    const now = new Date();

    const isToday =
      inputDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      inputDate.toDateString() === yesterday.toDateString();

    const time = inputDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) {
      return `Today at ${time}`;
    } else if (isYesterday) {
      return `Yesterday at ${time}`;
    } else {
      const month = inputDate.toLocaleString('default', { month: 'short' });
      const day = inputDate.getDate();
      return `${month} ${day} at ${time}`;
    }
  }

  useEffect(() => {
    fetchNotification()
  }, [])

  const [openOffcanvas, setOpenOffcanvas] = useState(false)
  const [notification, setNotification] = useState([])
  const info=JSON.parse(localStorage.getItem("customerInfo"))

const [data , setData] = useState()

useEffect(() => {
  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`${URL}/customer/${customerInfo?.id}`);
      setData(res.data);
   console.log(res.data , "data")
      
    } catch (err) {
      console.error('Failed to fetch customer data:', err);
    }
  };

  fetchCustomer();
}, []);
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!projectId) return;

        const res = await axios.get(`${URL}/projects/${projectId}`);
        const project = res.data;
        console.log(project)

        setDeliveryAddress(project.deliveryAddress || '');
        setDeliveryHours(project.deliveryHours || '');
        setCustomHours(['Regular Hours', 'Before 9 AM', 'After 6 PM'].includes(project.deliveryHours) ? '' : project.deliveryHours);
      } catch (err) {
        console.error("Error fetching project data:", err);
      }
    };

    fetchProjectDetails();
  }, [projectId]);


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
  const handleUpdateDeliveryDetails = async () => {
    try {
      const data = {
        deliveryAddress,
        deliveryHours: deliveryHours === "Other" ? customHours : deliveryHours
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      await axios.put(`${URL}/projects/${projectId}`, formData);
      setShowModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update delivery details.");
    }
  };


  const handleOpenOffcanvas = () => {
    setOpenOffcanvas(true)
  }
  const handleCloseOffcanvas = () => {setOpenOffcanvas(false);}

  const getNotificationsByUser = async (id) => {
    const response = await axios.get(`${URL}/getNotificationsByClient/${id}`);
    return response
  }
  const fetchNotification = async () => {
    try {
      const response = await getNotificationsByUser(info?.id)
      console.log(response)
      setNotification(response.data.notifications
      )
    } catch (error) {
      console.log(error)
    }

  }
  function formatNotificationTime(dateString) {
    const inputDate = new Date(dateString);
    const now = new Date();

    const isToday =
      inputDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      inputDate.toDateString() === yesterday.toDateString();

    const time = inputDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) {
      return `Today at ${time}`;
    } else if (isYesterday) {
      return `Yesterday at ${time}`;
    } else {
      const month = inputDate.toLocaleString('default', { month: 'short' });
      const day = inputDate.getDate();
      return `${month} ${day} at ${time}`;
    }
  }

  useEffect(() => {
    fetchNotification()
  }, [])

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!projectId) return;

        const res = await axios.get(`${URL}/projects/${projectId}`);
        const project = res.data;

        setDeliveryAddress(project.deliveryAddress || '');
        setDeliveryHours(project.deliveryHours || '');
        setCustomHours(['Regular Hours', 'Before 9 AM', 'After 6 PM'].includes(project.deliveryHours) ? '' : project.deliveryHours);
      } catch (err) {
        console.error("Error fetching project data:", err);
      }
    };

    fetchProjectDetails();
  }, [projectId]);
  return (
    <div>
      <div className={styles.headerMain}>
        <div className={styles.headerLogo}>
          <img src="/Svg/Logo-Bhouse.svg" alt="logo" className={styles.logo} />
        </div>

        <div className={styles.headerSideIcon}>
          <img src='Svg/searchSvg.svg' alt='Search' className={styles.vector1} onClick={() => setShowModalSearch(true)} />
          <img onClick={handleOpenOffcanvas} src="/Svg/BellIcon.svg" alt="BellIcon" className={styles.vector1} />
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
            <img src={data?.profilePhoto ? `${url2}/${data?.profilePhoto}` : 'Images/profle.png'} alt="user" className={styles.avatar} />
            <div>
              <p className={styles.userName}>{customerInfo?.full_name || "User"}</p>
              <p className={styles.userEmail}>{customerInfo?.email || "email@example.com"}</p>
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


      <Modal isOpen={showModal} onClose={() => setShowModal(false)} height='70vh'>
        <div className={styles.formGroup}>
          <label>Delivery Address*</label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Write delivery address"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Delivery Hours*</label>
          <select
            value={deliveryHours}
            onChange={(e) => {
              setDeliveryHours(e.target.value);
              if (e.target.value !== "Other") setCustomHours('');
            }}
          >
            <option>Regular Hours</option>
            <option>Before 9 AM</option>
            <option>After 6 PM</option>
            <option>Other</option>
          </select>
        </div>

        {deliveryHours === "Other" && (
          <div className={styles.formGroup}>
            <label>Other</label>
            <textarea
              placeholder="Enter custom hours"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
            />
          </div>
        )}


        <button className={styles.submitButton} onClick={handleUpdateDeliveryDetails}>Update</button>
      </Modal>
      <ModalSearch isOpen={showModalSearch}
        onClose={() => setShowModalSearch(false)}
        height="50%">
      </ModalSearch>
      {openOffcanvas && <OffCanvas  onClose={handleCloseOffcanvas} isOpen={openOffcanvas}  >
        {notification.map((message) => {
          return (
            <><div className="notification-container">
              <div className="notification-card">
                <div className="notification-header">
                  <span className="sender-name">{message.senderName}</span>
                  <span className="notification-time">{formatNotificationTime(message.createdAt)}</span>
                </div>
                <div className="notification-message">
                  {message.message}
                </div>
              </div>
            </div></>
          )
        })}

      </OffCanvas>}
    </div>
  );
}

export default Header;
