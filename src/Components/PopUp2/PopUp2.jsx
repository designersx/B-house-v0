import { useEffect } from "react";
import styles from "../PopUp2/PopUp2.module.css";

const PopUp2 = ({ isOpen, onClose, title, children, isClosable = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (isClosable && onClose) onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); 
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        {isClosable && (
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        )}
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default PopUp2;
