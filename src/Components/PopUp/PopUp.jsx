import React, { useState, useEffect } from 'react'
import styles from '../PopUp/PopUp.module.css'

const PopUp = ({ type, message, onClose = () => {}, onConfirm = () => {} }) => {
    const [show, setShow] = useState(false);
  
    useEffect(() => {
      if (message) setShow(true);
    }, [message]);
  
    const handleClose = () => {
      setShow(false);
      setTimeout(() => onClose(), 300);
    };
  
    const getIconPath = () => {
      switch (type) {
        case "success":
          return "Svg/sucess-icon.svg";
        case "failed":
          return "Svg/failed-icon.svg";
        case "confirm":
          return "Svg/confirmation-icon.svg";
        default:
          return "";
      }
    };
  
    return (
      message && (
        <div className={`${styles.overlay} ${show ? styles.fadeIn : styles.fadeOut}`}>
          <div className={`${styles.popup} ${styles[type]} ${show ? styles.scaleIn : styles.scaleOut}`}>
            <img src={getIconPath()} alt={type} className={`${styles.icon} ${styles.animateIcon}`} />
            <p className={styles.message}>{message}</p>
  
            {type === "confirm" ? (
              <div className={styles.buttons}>
                <button className={styles.cancel} onClick={handleClose}>Cancel</button>
                <button
                  className={styles.confirmBtn}
                  onClick={() => {
                    onConfirm();
                    handleClose();
                  }}
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button className={styles.close} onClick={handleClose}>Close</button>
            )}
          </div>
        </div>
      )
    );
  };
  

export default PopUp
