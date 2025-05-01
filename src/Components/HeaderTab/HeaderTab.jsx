import React, { useState, useEffect } from "react";
import styles from "../HeaderTab/HeaderTab.module.css";
import { useNavigate, useLocation } from "react-router-dom";
// import SearchModalInvoice from "../ModalSearch/SearchModalInvoice";   
import SearchModalPunchlist from "../ModalSearch/SearchModalPunchlist"; 
import SearchModalProjectDelivery from "../ModalSearch/SearchModalProjectDelivery";  
import OffCanvas from "../OffCanvas/OffCanvas";

const HeaderTab = ({
  title,
  subtitle,
  onStatusFilterChange,
  onSearchTermChange,
  statusOptions = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showModalSearch, setShowModalSearch] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [statusFilters, setStatusFilters] = useState({});

  useEffect(() => {
    if (statusOptions.length > 0 && Object.keys(statusFilters).length === 0) {
      const initialFilters = {};
      statusOptions.forEach((status) => {
        initialFilters[status] = false;
      });
      setStatusFilters(initialFilters);
    }
  }, [statusOptions, statusFilters]);

  const handleBackClick = () => {
    if (location.pathname.includes("punchlist-detail")) {
      navigate("/home", { replace: true });
    } else {
      navigate("/home",)
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const newFilters = { ...statusFilters, [name]: checked };
    setStatusFilters(newFilters);
    onStatusFilterChange(newFilters);
  };

  const currentPath = location.pathname;

  const isInvoicePage = currentPath.includes("invoice");
  const isPunchlistPage = currentPath.includes("punchlist");
  const isProjectDeliveryPage = currentPath.includes("project-delivery-list");

  return (
    <>
      <div className={styles.headerMain}>
        <div className={styles.titleDiv}>
          <div onClick={handleBackClick} style={{ cursor: "pointer" }}>
            <img src="/Svg/back-arrow.svg" alt="Back" />
          </div>
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>

        {(isInvoicePage || isPunchlistPage || isProjectDeliveryPage) && (
          <div className={styles.IconBoth}>
            {/* Show Search button only for punchlist and project-delivery-list */}
            {(isPunchlistPage || isProjectDeliveryPage) && (
              <div
                className={styles.iconSearch}
                onClick={() => setShowModalSearch(true)}
              >
                <img src="/Svg/searchSvg.svg" alt="Search" />
              </div>
            )}
            {/* Show filter always */}
            <div
              className={styles.iconFillter}
              onClick={() => setShowCanvas(true)}
            >
              <img src="/Svg/filterSvg.svg" alt="Filter" />
            </div>
          </div>
        )}
      </div>

      {/* 🔥 Dynamic Search Modals */}
      {/* {isInvoicePage && (
        <SearchModalInvoice
          isOpen={showModalSearch}
          onClose={() => setShowModalSearch(false)}
          onSearch={(invoiceNo) => {
            setShowModalSearch(false);
            if (onSearchTermChange) {
              onSearchTermChange(invoiceNo);
            }
          }}
        />
      )} */}

      {isPunchlistPage && (
        <SearchModalPunchlist
          isOpen={showModalSearch}
          onClose={() => setShowModalSearch(false)}
          onSearch={(category) => {
            setShowModalSearch(false);
            if (onSearchTermChange) {
              onSearchTermChange(category);
            }
          }}
        />
      )}

      {isProjectDeliveryPage && (
        <SearchModalProjectDelivery
          isOpen={showModalSearch}
          onClose={() => setShowModalSearch(false)}
          onSearch={(itemName) => {
            setShowModalSearch(false);
            if (onSearchTermChange) {
              onSearchTermChange(itemName);
            }
          }}
        />
      )}

      {/* Filter Sidebar */}
      <OffCanvas
        isOpen={showCanvas}
        onClose={() => setShowCanvas(false)}
        direction="right"
        width="70%"
        overlay={true}
      >
        <div className={styles.filterWrap}>
          <h3 className={styles.heading}>Filter Data</h3>

          {statusOptions.map((status) => (
            <label key={status} className={styles.checkboxItem}>
              <input
                type="checkbox"
                name={status}
                checked={statusFilters[status] || false}
                onChange={handleCheckboxChange}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </OffCanvas>
    </>
  );
};

export default HeaderTab;
