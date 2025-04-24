import React from 'react';
import styles from './Notification.module.css'

const NotificationView = ({ showModal, setShowModal, message }) => {
    if (!showModal) return null;
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    return (
        <div >

            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>&times;</button>
            <h2 className={styles.modalTitle}>📩 New Notification</h2>
            <p className={styles.modalMeta}>
                <strong>From:</strong> {message.senderName}<br />
                <strong>Time:</strong> {formatTime(message.createdAt)}
            </p>
            <div className={styles.modalMessage}>{message.message}</div>

        </div>
    );
};

export default NotificationView;
