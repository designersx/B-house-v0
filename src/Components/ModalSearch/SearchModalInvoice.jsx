import React, { useState, useEffect } from "react";
import styles from "../ModalSearch/ModalSearch.module.css";
import URL from "../../config/api";
const SearchModalInvoice = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchInvoices = async () => {
      try {
        const projectId = localStorage.getItem("selectedProjectId");
        if (!projectId) return;
        const res = await fetch(`${URL}/projects/${projectId}/invoice`);
        const data = await res.json();
        const invoiceArray = Array.isArray(data) ? data : [data];
        setInvoices(invoiceArray);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, [isOpen]);

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectInvoice = (invoiceNo) => {
    if (onSearch) {
      onSearch(invoiceNo);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <button className={styles.outsideCloseBtn} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modal}>
          <div className={styles.header}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search Invoice Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles.clearBtn}
                onClick={() => {
                  setSearchTerm("");
                  if (onSearch) onSearch("");
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.historyWrapper}>
            <h4>Invoices</h4>
            {filteredInvoices.length > 0 ? (
              <ul className={styles.historyList}>
                {filteredInvoices.map((inv, idx) => (
                  <li
                    key={idx}
                    className={styles.historyItem}
                    onClick={() => handleSelectInvoice(inv.invoiceNumber)}
                  >
                    {inv.invoiceNumber}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyText}>No invoices found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalInvoice;
