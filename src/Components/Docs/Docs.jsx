import React, { useState } from 'react';
import styles from '../Docs/Docs.module.css';
import Docs2 from '../Docs2/Docs2';

const docs = [
  "Sample COI",
  "COI (Certificate)",
  "Sales Agreement",
  "Pro Forma Invoice",
  "Final Invoice",
];

function Docs() {
  const [activeTab, setActiveTab] = useState('JENNY WILSON');

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
                <button className={styles.updateBtn}>
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
          <Docs2 />
        </div>
      )}

      {activeTab === 'JENNY WILSON' && (
        <p className={styles.note}>
          If all documents are updated, ignore this; otherwise, <b>update</b> the <b>latest one</b>.
        </p>
      )}
    </div>
  );
}

export default Docs;
