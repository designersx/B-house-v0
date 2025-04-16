import React from 'react'
// import styles from '../Home/OrderInfo/OrderInfo.module.css';
import styles from '../Punchlist/Punchlistdetails.module.css'
import CommentBox from '../Home/OrderInfo/CommentBox';
import Slider from "./PunchSlider";
import HeaderTab from '../HeaderTab/HeaderTab';


function PunchListDetail() {
  return (<>
    <div className='HeaderTop'>
      <HeaderTab title={"Punchlist Detail"} />
    </div>
    <div className={styles.PunchSlider}>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.etdEta}>
            <div className={styles.topFlex}>
              <div className={styles.etd}>
                <h5>STATUS</h5>
                <h4 className={styles.statusBadge}>Un-Resolved</h4>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.eta}>
                <h5>UPDATE</h5>
                <p>25 April 2025, 20:15</p>
              </div>
            </div>
          </div>
          <div className={styles.orderInfo}>
            <div className={styles.orderDetails1}>

              {/* <div className={styles.orderD1}>
                <p className={styles.orderNumber}>Order No : <strong>#125793</strong></p>
                
              </div> */}



              <Slider />


              <p className={styles.productName}>Davis Chairs</p>
              <p className={styles.productUpdate1}>The right-side handle of the chair is broken and no longer provides proper support. It may cause discomfort or imbalance while sitting and needs to be repaired or replaced to ensure safe and comfortable use.</p>




            </div>
            <div className={styles.CutPicDesign}>
              <img src="/Svg/CutPicDesign.svg" alt="Status" />
            </div>
          </div>
        </div>


        {/* <div className={styles.projectDetails}>
          <h4>Comments History</h4>
          <div className={styles.details}>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <img src="/Svg/telecall.svg" alt="Contact" />
                <div className={styles.contactText}>
                  <p className={styles.contactTextpara}>Lloyed <span>(Account Manager) </span></p>
                  <p className={styles.contactTextpara1}>+1 (555) 555-12345</p>

                </div>
              </div>
            </div>

            <div className={styles.address}>
              <img src="/Svg/Location-bhouse.svg" alt="Contact" />
              <p className={styles.contactTextpara1}>St, 2659 Buyer Lane </p>

            </div>



            <div className={styles.DestinationAd}>

              <img src="/Images/DefaultImg.png" alt="Image" />

              <div className={styles.status}>

                <p className={styles.contactTextpara1}>The order has arrived in <b>Florida</b> and is being processed for further delivery.</p>
                <div className={styles.footer}>
                  <p className={styles.footerp1}>John Vick </p>
                  <p className={styles.footerp2}>13 Mar 03:45 PM</p>
                </div>

              </div>
            </div>


          </div>


        </div> */}


        <div>

        </div>


      </div>
      <div className={styles.commentSection}>

        <CommentBox />

      </div>
    </div>
  </>
  )
}

export default PunchListDetail