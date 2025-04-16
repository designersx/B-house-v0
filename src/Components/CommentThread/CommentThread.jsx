import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../CommentThread/CommentThread.module.css';
import URL from '../../config/api';
import { url2 } from '../../config/url';

const CommentThread = ({ issue }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const isCustomer = !!customerInfo;
  const customerId = customerInfo?.id;
  const messagesEndRef = useRef(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${URL}/punchlist/${issue.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      await axios.post(
        `${URL}/projects/${issue.projectId}/punchlist/${issue.id}/comments`,
        {
          comment: commentInput,
          clientId: customerId,
        }
      );
      setCommentInput('');
      await fetchComments(); 
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [issue.id]);

  // Scroll to bottom every time comments change
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  return (
    <div className={styles.threadContainer}>
      <h4 className={styles.commentHistory}>Comments History</h4>
      <div className={styles.messages}>
      {[...comments].reverse().map((msg, index) => (
          msg.createdByType === 'user' ? (
            <div key={index} className={styles.supportMessageRow}>
              
  <div className={styles.imageRow}>

     <img
     src={
       msg.profileImage
         ? `${url2}/${msg.profileImage}`
         : 'Svg/user-icon.svg'
     }
     alt="avatar"
     className={styles.avatar}
   />

  </div>


  <div>
    <div className={styles.messageBubbleSupport}>{msg.comment}</div>
    <div className={styles.timestamp}>
      {msg.name}
      {msg.userRole ? ` (${msg.userRole})` : ''} • {new Date(msg.createdAt).toLocaleString()}
    </div>
  </div>
            </div>
          ) : (
            <div key={index} className={styles.userMessageRow}>
              <div>
                <div className={styles.messageBubbleUser}>{msg.comment}</div>
                <div className={styles.timestamp2}>
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ width: 40, marginLeft: 8 }}></div>
            </div>
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isCustomer && (
        <div className={styles.commentBox}>
          <input
            type="text"
            placeholder="Comment or (Leave your thought here)"
            className={styles.inputField}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button className={styles.commentButton} onClick={handleAddComment}>
            COMMENT
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentThread;
