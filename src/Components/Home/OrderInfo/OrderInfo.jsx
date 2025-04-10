import React from 'react'
import styles from './OrderInfo.module.css';

function OrderInfo() {
  return (
    <div className={styles.container}>
    <div className={styles.header}>
      <div className={styles.etdEta}>
        <div className={styles.etd}>
            <h5>ETD</h5> 
            <p>18 April 2025, 16:45</p>
        </div>
        <hr></hr>
        <div className={styles.eta}>
            <h5>ETA</h5> 
        
            <p>20 April 2025, 16:45</p>
        </div>
      </div>
      <div className={styles.orderInfo}>
        <div className={styles.orderDetails}>
          
            <div className={styles.orderD1}>
          <p className={styles.orderNumber}>Order No : <strong>#125793</strong></p>
          <p className={styles.TimeHour}>3 hrs ago</p>
          </div>

<div className={styles.orderD2}>
        <div className={styles.orderImage}>
          <img
            src="/Images/ChairImg.png"
            className={styles.productImage} 
            alt="Order" />
        </div>
          <p className={styles.productName}>Executive ErgoPro</p>

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


      </div>


<div>

    <div className={styles.commentSection}>
</div>
</div>


  </div>
  )
}

export default OrderInfo