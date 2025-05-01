import React, { useEffect, useRef, useState } from 'react';
import styles from '../CommentThread/CommentThread.module.css';
import axios from 'axios';
import URL from '../../config/api';
import Loader from '../Loader/Loader'
const Comments = ({ documentId ,onView  }) => {
  const [comments, setComments] = useState([]);
  const [viewed, setViewed] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(false)
  const isCustomer = !!customerInfo;
  const messagesEndRef = useRef(null);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${URL}/customerDoc/comments/${documentId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const postComment = async () => {
    if (!commentInput.trim()) return;
  
    const message = commentInput.trim();
  
    const payload = {
      documentId,
      message,
    };
  
    const now = new Date().toISOString();
  
    const tempComment = isCustomer
      ? {
          message,
          createdAt: now,
          Customer: { name: customerInfo?.name || 'Customer' },
        }
      : {
          message,
          createdAt: now,
          User: { firstName: userInfo?.firstName || 'Admin' },
        };
  
    setComments((prev) => [...prev, tempComment]);
    setCommentInput('');
    scrollToBottom();
  
    if (isCustomer) {
      payload.customerId = customerInfo.id;
    } else {
      payload.userId = userInfo.id;
    }
  
    try {
      await axios.post(`${URL}/customerDoc/comments/`, payload);
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchComments();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);
  useEffect(() => {
    if (comments.length > 0 && !viewed) {
      onView(documentId);  // Pass the ID
      setViewed(true);
    }
  }, [comments, viewed, onView, documentId]);
  
  return (
    <div className={styles.threadContainer}>
      <div className={styles.header}>

      </div>

      <div className={styles.messages}>
        {comments.map((msg, index) => (
          msg.User ? (
            <div key={index} className={styles.supportMessageRow}>
              <div className={styles.imageRow}>
                <img
                  src="Svg/admin.svg"
                  alt="avatar"
                  className={styles.avatar}
                />
              </div>
              <div>
                <div className={styles.messageBubbleSupport}>{msg.message}</div>
                <div className={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleString()} – {msg.User.firstName}
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className={styles.userMessageRow}>
              <div className={styles.right}>
                <div className={styles.messageBubbleUser}>{msg.message}</div>
                <div className={styles.timestamp2}>
                  {new Date(msg.createdAt).toLocaleString()} – {msg.Customer?.name || 'Customer'}
                </div>
              </div>
              <div style={{ width: 40, marginLeft: 8 }}></div>
            </div>
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* <div className={styles.commentBox}>
        <input
          type="text"
          placeholder="Comment or leave your thought here..."
          className={styles.inputField}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && postComment()}
        />
        <button disabled={ commentInput === "" ? true : false} className={styles.commentButton} onClick={ !loading  ? postComment : null }>
          {loading? <Loader size={20}/>: "COMMENT"}

        </button>
      </div> */}


      {/* Ankush Code Start */}

      <div className={styles.commentBox}>
        <input
          type="text"
          placeholder="Comment or leave your thought here..."
          className={styles.inputField}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && postComment()}
        />

        {commentInput.trim() && (
          <div
            disabled={loading}
            className={styles.commentButton}
            onClick={!loading ? postComment : null}
          >
            {loading ? <Loader size={20} /> : <img src="/Svg/send-icon.svg" alt="Send" className={styles.sendIcon} />}
          </div>
        )}
      </div>
      {/* Ankush Code End */}
    </div>
  );
};

export default Comments;
