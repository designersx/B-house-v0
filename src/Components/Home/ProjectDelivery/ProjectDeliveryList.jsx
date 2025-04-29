import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProjectDeliveryList.module.css";
import { url2 } from "../../../config/url";
import URL from "../../../config/api";
import axios from "axios";
import HeaderTab from "../../HeaderTab/HeaderTab"; // ✅ Import HeaderTab

const progressColor = {
  Installed: { progressWidth: "100%", progressColor: "Green", statusColor: "LinearGreen" },
  Delivered: { progressWidth: "50%", progressColor: "#FEAD37", statusColor: "FEAD37" },
  Pending: { progressWidth: "25%", progressColor: "#FF5E00", statusColor: "#FF5E00" },
  In_Transit: { progressWidth: "60%", progressColor: "#6C35B1", statusColor: "LinearGreen" },
};

function ProjectDeliveryList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state?.items || []);
  const [latestCommentsByItem, setLatestCommentsByItem] = useState({});
  const [statusFilters, setStatusFilters] = useState({}); // ✅ Status Filter
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search Term

  const fetchComments = async () => {
    try {
      const latestComments = {};

      await Promise.all(
        data.map(async (item) => {
          const res = await axios.get(`${URL}/items/${item.id}/comments`);
          const itemComments = res?.data;
          if (itemComments && itemComments.length > 0) {
            const userComments = itemComments.filter((cmt) => cmt.createdByType === "user");
            if (userComments.length > 0) {
              userComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  useEffect(() => {
    if (data.length > 0) {
      fetchComments();
    }
  }, [data]);

  const handleItemClick = (item) => {
    navigate(`/orderInfo/${item.id}`, { state: { item } });
  };

  function formatTime(dateString) {
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
      return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    }
  }

  // ✅ Apply Filtering (Search + Status both)
  const filteredData = data
    .filter((item) => {
      const activeStatuses = Object.keys(statusFilters).filter((status) => statusFilters[status]);
      if (activeStatuses.length === 0) return true;
      return activeStatuses.includes(item.status);
    })
    .filter((item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className={styles.Container}>
      {/* ✅ HeaderTab added here */}
      <HeaderTab
        title="Project Delivery List"
        onStatusFilterChange={setStatusFilters}
        onSearchTermChange={setSearchTerm}
        statusOptions={["Installed", "Delivered", "Pending", "In_Transit"]}
      />

      {filteredData.length === 0 ? (
        <p>No items found.</p>
      ) : (
        filteredData
          .filter((item) => item.itemName && item.itemName.trim() !== "")
          .map((item) => {
            const latestComment = latestCommentsByItem[item.id];
            return (
              <div key={item.id} className={styles.orderCard} onClick={() => handleItemClick(item)}>
                {/* Header */}
                <div className={styles.orderHeader}>
                  <h2 className={styles.orderTitle}>{item.itemName}</h2>
                  <span
                    className={styles.orderStatus}
                    style={{
                      color: progressColor[item.status]?.progressColor || progressColor["In_Transit"].progressColor,
                    }}
                  >
                    {item.status}
                    <span
                      className={styles.LineColor}
                      style={{
                        backgroundColor:
                          progressColor[item.status]?.progressColor ||
                          progressColor["In_Transit"].progressColor,
                      }}
                    ></span>
                  </span>
                </div>

                {/* ETD & ETA */}
                {item.expectedDeliveryDate ? (
                  <p className={styles.orderDetails}>
                    <strong>ETD :</strong> {item.expectedDeliveryDate.slice(0, 10)} |{" "}
                    <strong>ETA :</strong> {item.expectedArrivalDate?.slice(0, 10)}
                  </p>
                ) : (
                  "TBD"
                )}

                {/* Comment Box */}
                {latestComment && (
                  <div className={styles.commentBox}>
                    <div className={styles.commentHeader}>
                      <p className={styles.commentUser}>
                        <img src={`${url2}/${latestComment.profilePhoto}`} alt="Profile" className={styles.PicImg} />
                        {latestComment.createdByName}
                      </p>
                      <p className={styles.commentTime}>{formatTime(latestComment.createdAt)}</p>
                    </div>
                    <p className={styles.commentMessage}>{latestComment.comment}</p>
                  </div>
                )}

                {/* Footer */}
                <div className={styles.orderFooter}>
                  <button className={styles.addComment}>
                    <img src="/Svg/CommentIcon.svg" alt="Comment" />
                    Add Comment
                  </button>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: progressColor[item.status]?.progressWidth || progressColor["In_Transit"].progressWidth,
                      backgroundColor:
                        progressColor[item.status]?.progressColor || progressColor["In_Transit"].progressColor,
                    }}
                  ></div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}

export default ProjectDeliveryList;
