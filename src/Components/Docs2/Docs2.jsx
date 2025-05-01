import React, { useEffect, useState, useRef } from 'react';
import styles from '../Docs2/Docs2.module.css';
import Modal from '../Modal/Modal';
import { url2 } from '../../config/url';
import URL from '../../config/api';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
const Docs2 = ({ onTotalDocsChange }) => {
    const [newComment, setNewComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false)
    const [commentCounts, setCommentCounts] = useState({});
    const location = useLocation();
    const bottomRef = useRef(null);
    const message = location.state?.message;
    const navigate = useNavigate()

    const [projectData, setProjectData] = useState({
        proposals: [],
        floorPlans: [],
        cad: [],
        salesAggrement: [],
        otherDocuments: [],
        presentation: [],
        acknowledgements: [],
        receivingReports: [],
    });
    const handleAddComment = async () => {
        setLoading(true);
        const commentText = newComment.trim();
        if (!commentText || !selectedDoc?.fileUrl) return;
    
        const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));
        const clientInfo = JSON.parse(localStorage.getItem('customerInfo'));
    
        let windowsPath = selectedDoc.fileUrl;
        if (windowsPath.startsWith("/")) {
            windowsPath = windowsPath.substring(1);
        }
    
        const titleToCategory = {
            'Detailed Proposal': 'proposals',
            'Options Presentation': 'presentation',
            'Floor Plan': 'floorPlans',
            'CAD File': 'cad',
            'Sales Agreement': 'salesAggrement',
            'Product Maintenance': "otherDocuments",
        };
    
        const category = titleToCategory[selectedDoc?.title] || 'otherDocuments';
        const tempComment = {
            comment: commentText,
            createdAt: new Date().toISOString(),
            customer: true, 
        };
    
        // Update UI immediately
        setComments((prev) => [...prev, tempComment]);
        setNewComment('');
    
        try {
            await axios.post(`${URL}/projects/${projectId}/file-comments`, {
                comment: commentText,
                filePath: windowsPath,
                clientId: clientInfo?.id,
                category,
            });
    
           
            fetchComments(selectedDoc.fileUrl);
        } catch (error) {
            console.error('Error posting comment:', error);
            
        } finally {
            setLoading(false);
        }
    };
    


    const fetchProject = async () => {
        const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));
        try {
            const res = await axios.get(`${URL}/projects/${projectId}`);
            const project = res.data;

            setProjectData({
                proposals: JSON.parse(project.proposals || '[]'),
                floorPlans: JSON.parse(project.floorPlans || '[]'),
                cad: JSON.parse(project.cad || '[]'),
                salesAggrement: JSON.parse(project.salesAggrement || '[]'),
                presentation: JSON.parse(project.presentation || '[]'),
                otherDocuments: JSON.parse(project.otherDocuments || '[]'),
                acknowledgements: JSON.parse(project.acknowledgements || '[]'),
                receivingReports: JSON.parse(project.receivingReports || '[]'),

            });
            fetchAllComments(project)
        } catch (err) {
            console.error('Failed to fetch project:', err);
        }
    };

    const fetchComments = async (fileUrl) => {
        if (!fileUrl) return;
        const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));
        let filePath = fileUrl;
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }
        try {
            const res = await axios.get(`${URL}/projects/${projectId}/file-comments`,
                {
                    params: { filePath }
                }
            );
            setComments(res.data || []);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        }
    };
    const fetchAllComments = async (project) => {
        const allFileFields = [
            'proposals',
            'floorPlans',
            'cad',
            'salesAggrement',
            'presentation',
            'otherDocuments',
            'acknowledgements',
            'receivingReports'
        ];

        const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));
        const newCommentCounts = {};

        for (const field of allFileFields) {
            const files = JSON.parse(project[field] || '[]');

            for (const file of files) {
                let filePath = file.url || file.filePath || file; // adjust based on your file object structure

                if (filePath.startsWith("/")) {
                    filePath = filePath.substring(1);
                }

                try {
                    const res = await axios.get(`${URL}/projects/${projectId}/file-comments`, {
                        params: { filePath }
                    });

                    // Filter comments where isRead is false
                    const unreadComments = res.data.filter(comment => comment.isRead === false);



                    newCommentCounts[filePath] = res.data.length || 0;
                } catch (err) {
                    console.error(`Failed to fetch comments for ${filePath}:`, err);
                    newCommentCounts[filePath] = 0;
                }
            }
        }

        setCommentCounts(newCommentCounts);

    };
    useEffect(() => {
        fetchProject();
    }, []);

    const handleCommentClick = (docTitle, fileUrl) => {

        const normalizedUrl = `/${fileUrl?.replace(/\\/g, '/')}`;

        setSelectedDoc({ title: docTitle, fileUrl: normalizedUrl });
        fetchComments(normalizedUrl);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
        setComments([]);
    };
    const docList = [
        {
            title: 'Detailed Proposal',
            icon: 'Svg/detailed-proposal.svg',
            fileUrl: projectData.proposals[0] || null,
        },
        {
            title: 'Options Presentation',
            icon: 'Svg/options-presentation.svg',
            fileUrl: projectData?.presentation[0] || null, // Placeholder
        },
        {
            title: 'Floor Plan',
            icon: 'Svg/floor-plan.svg',
            fileUrl: projectData.floorPlans[0] || null,
        },
        {
            title: 'CAD File',
            icon: 'Svg/cad-file.svg',
            fileUrl: projectData?.cad[0] || null // Placeholder
        },
        {
            title: 'Sales Agreement',
            icon: 'Svg/sales-icon.svg',
            fileUrl: projectData?.salesAggrement[0] || null, // Placeholder
        },
        {
            title: 'Product Maintenance',
            icon: 'Svg/Coi.svg',
            fileUrl: projectData?.otherDocuments[0] || null, // Placeholder
        },
        {
            title: 'Acknowledgements',
            icon: 'Svg/sample-icon.svg',
            fileUrl: projectData?.acknowledgements[0] || null, // Placeholder
        },
        {
            title: 'Receiving Reports',
            icon: 'Svg/final-invoice.svg',
            fileUrl: projectData?.receivingReports[0] || null, // Placeholder
        }

    ];
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]);


    useEffect(() => {
        if (message) {
            const docList = [
                {
                    key: 'proposals',
                    title: 'Detailed Proposal',
                },
                {
                    key: 'presentation',
                    title: 'Options Presentation',
                },
                {
                    key: 'floorPlans',
                    title: 'Floor Plan',
                },
                {
                    key: 'cad',
                    title: 'CAD File',
                },
                {
                    key: 'salesAggrement',
                    title: 'Sales Agreement',
                },
                {
                    key: 'receivingReports',
                    title: 'Receiving Reports',
                },
                {
                    key: 'acknowledgements',
                    title: 'Acknowledgements',
                }
            ];

            const matchedDoc = docList.find(doc => doc.key === message.documentType);
            const title = matchedDoc?.title || 'Document';
            handleCommentClick(title, message.filePath);
            navigate(location.pathname, { replace: true });
        }
    }, [message]);

    const handleDownload = async () => {
        if (!selectedDoc || !selectedDoc.fileUrl) {
            console.error('No file URL available for download.');
            return;
        }

        try {
            const fileUrl = `${url2}${selectedDoc.fileUrl}`;
            const response = await fetch(fileUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob); // ✅ use window.URL

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'CadFile.pdf'); // or a dynamic name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // ✅ Clean up

        } catch (error) {
            console.error('Failed to download PDF:', error);
        }
    };
    const totalComments = docList.reduce((total, doc) => {
        const comments = doc.comments || []; // Fallback to an empty array if comments is undefined
        return total + comments.length;
    }, 0);

    useEffect(() => {
        if (onTotalDocsChange) {
            onTotalDocsChange(totalComments);
        }
    }, [totalComments, onTotalDocsChange]);





    return (
        <div>
            <div className={styles.container}>
                {docList.map((doc, index) => (
                    <div onClick={doc.fileUrl ? () => handleCommentClick(doc.title, doc.fileUrl) : null} key={index} className={styles.card}>
                        <div className={styles.left}>
                            <div className={styles.icon}>
                                <img src={doc.icon} alt={doc.title} />
                            </div>
                            <span className={styles.title}>{doc.title}</span>
                        </div>

                        {doc.fileUrl ? (
                            <div
                                className={styles.commentLink}
                                onClick={() => handleCommentClick(doc.title, doc.fileUrl)}
                            >
                                <img src="Svg/edit-icon.svg" alt="comment" />
                                <p>Comment</p>
                                {commentCounts[doc.fileUrl?.replace(/^\//, '')] > 0 && (
                                    <span className={styles.commentCount} style={{color: 'red', fontWeight: 'bold' }}> ({commentCounts[doc.fileUrl.replace(/^\//, '')]})</span>
                                )}
                            </div>
                        ) : (
                            <div className={styles.noFile}>
                                <p style={{ color: 'gray', fontSize: '12px' }}>Not uploaded yet</p>
                            </div>
                        )}
                    </div>
                ))}

                <p className={styles.note}>
                    If all documents are updated, ignore this; otherwise, <b>update</b> the <b>latest one</b>.
                </p>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} height="92vh">
                <div className={styles.modalInner}>
                    <h2 className={styles.modalTitle}>{selectedDoc?.title}</h2>

                    {selectedDoc?.fileUrl && (
                        <div className={styles.previewBox}>
                            {selectedDoc.fileUrl.endsWith('.pdf') ? (
                                <>
                                    {/* <img src="Svg/pdf.svg" alt="PDF" /> */}

                                    {selectedDoc?.title == "CAD File" ? "No Preview" : <iframe
                                        height="400px"
                                        width="100%"
                                        src={`https://docs.google.com/gview?url=${encodeURIComponent(`${url2}${selectedDoc?.fileUrl}`)}&embedded=true`} />}

                                    &nbsp;   &nbsp;   {selectedDoc?.title == "CAD File" && <button onClick={handleDownload} className={styles.noPreviewDownloadButton} >Download</button>}

                                </>
                            ) : (
                                <img
                                    src={`${url2}${selectedDoc?.fileUrl}`}
                                    alt={selectedDoc?.title}

                                />
                            )}
                        </div>
                    )}

                    <div className={styles.chatWrapper}>
                        {comments.map((item, index) => {
                            const isUser = item.customer;
                            const isLast = index === comments.length - 1;

                            return (
                                <div
                                    key={index}
                                    ref={isLast ? bottomRef : null}
                                    className={`${styles.commentItem} ${isUser ? styles.right : styles.left}`}
                                >
                                    {!isUser && (
                                        <div className={styles.adminBlock}>
                                            <img
                                                src="Svg/admin.svg"
                                                alt="Admin DP"
                                                className={styles.avatar}
                                            />
                                            <div>
                                                <div className={styles.adminBubble}>
                                                    <p>{item.comment}</p>
                                                </div>
                                                <span className={styles.timestamp}>
                                                    {new Date(item.createdAt)
                                                        .toLocaleString("en-GB", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        .replace(",", "")}
                                                    {item?.user?.userRole ? ` by ${item?.user?.userRole}` : ""}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {isUser && (
                                        <div>
                                            <div className={styles.userBubble}>
                                                <p>{item.comment}</p>
                                            </div>
                                            <span className={`${styles.timestamp} ${styles.rightTime}`}>
                                                {new Date(item.createdAt)
                                                    .toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })
                                                    .replace(",", "")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>




                    {/* <div className={styles.commentInput}>
                        <input
                            type="text"
                            placeholder="Comment or (Leave your thought here)"
                            className={styles.inputBox}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button disabled={newComment === "" ? true : false} className={styles.commentButton} onClick={!loading ? handleAddComment : null}>
                            {!loading ? "COMMENT" : <Loader size={20} />}
                        </button>
                    </div> */}


                    {/* Ankush Code Start */}
                    <div className={styles.commentInput}>
                        <input
                            type="text"
                            placeholder="Comment or (Leave your thought here)"
                            className={styles.inputBox}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />

                        {newComment.trim() && (
                            <div
                                disabled={loading}
                                className={styles.commentButton}
                                onClick={!loading ? handleAddComment : null}
                            >
                                {!loading ? (
                                    <img src="/Svg/send-icon.svg" alt="Send" className={styles.sendIcon} />
                                ) : (
                                    <Loader size={20} />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Ankush Code End */}

                </div>
            </Modal>
        </div>
    );
};

export default Docs2;
