import React from 'react';
import styles from './ProjectDelivery.module.css';
import { Link } from 'react-router-dom';


const orders = [
    {
      id: 1,
      title: "Davis Chairss",
      etd: "18-4-2025",
      eta: "25-4-2025",
      status: "Installed",
      statusColor: "LinearGreen",
      progressColor: "Green",
      progressWidth: "100%",
      bgColor: "#4CAF50",
      image: "/Images/PicPro1.png",
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
      statusColor: "FEAD37",
      progressColor: "#FEAD37",
      progressWidth: "50%",
      comment: null,
      postedAgo: "Yesterday",
      bgColor: "#FEAD37",
    },
    {
        id: 3,
        title: "Andreu World",
        etd: "10-4-2025",
        eta: "15-4-2025",
        status: "In Transit",
        statusColor: "LinearGreen",
        progressColor: "#6C35B1",
        bgColor: "#6C35B1",
        progressWidth: "60%",
        image: "/Images/PicPro1.png",
        comment: {
          user: "Kate Nick",
          time: "13 MAR 03:45 PM",
          message: "We are assembling",
          postedAgo: "2 days ago",
        },
      },
      {
        id: 4,
        title: "Berhnhardt",
        etd: "15-4-2025",
        eta: "22-4-2025",
        status: "Arrived",
        statusColor: "text-orange-500",
        progressColor: "#004A84",
        progressWidth: "60%",
        comment: null,
        postedAgo: "5 days ago",
        bgColor: "#004A84",
      },
      {
        id: 5,
        title: "Herman Miller",
        etd: "11-4-2025",
        eta: "19-4-2025",
        status: "Order Processed",
        statusColor: "#FF5E00",
        progressColor: "#FF5E00",
        progressWidth: "25%",
        comment: null,
        postedAgo: "05 MAR 03:45 PM",
        bgColor: "#FF5E00",
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

<Link  to={`/order/${order.id}`}
  key={order.id}
  state={{ order }}
  className={styles.linkStyle}>
        <div key={order.id} className={styles.orderCard}>
          {/* Header */}
          <div className={styles.orderHeader}>
            <h2 className={styles.orderTitle}>{order.title}</h2>
            <span className={`${styles.orderStatus} ${order.statusColor}`} 
              style={{ color: order.bgColor }}
            >
              {order.status}<span className={styles.LineColor} style={{ backgroundColor: order.bgColor }} ></span>
            </span>
          </div>

          {/* ETD & ETA */}
          <p className={styles.orderDetails}>
            <strong>ETD :</strong> {order.etd} | <strong>ETA :</strong> {order.eta}
          </p>

          {/* Comment Section */}
          {order.comment && (
            <div className={styles.commentBox}>
              <div className={styles.commentHeader}>
              <p className={styles.commentUser}><img src={order.image}  alt="Comment" className={styles.PicImg} /> {order.comment.user}</p>
              <p className={styles.commentTime}>{order.comment.time}</p>
              </div>
              <p className={styles.commentMessage}>{order.comment.message}</p>
            </div>
          )}

          {/* Footer */}
          <div className={styles.orderFooter}>
            <span className={styles.TimeFlex}><img src="/Svg/TimeIcon.svg"/> {order.comment ? order.comment.postedAgo : order.postedAgo}</span>
            <button className={styles.addComment}>
              <img src="/Svg/CommentIcon.svg" alt="Comment" />
              Add Comment
            </button>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressBar}>
            <div
              className={`${styles.progress} ${order.progressColor}`}
              style={{ width: order.progressWidth, backgroundColor: order.progressColor }}
            ></div>
          </div>
        </div>
        </Link>
      ))}
    </div>



    </div>
  )
}

export default ProjectDelivery