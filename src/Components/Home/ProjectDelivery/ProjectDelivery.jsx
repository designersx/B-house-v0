import React from 'react';
import styles from './ProjectDelivery.module.css';


const orders = [
    {
      id: 1,
      title: "Davis Chairs",
      etd: "18-4-2025",
      eta: "25-4-2025",
      status: "Installed",
      statusColor: "text-green-500",
      progressColor: "bg-green-500",
      comment: {
        user: "John Vick",
        time: "13 MAR 03:45 PM",
        message: "The order has arrived in Florida...",
        postedAgo: "3 hrs ago",
      },
    },
    {
      id: 2,
      title: "Davis Tables",
      etd: "12-4-2025",
      eta: "20-4-2025",
      status: "Delivered",
      statusColor: "text-orange-500",
      progressColor: "bg-orange-500",
      comment: null,
      postedAgo: "Yesterday",
    },
  ];

function ProjectDelivery() {


    
  return (
    <div>

 <div className={styles.DeliveryUpdate}>
    <h4>Project Delivery Update</h4>
    <button className={styles.button}>View All</button>
  </div>

  <div className={styles.Container}>
      {orders.map((order) => (
        <div key={order.id} className={styles.orderCard}>
          {/* Header */}
          <div className={styles.orderHeader}>
            <h2 className={styles.orderTitle}>{order.title}</h2>
            <span className={`${styles.orderStatus} ${order.statusColor}`}>
              {order.status}
            </span>
          </div>

          {/* ETD & ETA */}
          <p className={styles.orderDetails}>
            <strong>ETD:</strong> {order.etd} | <strong>ETA:</strong> {order.eta}
          </p>

          {/* Comment Section */}
          {order.comment && (
            <div className={styles.commentBox}>
              <p className={styles.commentUser}>{order.comment.user}</p>
              <p className={styles.commentTime}>{order.comment.time}</p>
              <p className={styles.commentMessage}>{order.comment.message}</p>
            </div>
          )}

          {/* Footer */}
          <div className={styles.orderFooter}>
            <span>{order.comment ? order.comment.postedAgo : order.postedAgo}</span>
            <button className={styles.addComment}>
              <img src="/comment-icon.png" alt="Comment" />
              Add Comment
            </button>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressBar}>
            <div
              className={`${styles.progress} ${order.progressColor}`}
              style={{ width: order.progressWidth }}
            ></div>
          </div>
        </div>
      ))}
    </div>



    </div>
  )
}

export default ProjectDelivery