import React, { useEffect, useState, useRef } from 'react';
import styles from '../Docs/Docs.module.css';
import Docs2 from '../Docs2/Docs2';
import URL from '../../config/api';
import axios from 'axios';
import PopUp from '../PopUp/PopUp';
import Comments from '../CommentThread/Comments';
import Modal from '../Modal/Modal';

const docs = [
  "Sample COI",
  "COI (Certificate)",
  "Sales Agreement",
  "Pro Forma Invoice",
  "Final Invoice",
];

function Docs() {
  const [activeTab, setActiveTab] = useState('JENNY WILSON');
  const [docsData, setDocsData] = useState([]);
  const fileInputRef = useRef(null);
  const [currentDocType, setCurrentDocType] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDocs = async () => {
    const id = JSON.parse(localStorage.getItem('selectedProjectId'));
    try {
      const res = await axios.get(`${URL}/customerDoc/document/${id}`);
      setDocsData(res.data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

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
    fileInputRef.current.click();
  };

  const openCommentModal = (docId) => {
    setSelectedDocId(docId);
    setIsModalOpen(true);
  };

  const closeCommentModal = () => {
    setSelectedDocId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>List of Docs</h2>

      {showPopup && !isLoading && (
        <PopUp type="success" message="File has been uploaded" />
      )}

      <div className={styles.tabs}>
        {['JENNY WILSON', 'B-HOUSE DOCS'].map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'JENNY WILSON' ? (
        <div className={styles.docList}>
          {docs.map((doc, idx) => {
            const foundDoc = docsData.find(d => d.documentType === doc);
            return (
              <div key={idx} className={styles.docItem}>
                <div className={styles.leftSection}>
                  <div className={styles.icon}>
                    <img src="Svg/Coi.svg" alt="icon" />
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
                  {foundDoc ?  
                  <div className={styles.editFlex}>
                  <img src="Svg/edit-icon.svg" alt="edit-icon" />
                  <p
                    onClick={() => foundDoc && openCommentModal(foundDoc.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    Comment
                  </p>
                </div>
                  :  null}
                  
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.bHouseContent}>
          <Docs2 data={docsData} />
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
        <Modal isOpen={isModalOpen} onClose={closeCommentModal} height="80%">
          <Comments
            documentId={selectedDocId}
            customerId={JSON.parse(localStorage.getItem('customerId'))}
            onClose={closeCommentModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default Docs;
