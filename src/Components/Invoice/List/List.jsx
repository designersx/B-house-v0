import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../List/List.module.css";
import URL from "../../../config/api";
import { url2 } from "../../../config/url";
import PopUp from "../../PopUp/PopUp";
const List = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Recent");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  
  const projectId = localStorage.getItem("selectedProjectId");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    filterInvoices(invoices, option);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${URL}/projects/${projectId}/invoice`);
        const invoicesData = Array.isArray(response.data) ? response.data : [response.data];
        setInvoices(invoicesData);
        filterInvoices(invoicesData, selectedOption);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };

    if (projectId) fetchInvoices();
  }, [projectId]);

  const filterInvoices = (invoices, option) => {
    const today = new Date();
    let filtered = [];

    const getMonthsAgo = (n) => {
      const d = new Date();
      d.setMonth(today.getMonth() - n);
      return d;
    };

    switch (option) {
      case "1 Month":
        filtered = invoices.filter((i) => new Date(i.createdAt) >= getMonthsAgo(1));
        break;
      case "3 Months":
        filtered = invoices.filter((i) => new Date(i.createdAt) >= getMonthsAgo(3));
        break;
      case "6 Months":
        filtered = invoices.filter((i) => new Date(i.createdAt) >= getMonthsAgo(6));
        break;
      case "Recent":
      default:
        filtered = invoices.filter((i) => new Date(i.createdAt).getFullYear() === today.getFullYear());
        break;
    }

    setFilteredInvoices(filtered);
  };

  const formatDate = (date) => {
    const today = new Date();
    const d = new Date(date);
    const daysDiff = Math.floor((today - d) / (1000 * 3600 * 24));
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Yesterday";
    return d.toLocaleDateString();
  };

  const handleOpenFile = (filePath) => {
    if (!filePath) {
      setPopupMessage("No file has been uploaded for this invoice.");
      setShowPopup(true);
      return;
    }    
    window.open(`${url2}/${filePath}`, "_blank");
  };

  return (
    <div className={styles.ListMian}>
    {showPopup && (
  <PopUp
    type="failed"
    message={popupMessage}
    onClose={() => setShowPopup(false)}
  />
)}


      <div className={styles.Part1}>
        <div className={styles.title}>
          <p>All Invoice List</p>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropdownBtn} onClick={toggleDropdown}>
            {selectedOption}
            <span className={`${styles.arrow} ${isOpen ? styles.rotate : ""}`}>
              <img src="Svg/drop-Arrow.svg" alt="drop-Arrow" />
            </span>
          </button>
          {isOpen && (
            <ul className={styles.dropdownMenu}>
              <li onClick={() => handleSelect("Recent")}>Recent</li>
              <li onClick={() => handleSelect("1 Month")}>1 Month</li>
              <li onClick={() => handleSelect("3 Months")}>3 Months</li>
              <li onClick={() => handleSelect("6 Months")}>6 Months</li>
            </ul>
          )}
        </div>
      </div>

      <div className={styles.transactionList}>
        {filteredInvoices.length === 0 ? (
          <div className={styles.noData}>
            <div>
              <img src="Svg/notfound.svg" alt="" />
              <div className={styles.NoDataTittle}>
                <p>No items found yet</p>
                <img src="Svg/EYE1.svg" alt="" />
              </div>
            </div>
          </div>
        ) : (
          filteredInvoices.map((invoice, index) => (
            <div key={invoice.id} className={styles.transactionItem}>
              <img
                src="Svg/pdf-icon.svg"
                alt="pdf-icon"
                className={styles.image}
                onClick={() => handleOpenFile(invoice.invoiceFilePath)}
              />
              <div className={styles.details}>
                <p className={styles.title}>{`Invoice ${index + 1}`}</p>
                <div className={styles.track}>
                  <div className={styles.DFlex}>
                    <img src="Svg/timer.svg" alt="" />
                    <p className={styles.date}>{formatDate(invoice.createdAt)}</p>
                  </div>
                  <p className={styles.amount}>
                    {invoice.advancePaid
                      ? `${invoice.advancePaid.toLocaleString()} out of ${invoice.totalAmount.toLocaleString()}`
                      : `${invoice.totalAmount.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <span
                className={`${styles.status} ${
                  invoice.status === "Partly Paid"
                    ? styles.PartlyPaid
                    : invoice.status === "Paid"
                    ? styles.Paid
                    : styles.Pending
                }`}
              >
                {invoice.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
