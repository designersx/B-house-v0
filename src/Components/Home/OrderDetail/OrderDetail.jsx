import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderDetail.module.css";

function OrderDetail() {
  // heel
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;
  if (!order) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className={styles.detailContainer}>
      {/* <h2>Order No: #{order.id}</h2> */}
      <p><strong>Title:</strong> {order.title}</p>

      {/* Image */}
      {order.image && (
        <div className={styles.imageContainer}>
          <img src={order.image} alt={order.title} className={styles.productImage} />
        </div>
      )}

      {/* Order Details */}
      <p><strong>ETD:</strong>{order?.item?.expectedDeliveryDate.slice(0,10)}</p>
      <p><strong>ETA:</strong> {order.eta}</p>
      <p><strong>Status:</strong> {order.status}</p>

      {/* Comment Section */}
      {order.comment ? (
        <div className={styles.commentSection}>
          <h3>Comments History</h3>
          <p><strong>{order.comment.user}:</strong> {order.comment.message}</p>
          <span>{order.comment.time}</span>
        </div>
      ) : (
        <p>No comments available.</p>
      )}

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: order.progressWidth, backgroundColor: order.progressColor }}
        ></div>
      </div>
      <div className={styles.slider}>
        Slider
      </div>
    </div>



  );
}

export default OrderDetail;
