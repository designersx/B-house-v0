import React, { useEffect, useState } from 'react';
import styles from './ProjectDelivery.module.css';
import { Link } from 'react-router-dom';
import URL from  '../../../config/api'
import axios from 'axios';

// const orders = [
//     {
//       id: 1,
//       title: "Davis Chairss",
//       etd: "18-4-2025",
//       eta: "25-4-2025",
//       status: "Installed",
//       statusColor: "LinearGreen",
//       progressColor: "Green",
//       progressWidth: "100%",
//       bgColor: "#4CAF50",
//       image: "/Images/PicPro1.png",
//       comment: {
//         user: "John Vick",
//         time: "13 MAR 03:45 PM",
//         message: "The order has arrived in Florida...",
//         postedAgo: "3 hrs ago",
//       },
//     },
//     {
//       id: 2,
//       title: "Davis Tables",
//       etd: "12-4-2025",
//       eta: "20-4-2025",
//       status: "Delivered",
//       statusColor: "FEAD37",
//       progressColor: "#FEAD37",
//       progressWidth: "50%",
//       comment: null,
//       postedAgo: "Yesterday",
//       bgColor: "#FEAD37",
//     },
//     {
//         id: 3,
//         title: "Andreu World",
//         etd: "10-4-2025",
//         eta: "15-4-2025",
//         status: "In Transit",
//         statusColor: "LinearGreen",
//         progressColor: "#6C35B1",
//         bgColor: "#6C35B1",
//         progressWidth: "60%",
//         image: "/Images/PicPro1.png",
//         comment: {
//           user: "Kate Nick",
//           time: "13 MAR 03:45 PM",
//           message: "We are assembling",
//           postedAgo: "2 days ago",
//         },
//       },
//       {
//         id: 4,
//         title: "Berhnhardt",
//         etd: "15-4-2025",
//         eta: "22-4-2025",
//         status: "Arrived",
//         statusColor: "text-orange-500",
//         progressColor: "#004A84",
//         progressWidth: "60%",
//         comment: null,
//         postedAgo: "5 days ago",
//         bgColor: "#004A84",
//       },
//       {
//         id: 5,
//         title: "Herman Miller",
//         etd: "11-4-2025",
//         eta: "19-4-2025",
//         status: "Order Processed",
//         statusColor: "#FF5E00",
//         progressColor: "#FF5E00",
//         progressWidth: "25%",
//         comment: null,
//         postedAgo: "05 MAR 03:45 PM",
//         bgColor: "#FF5E00",
//       },
//   ];

const progressColor = {
  Installed: {
    progressWidth: "100%",
    progressColor: "Green",
    statusColor: "LinearGreen",
  },
  Delivered: {
    progressColor: "#FEAD37",
    statusColor: "FEAD37",
    progressWidth: "50%",
  },
  Pending: {
    statusColor: "#FF5E00",
            progressColor: "#FF5E00",
            progressWidth: "25%",
  },
  In_Transit: {
    progressColor: "#6C35B1",
    statusColor: "LinearGreen",
    progressWidth: "60%",
  },
};

function ProjectDelivery({selectedProject}) {
  const [data , setData] = useState()
  const [comments , setComments] = useState()
 
  const fetchManufacturers = async()=>{
    const projectId = JSON.parse(localStorage.getItem('selectedProjectId'))
  
    try {
      const getData = await axios.get(`${URL}/items/${projectId}`)
      console.log({getData})
      if(getData){
        setData(getData?.data)
      }
 
      console.log(getData?.data)
    } catch (error) {
      console.log(error)
    }
  
  }

  const fetchComments = async()=>{
    const projectId = JSON.parse(localStorage.getItem('selectedProjectId'))
    let data = await axios.get(`${URL}/items/${projectId}/comments`)
    setComments(data?.data)
    console.log(comments)
    console.log({data})
    const latest = getLatestCommentsByItemId(data?.data);
    setLatestCommentsByItem(latest);
  }

  useEffect(()=>{
    fetchManufacturers()
    fetchComments()
  },[selectedProject])
  const [latestCommentsByItem, setLatestCommentsByItem] = useState({});
  const getLatestCommentsByItemId = (comments) => {
    const latestComments = {};
  
    comments?.forEach((comment) => {
      const itemId = comment.itemId;
  
      if (!latestComments[itemId]) {
        latestComments[itemId] = comment; // first comment (already sorted)
      }
    });
  
    return latestComments;
  };

  return (
    <div>

 <div className={styles.DeliveryUpdate}>
    <h4>Project Delivery Update</h4>
    <button className={styles.button}>View All</button>
  </div>
  

  <div className={styles.Container}>
      {data?.map((item , index) => {
          const latestComment = latestCommentsByItem[item.id];
          
return(
  <Link  to={`/order/`}
  key=""
  state=""
  className={styles.linkStyle}>
        <div key={index} className={styles.orderCard}>
          {/* Header */}
          <div className={styles.orderHeader}>
            <h2 className={styles.orderTitle}>{item.itemName
            }</h2>
            <span className={`${styles.orderStatus} `}
             style={{color: progressColor[item.status]?.progressColor ||
              progressColor['In_Transit']?.progressColor
             }} 
             
            >
              {item?.status}<span style={{backgroundColor: progressColor[item.status]?.progressColor|| 
progressColor['In_Transit']?.progressColor

              }} className={styles.LineColor}  ></span>
            </span>
          </div>

          {/* ETD & ETA */}
          <p className={styles.orderDetails}>
            <strong>ETD :</strong>   {item.expectedDeliveryDate.slice(0, 10)} | <strong>ETA :</strong> {item.
expectedArrivalDate}
          </p>

          {/* Comment Section */}
          <div className={styles.commentBox}>
  <div className={styles.commentHeader}>
    <p className={styles.commentUser}>
      <img
        src={`${URL}/${latestComment?.profilePhoto}`}
        alt="Comment"
        className={styles.PicImg}
      />
      {latestComment?.createdByName}
    </p>
    <p className={styles.commentTime}>
      {new Date(latestComment?.createdAt).toLocaleString()}
    </p>
  </div>
  <p className={styles.commentMessage}>{latestComment?.comment}</p>
</div>
        

          {/* Footer */}
          <div className={styles.orderFooter}>
            <span className={styles.TimeFlex}><img src="/Svg/TimeIcon.svg"/> </span>
            <button className={styles.addComment}>
              <img src="/Svg/CommentIcon.svg" alt="Comment" />
              Add Comment
            </button>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressBar}>
          <div
  className={`${styles.progress}`}
  style={{
    width: progressColor[item.status]?.progressWidth || progressColor['In_Transit']?.progressWidth ,
    backgroundColor: progressColor[item.status]?.progressColor  || progressColor['In_Transit']?.progressColor,
  }}
></div>
          </div>
        </div>
        </Link>
)

})}
    </div>



    </div>
  )
}

export default ProjectDelivery