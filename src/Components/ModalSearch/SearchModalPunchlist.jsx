import React, { useState, useEffect } from "react";
import styles from "../ModalSearch/ModalSearch.module.css";
import URL from "../../config/api";

const SearchModalPunchlist = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [punchlists, setPunchlists] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPunchlists = async () => {
      try {
        const projectId = localStorage.getItem("selectedProjectId");
        if (!projectId) return;
        const res = await fetch(`${URL}/projects/${projectId}/punch-list`);
        const data = await res.json();
        const punchlistArray = Array.isArray(data) ? data : [data];
        setPunchlists(punchlistArray);
      } catch (error) {
        console.error("Error fetching punchlists:", error);
      }
    };

    fetchPunchlists();
  }, [isOpen]);

  const filteredPunchlists = punchlists.filter((item) =>
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelect = (category) => {
    if (onSearch) onSearch(category);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <button className={styles.outsideCloseBtn} onClick={onClose}>✕</button>
        <div className={styles.modal} style={{ minHeight: "30%", maxHeight: "80%" }}>
          <div className={styles.header}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by Category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className={styles.clearBtn} onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>

          <div className={styles.historyWrapper}>
            <h4>Punchlists</h4>
            {filteredPunchlists.length > 0 ? (
        <ul className={styles.historyList}>
          {filteredPunchlists.map((item, idx) => (
            <li key={idx} className={styles.historyItem} onClick={() => handleSelect(item.category)}> 
              {item.category}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyText}>No punchlists found</p>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalPunchlist;
