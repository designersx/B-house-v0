import React, { useEffect, useState } from 'react';
import styles from '../Punchlist/Punchlistdetails.module.css';
import Slider from "./PunchSlider";
import HeaderTab from '../HeaderTab/HeaderTab';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import URL from '../../config/api';
import CommentThread from '../CommentThread/CommentThread';
import { url2 } from "../../config/url";

function PunchListDetail() {
  const location = useLocation();
  const { punchId } = location.state || {};

  const [punchItem, setPunchItem] = useState(null);

  useEffect(() => {
    const fetchPunchItem = async () => {
      try {
        const res = await axios.get(`${URL}/punch-list/${punchId}`);
        const data = res.data;
    
        // Make sure productImages is an array
        data.productImages = Array.isArray(data.productImages)
          ? data.productImages
          : JSON.parse(data.productImages || '[]');
    
        setPunchItem(data);
      } catch (err) {
        console.error("Error fetching punch item details:", err);
      }
    };
    
    if (punchId) {
      fetchPunchItem();
    }
  }, [punchId]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      <div className='HeaderTop'>
        <HeaderTab title={"Punchlist Detail"} />
      </div>

      <div className={styles.PunchSlider}>
        <div className={styles.container}>
          {punchItem && (
            <>
              <div className={styles.header}>
                <div className={styles.etdEta}>
                  <div className={styles.topFlex}>
                    <div className={styles.etd}>
                      <h5>STATUS</h5>
                      <h4
  className={`${styles.statusBadge} ${
    punchItem.status === 'Resolved'
      ? styles.resolved
      : punchItem.status === 'Rejected'
      ? styles.rejected
      : styles.pending
  }`}
>
  {punchItem.status}
</h4>

                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.eta}>
                      <h5>UPDATE</h5>
                      <p>{formatDateTime(punchItem.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.orderInfo}>
                {punchItem && (
                  <div className={styles.orderDetails1}>
                  <Slider images={punchItem.productImages} />
                    <p className={styles.productName}>{punchItem.category}</p>
                    <p className={styles.productUpdate1}>{punchItem.issueDescription}</p>
                  </div>
                )}
                  <div className={styles.CutPicDesign}>
                    <img src="/Svg/CutPicDesign.svg" alt="Status" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.commentSection}>
          {punchItem && <CommentThread issue={punchItem} />}
        </div>

      </div>
    </>
  );
}

export default PunchListDetail;
