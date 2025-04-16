import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Punchlist/Punchlist.module.css";
import Modal from "../Modal/Modal";
import CommentThread from "../CommentThread/CommentThread";
import URL from "../../config/api";
import { url2 } from "../../config/url";
import { useNavigate } from 'react-router-dom';

function Punchlist() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIssue, setActiveIssue] = useState(null);
  const [issues, setIssues] = useState([]);

  const projectId = localStorage.getItem("selectedProjectId");

  const handleCommentClick = (issue) => {
    setActiveIssue(issue);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchPunchList = async () => {
      try {
        const response = await axios.get(`${URL}/projects/${projectId}/punch-list`);
        const punchListData = response.data;
        const parsedIssues = punchListData.map(issue => ({
          ...issue,
          productImages: JSON.parse(issue.productImages)
        }));
        setIssues(parsedIssues);
      } catch (err) {
        console.error("Error fetching punch list:", err);
      }
    };

    if (projectId) {
      fetchPunchList();
    }
  }, [projectId]);

  // Format the created date for display
  const formatDate = (date) => {
    const today = new Date();
    const createdDate = new Date(date);
    const timeDiff = today - createdDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
      return "Today";
    } else if (daysDiff === 1) {
      return "Yesterday";
    } else {
      return createdDate.toLocaleDateString();
    }
  };

  const handleImageClick = (imagePath) => {
    window.open(`${url2}/${imagePath}`, "_blank");
  };

  return (
    <div className={styles.container}>
      {issues.length === 0 ? (
        <div className={styles.noData}>
          <div><img src="Svg/notfound.svg" alt=""/>
          <div className={styles.NoDataTittle}><p>No items found yet</p><img src="Svg/EYE1.svg" alt=""/></div></div>
        </div>
      ) : (
        issues.map((issue, index) => (
          <div key={index} className={styles.card} onClick={() => navigate('/punchlist-detail' ,   {
            state : {
              punchId : issue?.id
            }
          })}>
            <div className={styles.topRow}>
              <span
                className={`${styles.status} 
                  ${issue.status === "Resolved" ? styles.resolved : ""}
                  ${issue.status === "Rejected" ? styles.rejected : ""}
                  ${issue.status === "Pending" ? styles.pending : ""}`}
              >
                {issue.status}
              </span>
              <span className={styles.date}>{formatDate(issue.createdAt)}</span>
            </div>
  
            <div className={styles.title}>
              <b>{issue.category}</b> – {issue.issueDescription}
            </div>
  
            <div className={styles.flexD}>
              <div className={styles.imageRow}>
                {issue.productImages.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={`${url2}/${img}`}
                    alt={`Issue image ${i + 1}`}
                    className={styles.image}
                    onClick={() => handleImageClick(img)}
                  />
                ))}
                {issue.productImages.length > 3 && (
                  <div className={styles.moreImages}>+{issue.productImages.length - 3}</div>
                )}
              </div>
  
              <div className={styles.commentLink} onClick={() => handleCommentClick(issue)}>
                <img src="Svg/edit-icon.svg" alt="edit" />
                <p>Add Comment</p>
              </div>
            </div>
  
            {issue.comments && (
              <div className={styles.commentBox}>
                <div className={styles.userFlex}>
                  <div className={styles.commentUser}>
                    <img src={issue.comments.userimg} alt="user" />
                    <p>{issue.comments.user}</p>
                  </div>
                  <div className={styles.commentTime}>{issue.comments.time}</div>
                </div>
                <div className={styles.commentMsg}>{issue.comments.message}</div>
              </div>
            )}
          </div>
        ))
      )}
  
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} height="80%">
        {activeIssue && <CommentThread issue={activeIssue} />}
      </Modal>
    </div>
  );
  
}

export default Punchlist;
