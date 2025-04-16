import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../List/List.module.css";
import URL from "../../../config/api"; 
import {url2} from "../../../config/url";
const List = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Recent");

  const projectId = localStorage.getItem("selectedProjectId");

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Fetch all invoices for the project
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `${URL}/projects/${projectId}/invoice`
        );
        const invoicesData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setInvoices(invoicesData); // Store invoices in state

        // Filter invoices based on selected option
        filterInvoices(invoicesData, selectedOption);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };

    if (projectId) {
      fetchInvoices();
    }
  }, [projectId]);

  // Function to filter invoices based on selected time range
  const filterInvoices = (invoices, option) => {
    const today = new Date();
    let filtered = [];

    switch (option) {
      case "Recent":
        // Filter invoices from the current year
        filtered = invoices.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate.getFullYear() === today.getFullYear();
        });
        break;

      case "1 Month":
        // Filter invoices from the last 1 month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        filtered = invoices.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= oneMonthAgo;
        });
        break;

      case "3 Months":
        // Filter invoices from the last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        filtered = invoices.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= threeMonthsAgo;
        });
        break;

      case "6 Months":
        // Filter invoices from the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        filtered = invoices.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= sixMonthsAgo;
        });
        break;

      default:
        filtered = invoices;
        break;
    }

    setFilteredInvoices(filtered);
  };

  // Format the created date for display
  const formatDate = (date) => {
    const today = new Date();
    const createdDate = new Date(date);
    const timeDiff = today - createdDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
      return "Today";
    } else if (daysDiff === 1) {
      return "Yesterday";
    } else {
      return createdDate.toLocaleDateString(); // Format as needed
    }
  };

  const handleOpenFile = (filePath) => {
    window.open(`${url2}/${filePath}`, "_blank");
  };

  return (
    <div className={styles.ListMian}>
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
        {/* Render filtered invoices dynamically */}
        {filteredInvoices.length === 0 ? (
           <div className={styles.noData}>
                    <div><img src="Svg/notfound.svg" alt=""/>
                    <div className={styles.NoDataTittle}><p>No items found yet</p><img src="Svg/EYE1.svg" alt=""/></div></div>
                  </div>
        ) : (
          filteredInvoices.map((invoice, index) => {
            return (
              <div key={invoice.id} className={styles.transactionItem}>
                <img
                  src="Svg/pdf-icon.svg"
                  alt="pdf-icon"
                  className={styles.image}
                  onClick={() => handleOpenFile(invoice.invoiceFilePath.split("/").pop())}
                />
                <div></div>
                <div className={styles.details}>
                  <p className={styles.title}>{`Invoice ${index + 1}`}</p>
                  <div className={styles.track}>
                    <div className={styles.DFlex}>
                      <img src="Svg/timer.svg" alt="" />
                      <p className={styles.date}>
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>
                    {/* Show advance paid as 'Advance Paid / Total Amount' */}
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
                      : invoice.status === "Pending"
                      ? styles.Pending
                      : ""
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default List;
