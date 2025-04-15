import React, { useEffect, useState } from 'react';
import styles from '../Docs2/Docs2.module.css';
import Modal from '../Modal/Modal'; // Make sure the import path is correct
import { url2 } from '../../config/url';
import URL from '../../config/api';
import axios from 'axios';
const Docs2 = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [comments, setComments] = useState()
    const fetchComments = async () => {
        let id = JSON.parse(localStorage.getItem('selectedProjectId'))
        let filePath = selectedDoc?.fileUrl?.replace(/^\/+/, ''); // removes leading "/"

        // Step 2: Replace all forward slashes with backslashes
        filePath = filePath.replaceAll('/', '\\');

        // Step 3: Encode the path
        const encodedPath = encodeURIComponent(filePath);

        // Step 4: Use in URL
        const data = await axios.get(
            `http://localhost:5000/api/projects/${id}/file-comments?filePath=${encodedPath}`
        );
        console.log(data, "data")
        setComments(data?.data)

    }
    useEffect(() => {
        fetchComments()
    }, [selectedDoc])
    const documents = [
        { title: "Detailed Proposal", icon: "Svg/Coi.svg" },
        { title: "Options Presentation", icon: "Svg/Coi.svg" },
        { title: "Floor Plan", icon: "Svg/Coi.svg" },
        { title: "CAD File", icon: "Svg/Coi.svg" },
        { title: "Sales Agreement", icon: "Svg/Coi.svg" },
    ];

    const proposals = JSON.parse(data.proposals || '[]');
    const floorPlans = JSON.parse(data.floorPlans || '[]');

    const handleCommentClick = (doc) => {
        let fileUrl = null;

        if (doc.title === "Detailed Proposal" && proposals.length > 0) {
            fileUrl = `/${proposals[0].replace(/\\/g, '/')}`;
        } else if (doc.title === "Floor Plan" && floorPlans.length > 0) {
            fileUrl = `/${floorPlans[0].replace(/\\/g, '/')}`;
        }

        setSelectedDoc({ ...doc, fileUrl });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
    };
    console.log(encodeURI(`${url2}${selectedDoc?.fileUrl}`))
    let handleDoc = async () => {
        window.open(`${url2}${selectedDoc?.fileUrl}`)
    }
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
                        {selectedDoc?.fileUrl ? (
                            selectedDoc?.fileUrl.endsWith('.pdf') ? (
                                <>
                                    <img src="Svg/pdf.svg" alt="PDF Placeholder" />
                                    <div onClick={handleDoc}>View pdf</div></>


                            ) : (
                                <img
                                    src={`${url2}${selectedDoc.fileUrl}`}
                                    alt={selectedDoc.title}
                                    style={{ width: '100%', maxHeight: '400px', borderRadius: '8px', objectFit: 'contain' }}
                                />
                            )
                        ) : (
                            <img src="Svg/pdf.svg" alt="PDF Placeholder" />
                        )}
                    </div>
                    {comments?.length ? (
                        <>
                            {comments.map((item, index) => (
                                <div className={styles.commentList} key={index}>
                                    <div className={styles.commentBubble}>
                                        <p>{item.comment}</p> {/* Assuming item.comment contains the text */}
                                    </div>
                                    <span>
                                        {new Date(item.createdAt)
                                            .toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: 'long',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })
                                            .replace(',', '')} by {item?.user?.userRole}
                                    </span> {/* Assuming item.date contains the timestamp */}
                                </div>
                            ))}
                        </>
                    ) : null}
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