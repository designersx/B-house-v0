import React, { useEffect, useState } from 'react';
import HeaderTab from '../../Components/HeaderTab/HeaderTab';
import styles from '../TeamMembers/TeamMembers.module.css';
import Modal from '../Modal/Modal';
import axios from 'axios';
import URL from '../../config/api';
import { useLocation } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { url2 } from '../../config/url';

const TeamMembers = () => {
  const [loading, setIsloading] = useState(false)
  const location = useLocation();
  let a = localStorage.getItem("visible")
  let b = localStorage.getItem("remaining")

  const visibleIds = location.state?.visible || a;
  const remainingIds = location.state?.remaining || b;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
  const selectedProjectId = JSON.parse(localStorage.getItem("selectedProjectId"));
  
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCommentsForUser = async (userId) => {
    try {
      const { data } = await axios.get(`${URL}/projects/${selectedProjectId}/user-comments/${userId}`);
      setUserComments(data);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Error fetching user comments", err);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const payload = {
        fromCustomerId: customerInfo.id,
        toUserId: selectedContact.id,
        comment: commentText
      };

      await axios.post(`${URL}/projects/${selectedProjectId}/user-comments`, payload);
      setCommentText("");
      fetchCommentsForUser(selectedContact.id);
    } catch (err) {
      console.error("Error sending comment", err);
    }
  };
  const handleSendMessage = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
    fetchCommentsForUser(contact.id);
  };



  const fetchTeamMembers = async () => {
    setIsloading(true)
    try {
      const { data } = await axios.get(`${URL}/auth/getAllUsers`);
      if (data) {
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

  return (
    <div>
      {loading ? <Loader /> : <>
        <HeaderTab title='Team Members' />

        <div className={styles.contactList}>
          {visibleUsers.length > 0 && (
            <>

              {visibleUsers.map((user) => (
                <div key={user.id} className={styles.contactCard}>
                  <img src={
                    user.profileImage
                      ? `${url2}/${user?.profileImage}`
                      : 'Svg/user-icon.svg'
                  } alt={user.firstName} className={styles.avatar} />
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
              {[...userComments].reverse().map((msg, index) => (
                msg.createdByType === 'customer' ? (
                  <div key={index} className={styles.userMessageRow}>
                    <div className={styles.right}>
                      <div className={styles.messageBubbleUser}>{msg.comment}</div>
                      <div className={styles.timestamp2}>{new Date(msg.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ width: 40, marginLeft: 8 }}></div>
                  </div>
                ) : (
                  <div key={index} className={styles.supportMessageRow}>
                    <img
                      src={
                        msg.profileImage
                          ? `${url2}/${msg.profileImage}`
                          : 'Svg/user-icon.svg'
                      }
                      alt="avatar"
                      className={styles.avatar}
                    />
                    <div>
                      <div className={styles.messageBubbleSupport}>
                        <b>{msg.name}</b> ({msg.userRole})<br />
                        {msg.comment}
                      </div>
                      <div className={styles.timestamp}>{new Date(msg.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                )
              ))}
              <div ref={messagesEndRef} />
            </div>



            <div className={styles.commentBox}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Comment or (Leave your thought here)"
                className={styles.inputField}
              />
              <button className={styles.commentButton} onClick={handleSubmitComment}>COMMENT</button>
            </div>

          </div>
        </Modal>
      </>}

    </div>
  );
};

export default TeamMembers;
