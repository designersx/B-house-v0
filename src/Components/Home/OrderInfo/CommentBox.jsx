import React, { useEffect, useState, useRef } from "react";
import styles from "./OrderInfo.module.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import URL from "../../../config/api";
import { url2 } from "../../../config/url";
import Loader from "../../Loader/Loader";

function CommentBox({ saman }) {
  const location = useLocation();
  const itemFromLocation = location.state?.item;
  const item = itemFromLocation || saman;

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const customerId = customerInfo?.id;
  const projectId = JSON.parse(localStorage.getItem("selectedProjectId"));
  const messagesEndRef = useRef(null);
// const isInitialLoad = useRef(true);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
//  useEffect(() => {
//   if (isInitialLoad.current) {
//     isInitialLoad.current = false;
//     return; 
//   }
//   scrollToBottom();
// }, [comments]);
  
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${URL}/items/${item.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
  
    const now = new Date().toISOString();
    const tempComment = {
      comment: newComment,
      createdById: customerId,
      createdAt: now,
    };
  
    setComments((prev) => [...prev, tempComment]); // Add at the end
    setNewComment("");
    setLoading(true);
    scrollToBottom();
  
    try {
      await axios.post(`${URL}/items/${item.id}/comments`, {
        projectId,
        comment: tempComment.comment,
        createdById: customerId,
        createdByType: "customer",
      });
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (item?.id) fetchComments();
  }, [item]);

  return (
    <div className={styles.container2}>
      <h4 className={styles.commentHistory}>Comments History</h4>

      <div className={styles.commentbox}>
        <div className={styles.CommentInner}>
          {comments.map((cmt, idx) =>
            cmt.createdById === customerId ? (
              <div key={idx} className={styles.Usercomment}>
                <div className={styles.UsercommentMain}>
                  <div className={styles.UsercommentText}>
                    <p className={styles.Userpara}>{cmt.comment}</p>
                  </div>
                  <p className={styles.UserBTime}>{formatTime(cmt.createdAt)}</p>
                </div>
              </div>
            ) : (
              <div key={idx} className={styles.BHousecomment}>
                <img
                  src={
                    cmt.profilePhoto
                      ? `${url2}/${cmt.profilePhoto}`
                      : "/Svg/ChatBHouse.svg"
                  }
                  alt="chat"
                />
                <div className={styles.BHousecommentMain}>
                  <div className={styles.BHousecommentText}>
                    <p className={styles.para}>{cmt.comment}</p>
                  </div>
                  <div className={styles.BTime}>
                    <span>
                      {cmt.createdByName}
                      {cmt.userRole && (
                        <span className={styles.userRole}> ({cmt.userRole})</span>
                      )}
                    </span>
                    <span style={{ marginLeft: "10px" }}>{formatTime(cmt.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className={styles.commentBox}>
        <textarea
          className={styles.Commenrtextarea}
          placeholder="Comment or (Leave your thought here)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>

        {newComment.trim() && (
          <div
            className={styles.CommenrButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader size="30px" />
            ) : (
              <img src="/Svg/send-icon.svg" alt="Send" className={styles.sendIcon} />
            )}
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default CommentBox;
