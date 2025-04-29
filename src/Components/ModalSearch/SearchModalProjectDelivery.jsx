import React, { useState, useEffect } from "react";
import styles from "../ModalSearch/ModalSearch.module.css";
import URL from "../../config/api";

const SearchModalProjectDelivery = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchItems = async () => {
      try {
        const projectId = localStorage.getItem("selectedProjectId");
        if (!projectId) return;

        const res = await fetch(`${URL}/items/${projectId}`);
        const data = await res.json();
        const itemsArray = Array.isArray(data) ? data : [data];
        setItems(itemsArray);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems([]);
    } else {
      const results = items.filter((item) =>
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(results);
    }
  }, [searchTerm, items]);

  const handleSelect = (itemName) => {
    if (onSearch) onSearch(itemName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <button className={styles.outsideCloseBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.modal} style={{ minHeight: "30%", maxHeight: "80%" }}>
          <div className={styles.header}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by Item Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles.clearBtn}
                onClick={() => {
                  setSearchTerm("");    
                  if (onSearch) onSearch(""); // reset search
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.historyWrapper}>
            <h4>Project Items</h4>
            {searchTerm && filteredItems.length > 0 ? (
              <ul className={styles.historyList}>
                {filteredItems.map((item, idx) => (
                  <li
                    key={idx}
                    className={styles.historyItem}
                    onClick={() => handleSelect(item.itemName)}
                  >
                    {item.itemName}
                  </li>
                ))}
              </ul>
            ) : searchTerm ? (
              <p className={styles.emptyText}>No items found</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalProjectDelivery;
