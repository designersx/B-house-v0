import React, { useEffect, useState } from 'react';
import HeaderTab from '../../Components/HeaderTab/HeaderTab';
import styles from '../TeamMembers/TeamMembers.module.css';
import Modal from '../Modal/Modal';
import axios from 'axios';
import URL from '../../config/api';
import { useLocation } from 'react-router-dom';
import Loader from '../Loader/Loader';
// import { url2 } from '../../config/url';

const TeamMembers = () => {
  const [loading , setIsloading] = useState(false)
  const location = useLocation();
  let a = localStorage.getItem("teamusers")
  // let b = localStorage.getItem("remaining")
  
  const visibleIds = location.state?.visible || a;
  const remainingIds = location.state?.remaining
console.log(visibleIds)
console.log(remainingIds)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
// let user = JSON.parse
  const messages = [
    {
      sender: 'support',
      text: 'We can either repair it or replace it.',
      timestamp: '13 MAR 12:57 PM',
    },
    {
      sender: 'user',
      text: 'I prefer a replacement if possible.',
      timestamp: '14 MAR 11:10 AM',
    },
    {
      sender: 'support',
      text: 'If we have the same model available, we’ll replace it immediately.',
      timestamp: '16 MAR 10:12 PM',
    },
    {
      sender: 'user',
      text: 'Comfortable chair but chair broken right-side handle.',
      timestamp: '17 MAR 10:10 AM',
    },
  ];

  const fetchTeamMembers = async () => {
    setIsloading(true)
    try {
      const { data } = await axios.get(`${URL}/auth/getAllUsers`);
      if(data){
        setIsloading(false)
      }
      setAllUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const visibleUsers = allUsers.filter(
    user => visibleIds.includes(user.id) && user.id !== 1
  );
 
  const remainingUsers = allUsers?.filter(
    user => remainingIds?.includes(user.id) && user.id !== 1
  );
console.log(visibleUsers)
  const handleSendMessage = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  return (
    <div>
      {loading ? <Loader/> :<>
        <HeaderTab title='Team Members' />

<div className={styles.contactList}>
  {visibleUsers.length > 0 && (
    <>

      {visibleUsers.map((user) => (
        <div key={user.id} className={styles.contactCard}>
          <img src={user.profileImage || "/Images/profile-picture.webp"} alt={user.firstName} className={styles.avatar} />
          <div className={styles.info}>
            <div className={styles.name}>
              {user.firstName} <span className={styles.role}>({user.userRole})</span>
            </div>
            <div className={styles.phone}>{user.mobileNumber}</div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.callBtn}>Book a Call</button>
            <button className={styles.msgBtn} onClick={() => handleSendMessage(user)}>
              Send Message
            </button>
          </div>
        </div>
      ))}
    </>
  )}

  {remainingUsers.length > 0 && (
    <>
      
      {remainingUsers.map((user) => (
        <div key={user.id} className={styles.contactCard}>
          <img src={user.profileImage || "/Images/profile-picture.webp"} alt={user.firstName} className={styles.avatar} />
          <div className={styles.info}>
            <div className={styles.name}>
              {user.firstName} <span className={styles.role}>({user.userRole})</span>
            </div>
            <div className={styles.phone}>{user.mobileNumber}</div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.callBtn}>Book a Call</button>
            <button className={styles.msgBtn} onClick={() => handleSendMessage(user)}>
              Send Message
            </button>
          </div>
        </div>
      ))}
    </>
  )}
</div>

{/* Modal with custom content */}
<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} height="80vh">
  <div>
    <div className={styles.header}>
      <p><b>Team Member -</b> {selectedContact?.firstName}</p>
    </div>

    <div className={styles.messages}>
      {messages.map((msg, index) => (
        msg.sender === 'support' ? (
          <div key={index} className={styles.supportMessageRow}>
            <img src="Svg/user-icon.svg" alt="avatar" className={styles.avatar} />
            <div>
              <div className={styles.messageBubbleSupport}>{msg.text}</div>
              <div className={styles.timestamp}>{msg.timestamp}</div>
            </div>
          </div>
        ) : (
          <div key={index} className={styles.userMessageRow}>
            <div>
              <div className={styles.messageBubbleUser}>{msg.text}</div>
              <div className={styles.timestamp2}>{msg.timestamp}</div>
            </div>
            <div style={{ width: 40, marginLeft: 8 }}></div>
          </div>
        )
      ))}
    </div>

    <div className={styles.commentBox}>
      <input
        type="text"
        placeholder="Comment or (Leave your thought here)"
        className={styles.inputField}
      />
      <button className={styles.commentButton}>COMMENT</button>
    </div>
  </div>
</Modal>
      </>}
     
    </div>
  );
};

export default TeamMembers;
