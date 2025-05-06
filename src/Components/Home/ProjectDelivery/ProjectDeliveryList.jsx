import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProjectDeliveryList.module.css";
import { url2 } from "../../../config/url";
import URL from "../../../config/api";
import axios from "axios";
import HeaderTab from "../../HeaderTab/HeaderTab";

function ProjectDeliveryList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state?.items || []);
  const [latestCommentsByItem, setLatestCommentsByItem] = useState({});
  const [statusFilters, setStatusFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsByManufacturerId, setItemsByManufacturerId] = useState({});
  const [commentCountsByManufacturerId, setCommentCountsByManufacturerId] = useState({});

  const fetchComments = async () => {
    try {
      const latestComments = {};

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



  const calculateDateProgress = (etd, eta, status, tbd) => {
    if (status === "Installed") {
      return { width: "100%", color: "green" };
    }

    if (tbd || !etd || !eta) return null;

    const etdDate = new Date(etd);
    const etaDate = new Date(eta);
    const today = new Date();

    // If ETD and ETA are same day
    const isSameDay = etdDate.toDateString() === etaDate.toDateString();
    if (isSameDay) {
      return { width: "100%", color: "green" };
    }

    const totalDuration = etaDate - etdDate;
    const elapsed = today - etdDate;

    if (totalDuration <= 0) return { width: "0%", color: "#4a90e2" };

    let percent = (elapsed / totalDuration) * 100;
    percent = Math.max(1, Math.min(100, percent));

    // Make fully completed progress bar green
    const color = percent >= 100 ? "green" : "#4a90e2";

    return {
      width: `${percent.toFixed(2)}%`,
      color,
    };
  };

  const handleItemClick = (item) => {
    navigate(`/orderInfo/${item.id}`, { state: { item } });
    itemMarkItemCommentsAsRead(item?.id)
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days < 7) {
      if (minutes < 1) return "just now";
      if (minutes < 60) return `${minutes} min ago`;
      if (hours < 24) return `${hours} hours ago`;
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  const filteredData = data
    .filter((item) => {
      const activeStatuses = Object.keys(statusFilters).filter(
        (status) => statusFilters[status]
      );
      if (activeStatuses.length === 0) return true;
      return activeStatuses.includes(item.status);
    })
    .filter((item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  //Commnet Count Functionlaity 
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
  };
  const itemMarkItemCommentsAsRead = async (itemId) => {
    try {
      const response = await axios.put(`${URL}/projects/itemMarkItemCommentsAsRead/${itemId}`)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (data.length > 0) {
      fetchComments();
    }
  }, [data]);

  useEffect(() => {
    fetchManufacturers();
  }, []);
  useEffect(() => {
    if (Object.keys(itemsByManufacturerId).length > 0) {
      fetchCommentsByManufacturerId();
    }
  }, [itemsByManufacturerId]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasReloaded = localStorage.getItem("hasReloaded");
    if (params.get("fromEmail") === "true") {
      const projectId = params.get("projectId");
      axios.get(`${URL}/projects/${projectId}`).then((res) => {
        const project = res.data

        if (project) {
          localStorage.setItem("selectedProjectId", projectId);
          localStorage.setItem("selectedProject", JSON.stringify(project));
          localStorage.setItem("hasReloaded", "true");
          // Remove query params before reload to prevent loop
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          window.location.reload();

        }
      });

    }
  }, [location]);
  return (

    <>
      <HeaderTab
        title="Lead Time Matrix"
        onStatusFilterChange={setStatusFilters}
        onSearchTermChange={setSearchTerm}
        statusOptions={["Installed", "Delivered", "Pending", "In Transit", "Arrived"]}
      />
      <div className={styles.Container}>

        {filteredData.length <=  0 ? (
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
          filteredData
            .filter((item) => item.itemName && item.itemName.trim() !== "")
            .map((item) => {
              const latestComment = latestCommentsByItem[item.id];
              const progress = calculateDateProgress(
                item.expectedDeliveryDate,
                item.expectedArrivalDate,
                item.status,
                item.tbd
              );

              return (
                <div
                  key={item.id}
                  className={styles.orderCard}
                  onClick={() => handleItemClick(item)}
                >
                  <div className={styles.orderHeader}>
                    <h2 className={styles.orderTitle}>{item.itemName}</h2>
                    <span className={styles.orderStatus}>
                      {item.status}
                      <span className={styles.LineColor}></span>
                    </span>
                  </div>

                  {item.expectedDeliveryDate ? (
                    <p className={styles.orderDetails}>
                      <strong>ETD:</strong>{" "}
                      {item.expectedDeliveryDate.slice(0, 10)} |{" "}
                      <strong>ETA:</strong>{" "}
                      {item.expectedArrivalDate?.slice(0, 10)}
                    </p>
                  ) : (
                    "TBD"
                  )}

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

                  <div className={styles.orderFooter}>
                    <button className={styles.addComment}>
                      <img src="/Svg/CommentIcon.svg" alt="Comment" />
                      Add Comment   {commentCountsByManufacturerId[item.id] > 0 && (
                        <span className={styles.commentCount} style={{ color: 'red', fontWeight: 'bold' }}>
                          ({commentCountsByManufacturerId[item.id]})
                        </span>
                      )}
                    </button>
                  </div>

                  {item.tbd ? (
                    <p className={styles.tbdText}>Delivery dates TBD</p>
                  ) : (
                    progress && (
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progress}
                          style={{
                            width: progress.width,
                            backgroundColor: progress.color,
                          }}
                        ></div>
                      </div>
                    )
                  )}
                </div>
              );
            })
        )}
      </div>
    </>

  );
}

export default ProjectDeliveryList;
