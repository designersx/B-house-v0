import React, { useEffect, useState, useRef } from 'react';
import styles from '../Docs/Docs.module.css';
import Docs2 from '../Docs2/Docs2';
import URL from '../../config/api';
import axios from 'axios';
import PopUp from '../PopUp/PopUp';
import Comments from '../CommentThread/Comments';
import Modal from '../Modal/Modal';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
const docs = [
  "Sample COI",
  "COI (Certificate)",
  "Sales Agreement",
  "Pro Forma Invoice",
  "Final Invoice",
];
const iconMap = {
  "Sample COI": "Svg/Coi.svg",
  "COI (Certificate)": "Svg/certificate-coi-icon.svg",
  "Sales Agreement": "Svg/sales-icon.svg",
  "Pro Forma Invoice": "Svg/proforma-invoice.svg",
  "Final Invoice": "Svg/final-invoice.svg",
};
function Docs() {
  const customer = JSON.parse(localStorage.getItem('customerInfo'));
  const customerName = customer?.full_name || "My Docs";
  const [activeTab, setActiveTab] = useState(customerName);
  const [docsData, setDocsData] = useState([]);
  const fileInputRef = useRef(null);
  const [currentDocType, setCurrentDocType] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocTitle, setSelectedDocTitle] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalDocs, setTotalDocs] = useState(0);
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate()
  const fetchDocs = async () => {
    const id = JSON.parse(localStorage.getItem('selectedProjectId'));
    try {
      const res = await axios.get(`${URL}/customerDoc/document/${id}`);
      setDocsData(res.data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentDocType) return;

    setLoading(true);
    const projectId = JSON.parse(localStorage.getItem('selectedProjectId'));

    const existingDoc = docsData.find(d => d.documentType === currentDocType);
    const endpoint = existingDoc ? 'update' : 'add';
    const method = existingDoc ? 'put' : 'post';

    const formData = new FormData();
    formData.append('documentType', currentDocType);
    formData.append('document', file);
    formData.append('projectId', projectId);

    try {
      const config = {
        method,
        url: `${URL}/customerDoc/${endpoint}`,
        data: formData,
      };

      const res = await axios(config);
      if (res?.status === 201 || res?.status === 200) {
        setShowPopup(true);
        fetchDocs();
      }
    } catch (err) {
      console.error('Upload/Update failed:', err);
    } finally {
      setLoading(false);
      setCurrentDocType('');
    }
  };

  const handleUploadClick = (docType) => {
    setCurrentDocType(docType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const openCommentModal = async (docId, docTitle) => {
    try {
      const documentId = docId
      setSelectedDocId(docId);
      setSelectedDocTitle(docTitle);
      setIsModalOpen(true);
      await axios.put(`${URL}/customerDoc/updateCommentsIsReadByDocumentId/${documentId}`);
      fetchUnreadCountsForAllDocs()
    } catch (err) {
      console.error('Failed to mark comments as read:', err);
    }
  };
  const closeCommentModal = () => {
    setSelectedDocId(null);
    setIsModalOpen(false);
  };
  //function lock
  useEffect(() => {
    if (message) {

      // Automatically switch to B-HOUSE DOCS if message.documentType is 'proposals' (case-insensitive match)
      if (message.filePath) {

        const documentKey = message.documentType.toLowerCase();
        const validDocKeys = [
          'proposals',
          'floorplans',
          'cad',
          'salesaggrement',
          'presentation',
          'acknowledgements',
          'receivingreports',
          'otherdocuments'
        ];

        if (validDocKeys.includes(documentKey)) {
          setActiveTab('B-HOUSE DOCS');
        }
      } else {
        setActiveTab(customerName);
        openCommentModal(message.documentId, message.documentType);
        setTimeout(() => {
          navigate(location.pathname, { replace: true });
        }, 1000);

      }


    }
  }, [message]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);
  useEffect(() => {
    fetchDocs();
  }, []);
  const tabRefs = useRef([]);
  const fetchUnreadCountsForAllDocs = async () => {
    const customer = JSON.parse(localStorage.getItem('customerInfo'));
    const customerId = customer?.id;

    if (!customerId || !docsData.length) return;

    const counts = {};

    await Promise.all(
      docsData.map(async (doc) => {
        try {
          const res = await axios.get(`${URL}/customerDoc/comments/${doc.id}?customerId=${customerId}`);
          const unreadComments = res.data.filter(comment => comment.isRead === false);
          counts[doc.id] = unreadComments.length || 0;
        } catch (err) {
          console.error(`Error fetching comments for doc ID ${doc.id}`, err);
        }
      })
    );

    setUnreadCounts(counts);
  };
  useEffect(() => {
    fetchUnreadCountsForAllDocs();
  }, [docsData]);

  // Decrease count when a comment is viewed
  const handleCommentViewed = (docId) => {
    setUnreadCounts(prev => ({
      ...prev,
      [docId]: prev[docId] > 0 ? prev[docId] - 1 : 0
    }));
  };

  return (
    <div className={styles.container}>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <Loader />
        </div>
      )}
      <h2 className={styles.heading}>List of Docs</h2>

      {showPopup && !isLoading && (
        <PopUp type="success" message="File has been uploaded" />
      )}

      <div className={styles.tabs}>



        {[customerName, 'B-HOUSE DOCS'].map((tab, index) => {
          const isCustomerTab = tab === customerName
          const unreadCount = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
          return (
            <>  <button
              key={tab}
              ref={el => tabRefs.current[index] = el}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {/* {isCustomerTab && unreadCount > 0 && (
                <span style={{ marginLeft: '6px', color: 'red', fontWeight: 'bold' }}>
                  ({unreadCount})
                </span>
              )} */}
            </button>    </>
          )

        })}
        <div className={styles.tabIndicator} style={{ left: activeTab === customerName ? '0%' : '50%' }} />
      </div>


      {activeTab === customerName ? (
        <div className={styles.docList}>
          {docs.map((doc, idx) => {
            const foundDoc = docsData.find(d => d.documentType === doc);
            const iconSrc = iconMap[doc] || 'Svg/default-icon.svg';

            return (
              <div key={idx} className={styles.docItem}>
                <div onClick={foundDoc ? () => openCommentModal(foundDoc.id, doc) : null} className={styles.leftSection}>
                  <div className={styles.icon}>
                    <img src={iconSrc} alt="icon" />
                  </div>
                  <span className={styles.docTitle}>{doc}</span>
                </div>

                <div className={styles.rightSection}>
                  <button
                    className={styles.updateBtn}
                    onClick={() => handleUploadClick(doc)}
                    disabled={isLoading}
                  >
                    {foundDoc ? 'Update' : 'Upload'}
                  </button>

                  {foundDoc && (
                    <div className={styles.editFlex}>
                      <img src="Svg/edit-icon.svg" alt="edit-icon" />
                      <p
                        onClick={() => openCommentModal(foundDoc.id, doc)}
                        style={{ cursor: 'pointer' }}
                      >
                        Comment
                      </p>
                      {unreadCounts[foundDoc.id] > 0 && (
                        <span style={{color: 'red', fontWeight: 'bold' }}>
                          ({unreadCounts[foundDoc.id]})
                        </span>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
          <p className={styles.note}>
            If all documents are updated, ignore this; otherwise, <b>update</b> the <b>latest one</b>.
          </p>
        </div>

      ) : (
        <div className={styles.bHouseContent}>
          <Docs2 onTotalDocsChange={setTotalDocs} data={docsData} />
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {activeTab === 'JENNY WILSON' && (
        <p className={styles.note}>
          If all documents are updated, ignore this; otherwise, <b>update</b> the <b>latest one</b>.
        </p>
      )}

      {/* Comment Modal */}
      {selectedDocId && (
        <Modal isOpen={isModalOpen} onClose={closeCommentModal} height="90%">
          <h2 className={styles.modalTitle}>{selectedDocTitle}</h2>
          <Comments
            documentId={selectedDocId}
            customerId={JSON.parse(localStorage.getItem('customerId'))}
            onClose={closeCommentModal}
            onView={handleCommentViewed}

          />
        </Modal>
      )}
    </div>
  );
}

export default Docs;
