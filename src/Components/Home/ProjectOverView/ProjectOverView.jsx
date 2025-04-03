import React from 'react'
import styles from '../ProjectOverView/ProjectOv.module.css'

function ProjectOverView() {
    return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>Project Overview</h2>
    
            {/* Lead Time & Development Cost */}
<div className={styles.FlexControl}>

            <div className={styles.grid}>
              <div>
                <p className={styles.bigText}>105 <span className={styles.subText}>Days</span></p>
                <p className={styles.label}>Lead Time</p>
              </div>

              <div>
                <p className={styles.bigText}>02 <span className={styles.subText}>out of 5</span></p>
                <p className={styles.label}>Punchlist</p>
              </div>

              
              <div className={styles.team}>
              <div className={styles.avatars}>
                <img src="/avatar1.jpg" alt="Member 1" className={styles.avatar} />
                <img src="/avatar2.jpg" alt="Member 2" className={styles.avatar} />
                <img src="/avatar3.jpg" alt="Member 3" className={styles.avatar} />
                <span className={styles.plus}>+2</span>
              </div>
              <p className={styles.label}>Team Member</p>
            </div>
            </div>
    
            {/* Punchlist & Balance Due */}
            <div className={styles.grid}>
             
            <div>
                <p className={styles.bigText}>12,310 $</p>
                <p className={styles.label}>Development Cost</p>
              </div>

              <div>
                <p className={styles.bigText}>9,830 $</p>
                <p className={styles.label}>Balance Due</p>
              </div>


              <div className={styles.advance}>
              <p className={styles.advanceText}>Advance Paid</p>
              <p className={styles.bigText}>2,480 $</p>
            </div>

            </div>

            </div>       
    
            {/* Team Members */}
            
    
            {/* Advance Paid */}
         
    
            {/* Document Received */}
            <div className={styles.document}>
              <div>
                <p className={styles.docTitle}>04 / 05 Document Received</p>
                <p className={styles.docSubtitle}>Upload latest COI document ASAP!</p>
              </div>
              <button className={styles.plusButton}>+</button>
            </div>
          </div>
        </div>
      );
    }

export default ProjectOverView