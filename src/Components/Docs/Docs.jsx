import React, { useState } from 'react';
import styles from '../Docs/Docs.module.css'
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
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateClick = (doc) => {
    setSelectedDoc(doc);     
    setIsModalOpen(true);    
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);     
    setSelectedDoc(null);   
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
          {docs.map((doc, idx) => (
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
                  onClick={() => handleUpdateClick(doc)}
                >
                  Update
                </button>
                <div className={styles.editFlex}>
                  <img src='Svg/edit-icon.svg' alt='edit-icon' />
                  <p>Comment</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.bHouseContent}>
          <p className={styles.bHouseText}>B-House Docs content goes here.</p>
        </div>
      )}

      {activeTab === 'JENNY WILSON' && (
        <p className={styles.note}>
          If all documents are updated, ignore this; otherwise, <b>update</b> the <b>latest one</b>.
        </p>
      )}


      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3>{selectedDoc}</h3>
        <p>You clicked update for <strong>{selectedDoc}</strong>.</p>
    
        <button onClick={handleCloseModal} className={styles.submitButton}>Submit</button>
      </Modal>
    </div>
  );
}

export default Docs;
