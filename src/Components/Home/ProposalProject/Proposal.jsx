import React, { useState } from "react";
import styles from "./Proposal.module.css";

function Proposal() {
  // Dynamic background color state
  

  const steps = [
    { id: 1, img: "/Svg/docs.svg", label: "Docs", count: "08", color: "#A5C9FF",colorSmall: "#B8DFFF" },
    { id: 2, img: "/Svg/tracking.svg", label: "Tracking", count: "04", color: "#F9C74F",colorSmall: "#FFCD88" },
    { id: 3, img: "/Svg/invoice.svg", label: "Invoice", count: "02", color: "#F94144",colorSmall: "#FF8D90" },
    { id: 4, img: "/Svg/team.svg", label: "Team", count: "01", color: "#90BE6D",colorSmall: "#D9D9D9" },
    { id: 5, img: "/Svg/EIN.svg", label: "EIN", count: "05", color: "#577590",colorSmall: "#FFEA81" },
  ];

  return (
    <div className={styles.container} >
      {/* Header Section */}
      <div className={styles.header}>
        <h4 className={styles.statusBadge}>Proposal in Progress</h4>

        <div className={styles.projectSelector}>
          <span className={styles.projectTitle}>Project: </span>
          <select>
            <option value="project1">O Towers</option>
            <option value="project2">1 Towers</option>
          </select>
        </div>

        <p className={styles.subText}>Here's what's happening with your projects</p>
      </div>

      {/* Progress Tracker Section */}
      <div className={styles.progressTracker}>
        {steps.map((step) => (
          <div key={step.id} className={styles.step}>
            <div className={styles.circle} >
              <div className={styles.count} style={{ backgroundColor: step.colorSmall }}>
                <span>{step.count}</span>
              </div>
              <img src={step.img} alt={step.label} className={styles.icon} />
            </div>
            <p className={styles.label}>{step.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        {steps.map((step) => (
          <div key={step.id} className={styles.barSegment} style={{ backgroundColor: step.color }}></div>
        ))}
      </div>

      {/* Background Color Change Buttons */}
    
    </div>
  );
}

export default Proposal;
