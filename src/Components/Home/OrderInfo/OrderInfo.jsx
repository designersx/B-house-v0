import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './OrderInfo.module.css';
import CommentBox from './CommentBox';
import HeaderTab from '../../HeaderTab/HeaderTab';
import { useLocation } from 'react-router-dom';
import URL from '../../../config/api'; 
import {url2} from '../../../config/url'; 
function OrderInfo() {
  const location = useLocation();
const { item } = location.state || {};
const [project, setProject] = useState(null);
const [allUsers, setAllUsers] = useState([]);
const [accountManager, setAccountManager] = useState(null);
const [latestUserComment, setLatestUserComment] = useState(null);


useEffect(() => {
  const fetchData = async () => {
    try {
      const projectId = JSON.parse(localStorage.getItem("selectedProjectId"));
      if (!projectId) return;

      const [projectRes, usersRes] = await Promise.all([
        axios.get(`${URL}/projects/${projectId}`),
        axios.get(`${URL}/auth/getAllUsers`)
      ]);

      const fetchedProject = projectRes.data;
      const fetchedUsers = usersRes.data;

      // Parse assignedTeamRoles (same as in your other page)
      fetchedProject.assignedTeamRoles = Array.isArray(fetchedProject.assignedTeamRoles)
        ? fetchedProject.assignedTeamRoles
        : JSON.parse(fetchedProject.assignedTeamRoles || '[]');

      setProject(fetchedProject);
      setAllUsers(fetchedUsers);

      // Find account manager from assigned users
      let foundAccountManager = null;

      for (const roleGroup of fetchedProject.assignedTeamRoles) {
        if (roleGroup.role === "accountmanager") {
          const userId = roleGroup.users[0]; // assuming only one account manager
          foundAccountManager = fetchedUsers.find(u => u.id.toString() === userId.toString());
          break;
        }
      }

      setAccountManager(foundAccountManager);
const commentsRes = await axios.get(`${URL}/items/${item.id}/comments`);
const allComments = commentsRes.data;

const userComments = allComments.filter(cmt => cmt.createdByType === "user");

// Get the latest one
if (userComments.length > 0) {
  setLatestUserComment(userComments[0]); 
}

    } catch (error) {
      console.error("Error fetching project or users:", error);
    }
  };

  fetchData();
}, []);

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days >= 1) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours >= 1) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes >= 1) {
    return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
  } else {
    return "just now";
  }
};

  return (
    <div>
      <div className='HeaderTop'>
        <HeaderTab title={"Davis Chairs"} />
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.etdEta}>
            <div className={styles.topFlex}>
            <div className={styles.etd}>
  <h5>ETD</h5>
  <p>{new Date(item?.expectedDeliveryDate).toLocaleDateString()}</p>
</div>

              <div className={styles.divider}></div>
              <div className={styles.eta}>
  <h5>ETA</h5>
  <p>{new Date(item?.expectedArrivalDate).toLocaleDateString()}</p>
</div>
            </div>
          </div>

          <div className={styles.orderInfo}>
            <div className={styles.orderDetails}>
              <div className={styles.orderD1}>
             <img src='Svg/timer.svg' alt=''/>
             <p className={styles.TimeHour}>
  {formatTimeAgo(item?.createdAt)}
</p>

              </div>

              <div className={styles.orderD2}>
                {/* <div className={styles.orderImage}>
                  <img
                    src="/Images/ChairImg.png"
                    className={styles.productImage}
                    alt="Order" />
                </div> */}
                 <p className={styles.productName}>{item?.itemName || "Unnamed Item"}</p>

              </div>

              <div className={styles.orderD3}>
                <p className={styles.productUpdate}>Project Delivery Update</p>
                <button className={styles.bookCall}>Book a Call</button>
              </div>
            </div>
            <div className={styles.CutPicDesign}>
              <img src="/Svg/CutPicDesign.svg" alt="Status" />
            </div>
          </div>
        </div>


        <div className={styles.projectDetails}>
          <h4>Project Details</h4>
          <div className={styles.details}>
          <div className={styles.contactInfo}>
  <div className={styles.contactItem}>
    <img src="/Svg/telecall.svg" alt="Contact" />
    <div className={styles.contactText}>
      <p className={styles.contactTextpara}>
        {accountManager
          ? `${accountManager.firstName} ${accountManager.lastName}`
          : "No account manager assigned"}
        <span> (Account Manager)</span>
      </p>
      <p className={styles.contactTextpara1}>
        {accountManager?.mobileNumber || "N/A"}
      </p>
    </div>
  </div>
</div>


<div className={styles.address}>
  <img src="/Svg/Location-bhouse.svg" alt="Address" />
  <p className={styles.contactTextpara1}>
    {project?.deliveryAddress || 'No address provided'}
  </p>
</div>




<div className={styles.DestinationAd}>
<img
  src={
    latestUserComment?.profilePhoto
      ? `${url2}/${latestUserComment.profilePhoto}`
      : `/assets/Default_pfp.jpg`
  }
  alt="User Profile"
  className={styles.userProfileImage}
/>

  <div className={styles.status}>
    <p className={styles.contactTextpara1}>
      {latestUserComment?.comment || "No updates yet from team."}
    </p>
    {latestUserComment && (
      <div className={styles.footer}>
        <p className={styles.footerp1}>
          {latestUserComment.createdByName}
          {latestUserComment.userRole && (
            <span className={styles.userRole}> ({latestUserComment.userRole})</span>
          )}
        </p>
        <p className={styles.footerp2}>
          {new Date(latestUserComment.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
    )}
  </div>
</div>



          </div>


        </div>


        <div>

        </div>


      </div>
      <div className={styles.commentSection}>

        <CommentBox />

      </div>
    </div>
  )
}

export default OrderInfo