import React, { useState } from 'react';
import styles from '../Docs2/Docs2.module.css';
import Modal from '../Modal/Modal'; // Make sure the import path is correct

const Docs2 = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const documents = [
        { title: "Detailed Proposal", icon: "Svg/Coi.svg" },
        { title: "Options Presentation", icon: "Svg/Coi.svg" },
        { title: "Floor Plan", icon: "Svg/Coi.svg" },
        { title: "CAD File", icon: "Svg/Coi.svg" },
        { title: "Sales Agreement", icon: "Svg/Coi.svg" },
    ];

    const handleCommentClick = (doc) => {
        setSelectedDoc(doc);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
    };

    return (
        <div>
            <div className={styles.container}>
                {documents.map((doc, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.left}>
                            <div className={styles.icon}>
                                <img src={doc.icon} alt={doc.title} />
                            </div>
                            <span className={styles.title}>{doc.title}</span>
                        </div>
                        <div className={styles.commentLink} onClick={() => handleCommentClick(doc)}>
                            <img src='Svg/edit-icon.svg' alt="comment" />
                            <p>Comment</p>
                        </div>
                    </div>
                ))}

                <p className={styles.note}>
                    If all documents are updated, ignore this; otherwise, <b>update</b> the <b>latest one</b>.
                </p>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} height="80vh">
                <div className={styles.modalInner}>
                    <h2 className={styles.modalTitle}>{selectedDoc?.title}</h2>

                    <div className={styles.previewBox}>
                        <img src="Svg/pdf.svg" alt="PDF Preview" />
                    </div>

                    <div className={styles.commentList}>
                        <div className={styles.commentBubble}>
                            <p>I prefer a replacement if possible.</p>
                        </div>
                        <span>14 MAR 11:10 AM</span>
                        <div className={styles.commentBubble}>
                            <p>Comfortable chair but chair broken right-side handle.</p>

                        </div>
                        <span>17 MAR 10:10 AM</span>
                    </div>

                    <div className={styles.commentInput}>
                        <input
                            type="text"
                            placeholder="Comment or (Leave your thought here)"
                            className={styles.inputBox}
                        />
                        <button className={styles.commentButton} onClick={handleCloseModal}>
                            COMMENT
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Docs2;
