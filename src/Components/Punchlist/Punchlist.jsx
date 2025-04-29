import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Punchlist/Punchlist.module.css";
import Modal from "../Modal/Modal";
import CommentThread from "../CommentThread/CommentThread";
import URL from "../../config/api";
import { url2 } from "../../config/url";
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from "../Loader/Loader";

function Punchlist({ statusFilters, searchTerm = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIssue, setActiveIssue] = useState(null);
  const [issues, setIssues] = useState([]); // 🔵 Pure list
  const [filteredIssues, setFilteredIssues] = useState([]); // 🟠 Filtered list
  const [loading, setLoading] = useState(false);

  const projectId = localStorage.getItem("selectedProjectId");

  const handleCommentClick = (issue) => {
    setActiveIssue(issue);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchPunchList = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL}/projects/${projectId}/punch-list`);
        const punchListData = response.data;
        const parsedIssues = punchListData.map(issue => ({
          ...issue,
          productImages: JSON.parse(issue.productImages)
        }));
        setIssues(parsedIssues);
        setFilteredIssues(parsedIssues); // 👈 Set full list initially
        setLoading(false);
      } catch (err) {
        console.error("Error fetching punch list:", err);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchPunchList();
    }
  }, [projectId]);

  // 🔥 Important: Search ya filters change hone par filter lagana
  useEffect(() => {
    filterIssues();
  }, [issues, statusFilters, searchTerm]); 

  const filterIssues = () => {
    let filtered = [...issues];

    const activeStatuses = Object.keys(statusFilters).filter(status => statusFilters[status]);
    if (activeStatuses.length > 0) {
      filtered = filtered.filter(issue => activeStatuses.includes(issue.status));
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(issue =>
        issue.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredIssues(filtered);
  };

  const handlePunchListView = (issue) => {
    navigate(`/punchlist-detail/${issue?.id}`, {
      state: { punchId: issue?.id },
    });
  };

  const handleImageClick = (imagePath) => {
    window.open(`${url2}/${imagePath}`, "_blank");
  };

  const formatDate = (date) => {
    const today = new Date();
    const createdDate = new Date(date);
    const daysDiff = Math.floor((today - createdDate) / (1000 * 3600 * 24));

    return daysDiff === 0 ? "Today" : daysDiff === 1 ? "Yesterday" : createdDate.toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className="ForLoder"><Loader /></div>
      ) : filteredIssues.length === 0 ? (
        <div className={styles.noData}>
          <div>
            <img src="Svg/notfound.svg" alt="" />
            <div className={styles.NoDataTittle}>
              <p>No items found yet</p>
              <img src="Svg/EYE1.svg" alt="" />
            </div>
          </div>
        </div>
      ) : (
        filteredIssues.map((issue, index) => (
          <div key={index} className={styles.card} onClick={() => handlePunchListView(issue)}>
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
              <b>{issue.category}</b> – {issue.issueDescription.length > 20
                ? `${issue.issueDescription.slice(0, 20)}...`
                : issue.issueDescription}
            </div>

            <div className={styles.flexD}>
              <div className={styles.imageRow}>
                {issue.productImages.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={`${url2}/${img}`}
                    alt={`Issue image ${i + 1}`}
                    className={styles.image}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(img);
                    }}
                  />
                ))}
                {issue.productImages.length > 3 && (
                  <div className={styles.moreImages}>+{issue.productImages.length - 3}</div>
                )}
              </div>

              <div className={styles.commentLink} onClick={(e) => {
                e.stopPropagation();
                handleCommentClick(issue);
              }}>
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
