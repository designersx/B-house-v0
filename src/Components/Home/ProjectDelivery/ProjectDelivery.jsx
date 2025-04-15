
import React, { useEffect, useState } from "react";
import styles from "./ProjectDelivery.module.css";
import { Link } from "react-router-dom";
import URL from "../../../config/api";
import axios from "axios";
import { url2 } from "../../../config/url";

const progressColor = {
  Installed: {
    progressWidth: '100%',
    progressColor: 'Green',
    statusColor: 'LinearGreen',
  },
  Delivered: {
    progressColor: '#FEAD37',
    statusColor: 'FEAD37',
    progressWidth: '50%',
  },
  Pending: {

    statusColor: '#FF5E00',
    progressColor: '#FF5E00',
    progressWidth: '25%',

  },
  In_Transit: {
    progressColor: '#6C35B1',
    statusColor: 'LinearGreen',
    progressWidth: '60%',
  },
};

function ProjectDelivery({ selectedProject }) {
  const [data, setData] = useState([]);
  const [latestCommentsByItem, setLatestCommentsByItem] = useState({});

 

  const fetchManufacturers = async () => {
    const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));


    try {
      const res = await axios.get(`${URL}/items/${projectId}`);
      if (res?.data) {
        setData(res.data);
      }
    } catch (error) {

      console.log('Error fetching items:', error);
    }
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
            latestComments[item.id] = itemComments[0]; // latest comment
          }
        })
      );

      setLatestCommentsByItem(latestComments);
    } catch (error) {
      console.log('Error fetching comments:', error);
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

  return (

    <div>
      <div className={styles.DeliveryUpdate}>
        <h4>Project Delivery Update</h4>
        <button className={styles.button}>View All</button>
      </div>

      <div className={styles.dlDate}><p>2025-04-11</p></div>

      <div className={styles.Container}>
        {data?.map((item) => {
          const latestComment = latestCommentsByItem[item.id];

          return (
            <Link
              to={`/order/`}
              key={item.id}
              state=""
              className={styles.linkStyle}
            >
              <div className={styles.orderCard}>
                {/* Header */}
                <div className={styles.orderHeader}>
                  <h2 className={styles.orderTitle}>{item.itemName}</h2>
                  <span
                    className={styles.orderStatus}
                    style={{
                      color:
                        progressColor[item.status]?.progressColor ||
                        progressColor['In_Transit'].progressColor,
                    }}
                  >
                    {item.status}
                    <span
                      className={styles.LineColor}
                      style={{
                        backgroundColor:
                          progressColor[item.status]?.progressColor ||
                          progressColor['In_Transit'].progressColor,
                      }}
                    ></span>
                  </span>
                </div>

                {/* ETD & ETA */}
                <p className={styles.orderDetails}>
                  <strong>ETD :</strong>{' '}
                  {item.expectedDeliveryDate?.slice(0, 10)} |{' '}
                  <strong>ETA :</strong> {item.expectedArrivalDate}
                </p>

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
                        {new Date(latestComment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className={styles.commentMessage}>
                      {latestComment.comment}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className={styles.orderFooter}>
                  <span className={styles.TimeFlex}>
                    <img src="/Svg/TimeIcon.svg" alt="Time" />
                  </span>
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
                      width:
                        progressColor[item.status]?.progressWidth ||
                        progressColor['In_Transit'].progressWidth,
                      backgroundColor:
                        progressColor[item.status]?.progressColor ||
                        progressColor['In_Transit'].progressColor,
                    }}
                  ></div>
                </div>
              </div>
            </Link>
          );
        })}

      </div>
    </div>
  );
}

export default ProjectDelivery;
