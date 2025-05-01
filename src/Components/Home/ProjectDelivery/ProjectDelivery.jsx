import React, { useEffect, useState } from "react";
import styles from "./ProjectDelivery.module.css";
import { Link, useNavigate } from "react-router-dom";

import URL from "../../../config/api";
import axios from "axios";
import { url2 } from "../../../config/url";

function ProjectDelivery({ selectedProject }) {
  const [showAll, setShowAll] = useState(false);
  const [data, setData] = useState([]);
  const [latestCommentsByItem, setLatestCommentsByItem] = useState({});
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const [itemsByManufacturerId, setItemsByManufacturerId] = useState({});
  const [commentCountsByManufacturerId, setCommentCountsByManufacturerId] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLastNotificationTime = async () => {
      const projectId = localStorage.getItem("selectedProjectId");
      if (!projectId) return;

      try {
        const res = await axios.get(`${URL}/projects/${projectId}`);
        setLastNotificationTime(res.data?.lastNotificationSentAt || null);
      } catch (err) {
        console.error("Failed to fetch project info:", err);
      }
    };

    fetchLastNotificationTime();
  }, []);
  const handleViewAll = () => {
    navigate("/project-delivery-list", { state: { items: data } });
  };
  const fetchManufacturers = async () => {
    const projectId = JSON.parse(localStorage.getItem("selectedProjectId"));
    try {
      const res = await axios.get(`${URL}/items/${projectId}`);
      if (res?.data) {
        const grouped = res.data.reduce((acc, item) => {
          const manufacturer = item.id || "Unknown";
          if (!acc[manufacturer]) acc[manufacturer] = [];
          acc[manufacturer].push(item);
          return acc;
        }, {});
        setItemsByManufacturerId(grouped);
        setData(res.data); // keep existing data too
      }
    } catch (error) {
      console.log("Error fetching items:", error);
    }
  };

  const calculateDateProgress = (etd, eta, status, tbd) => {
    if (status === "Installed") {
      return { width: "100%", color: "green" };
    }

    if (tbd || !etd || !eta) return null;

    const etdDate = new Date(etd);
    const etaDate = new Date(eta);
    const today = new Date();

    const isSameDay = etdDate.toDateString() === etaDate.toDateString();
    if (isSameDay) {
      return { width: "100%", color: "green" };
    }

    const totalDuration = etaDate - etdDate;
    const elapsed = today - etdDate;

    if (totalDuration <= 0) return { width: "0%", color: "#4a90e2" };

    let percent = (elapsed / totalDuration) * 100;
    percent = Math.max(1, Math.min(100, percent));

    const color = percent >= 100 ? "green" : "#4a90e2";

    return {
      width: `${percent.toFixed(2)}%`,
      color,
    };
  };

  const fetchComments = async () => {
    try {
      const latestComments = {};
      // Loop through each item to fetch comments
      await Promise.all(
        data.map(async (item) => {
          const res = await axios.get(`${URL}/items/${item.id}/comments`);
          const itemComments = res?.data;
          if (itemComments && itemComments.length > 0) {
            const userComments = itemComments.filter(
              (cmt) => cmt.createdByType === "user"
            );

            if (userComments.length > 0) {
              userComments.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              latestComments[item.id] = userComments[0];
            }
          }
        })
      );

      setLatestCommentsByItem(latestComments);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  // Fetch items when selectedProject changes
  useEffect(() => {
    fetchManufacturers();
  }, [selectedProject]);

  // Fetch comments once items are available
  useEffect(() => {
    if (data && data.length > 0) {
      fetchComments();
    }
  }, [data]);
  function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days < 7) {
      if (minutes < 1) {
        return "just now";
      } else if (minutes < 60) {
        return minutes === 1 ? "1 min ago" : `${minutes} min ago`;
      } else if (hours < 24) {
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
      } else {
        return days === 1 ? "1 day ago" : `${days} days ago`;
      }
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }
  const formatDate = (date) => {
    const options = {
      weekday: 'long', // "Monday"
      day: 'numeric',  // "25"
      month: 'long',   // "April"
      year: 'numeric', // "2025"
    };

    return new Date(date).toLocaleDateString('en-GB', options);
  };
  //Commnet Count Functionlaity 
  const fetchCommentsByManufacturerId = async () => {
    const commentCounts = {};

    for (const manuId in itemsByManufacturerId) {
      const itemIds = itemsByManufacturerId[manuId].map(item => item.id);

      const commentPromises = itemIds.map(id =>
        axios.get(`${URL}/items/${id}/comments`).catch(() => ({ data: [] }))
      );

      const results = await Promise.all(commentPromises);
      const allComments = results.flatMap(res => res.data || []);
      const userComments = allComments.filter(cmt => cmt.createdByType === "user");
      const isReadFalse = userComments.filter((item) => item.isRead == false)
      commentCounts[manuId] = isReadFalse.length;
    }

    setCommentCountsByManufacturerId(commentCounts);
    console.log(" Comment counts per manufacturerId:", commentCounts);
  };
  const itemMarkItemCommentsAsRead = async (itemId) => {
    console.log(itemId, "itemId")
    try {
      const response = await axios.put(`${URL}/projects/itemMarkItemCommentsAsRead/${itemId}`)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchManufacturers();
  }, []);
  useEffect(() => {
    if (Object.keys(itemsByManufacturerId).length > 0) {
      fetchCommentsByManufacturerId();
    }
  }, [itemsByManufacturerId]);
  return (
    <div>
      <div className={styles.DeliveryUpdate}>
        <h4>Lead Time Matrix</h4>
        <button className={styles.button} onClick={handleViewAll}>
          View All
        </button>
      </div>
      <div className={styles.dlDate}>
        {lastNotificationTime && (
          <p className={styles.lastUpdatedTime}>
            Last Updated:{" "}
            {lastNotificationTime && !isNaN(new Date(lastNotificationTime))
              ? formatDate(lastNotificationTime)
              : "Not Updated"}
          </p>

        )}

      </div>

      <div className={styles.Container}>
        {(showAll ? data : data.slice(0, 3))
          ?.filter((item) => item.itemName && item.itemName.trim() !== "")
          .map((item) => {
            const latestComment = latestCommentsByItem[item.id];

            // ✅ Calculate progress at the top
            const progress = calculateDateProgress(
              item.expectedDeliveryDate,
              item.expectedArrivalDate,
              item.status,
              item.tbd
            );

            return (
              <Link
                to={`/orderInfo/${item?.id}`}
                onClick={() => itemMarkItemCommentsAsRead(item?.id)}
                key={item.id}
                state={{ item }}
                className={styles.linkStyle}
              >
                <div className={styles.orderCard}>
                  {/* Header */}
                  <div className={styles.orderHeader}>
                    <h2 className={styles.orderTitle}>{item.itemName}</h2>
                    <span
                      className={styles.orderStatus}
                      style={{
                        color: progress?.color || "#6C35B1",
                      }}
                    >
                      {item.status}
                      <span
                        className={styles.LineColor}
                        style={{
                          backgroundColor: progress?.color || "#6C35B1",
                        }}
                      ></span>
                    </span>
                  </div>

                  {/* ETD & ETA */}
                  {item.expectedDeliveryDate ? (
                    <p className={styles.orderDetails}>
                      <strong>ETD :</strong>{" "}
                      {item.expectedDeliveryDate?.slice(0, 10)} |{" "}
                      <strong>ETA :</strong>{" "}
                      {item.expectedArrivalDate?.slice(0, 10)}
                    </p>
                  ) : (
                    "TBD"
                  )}

                  {/* Comment Box */}
                  {latestComment && (
                    <div className={styles.commentBox}>
                      <div className={styles.commentHeader}>
                        <p className={styles.commentUser}>
                          <img
                            src={`${url2}/${latestComment.profilePhoto}`}
                            alt="Profile"
                            className={styles.PicImg}
                          />
                          {latestComment.createdByName}
                        </p>
                        <p className={styles.commentTime}>
                          {formatTime(latestComment.createdAt)}
                        </p>
                      </div>
                      <p className={styles.commentMessage}>
                        {latestComment.comment}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className={styles.orderFooter}>
                    <button className={styles.addComment}>
                      <img src="/Svg/CommentIcon.svg" alt="Comment" />
                      Add Comment
                      {commentCountsByManufacturerId[item.id] > 0 && (
                        <span className={styles.commentCount} style={{ color: 'red', fontWeight: 'bold' }}>
                          ({commentCountsByManufacturerId[item.id]})
                        </span>
                      )}
                    </button>

                  </div>

                  {/* Progress Bar */}
                  {item.tbd ? (
                    <p className={styles.tbdText}>Delivery dates TBD</p>
                  ) : (
                    progress && (
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progress}
                            style={{
                              width: progress.width,
                              backgroundColor: progress.color,
                            }}
                          ></div>
                        </div>
                        {/* <span className={styles.progressLabel}>
                  {parseFloat(progress.width).toFixed(0)}%
                </span> */}
                      </div>
                    )
                  )}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default ProjectDelivery;
