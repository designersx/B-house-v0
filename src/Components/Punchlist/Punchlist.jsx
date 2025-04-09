import React from 'react';
import styles from '../Punchlist/Punchlist.module.css';
function Punchlist() {
 

  const issues = [
    {
      status: "Un-Resolved",
      date: "13 MAR 03:45 PM",
      title: "Davis Chairs",
      description: "Right Side Handle Broken",
      images: ["Images/chair1.png", "Images/chair2.png", "Images/chair3.png"],

      comments: false,
    },
    {
      status: "Resolved",
      date: "05 MAR 03:45 PM",
      title: "Davis Table",
      description: "Right Corner Damages",
      images: ["Images/chair1.png", "Images/chair2.png", "Images/chair3.png"],
      comments: false,
    },
    {
      status: "Un-Resolved",
      date: "10 MAR 10:12 AM",
      title: "Andreu World",
      description: "Loose Hinges or Handles",
      images: [
        "Images/chair1.png",
        "Images/chair2.png",
        "Images/chair3.png",
        "Images/chair4.png",
        "Images/chair5.png",
      ],
      comments: {
        userimg: "Images/userImg.png",
        user: "John Vick",
        time: "12 MAR 11:38 PM",
        message: "This is not an issue, it's just an adjustment.",
      },
    },
    {
      status: "Resolved",
      date: "05 MAR 03:45 PM",
      title: "Davis Table",
      description: "Right Corner Damages",
      images: ["Images/chair1.png", "Images/chair2.png", "Images/chair3.png"],
      comments: false,
    },
  ];

  return (
    <div className={styles.container}>
      {issues.map((issue, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.topRow}>
            <span
              className={`${styles.status} ${issue.status === 'Resolved' ? styles.resolved : styles.unresolved}`}
            >
              {issue.status}
            </span>
            <span className={styles.date}>{issue.date}</span>
          </div>

          <div className={styles.title}>
            <b>{issue.title}</b> – {issue.description}
          </div>

          <div className={styles.flexD}>
            <div className={styles.imageRow}>
              {issue.images.slice(0, 3).map((img, i) => (
                <img key={i} src={img} alt="issue" className={styles.image} />
              ))}
              {issue.images.length > 3 && (
                <div className={styles.moreImages}>+{issue.images.length - 3}</div>
              )}
            </div>

            <div className={styles.commentLink}>
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
      ))}

      
    </div>
  );
}

export default Punchlist;
