import React, { useEffect, useState, useRef } from 'react';
import styles from '../Docs/Docs.module.css';
import Docs2 from '../Docs2/Docs2';
import URL from '../../config/api';
import axios from 'axios';

const docs = [
  "Sample COI",
  "COI (Certificate)",
  "Sales Agreement",
  "Pro Forma Invoice",
  "Final Invoice",
];

// Map to match frontend labels with backend keys
const docKeyMap = {
  "Sample COI": "sample_coi",
  "COI (Certificate)": "coi_certificate",
  "Sales Agreement": "sales_agreement",
  "Pro Forma Invoice": "pro_forma_invoice",
  "Final Invoice": "final_invoice"
};

function Docs() {
  const [activeTab, setActiveTab] = useState('JENNY WILSON');
  const [docsData, setDocsData] = useState({});
  const fileInputRef = useRef(null);
  const [currentDocType, setCurrentDocType] = useState('');

  const fetchDocs = async () => {
    const id = JSON.parse(localStorage.getItem('selectedProjectId'));
    try {
      const res = await axios.get(`${URL}/customerDoc/document/${id}`);
      setDocsData(res.data);
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

    const key = docKeyMap[currentDocType];
    const hasDoc = docsData[key];
    const endpoint = hasDoc ? 'update' : 'add';

    const formData = new FormData();
    formData.append('documentType', currentDocType);
    formData.append('document', file);
    formData.append('projectId', JSON.parse(localStorage.getItem('selectedProjectId')));

    try {
      await axios.post(`${URL}/customerDoc/${endpoint}`, formData);
      fetchDocs(); // Refresh data after upload/update
    } catch (err) {
      console.error('Upload/Update failed:', err);
    }
  };

  const handleUploadClick = (docType) => {
    setCurrentDocType(docType);
    fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>List of Docs</h2>

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
            const key = docKeyMap[doc];
            const hasDoc = docsData[key];

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
                  >
                    {hasDoc ? 'Update' : 'Upload'}
                  </button>
                  <div className={styles.editFlex}>
                    <img src='Svg/edit-icon.svg' alt='edit-icon' />
                    <p>Comment</p>
                  </div>
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
    </div>
  );
}

export default Docs;
