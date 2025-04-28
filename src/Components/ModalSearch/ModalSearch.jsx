import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../ModalSearch/ModalSearch.module.css";
import URL from "../../config/api";

const ModalSearch = ({ isOpen, onClose, minHeight = "30%", maxHeight = "80%" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [punchlists, setPunchlists] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;  // 👈 capture current route

  const words = ["documents", "invoice", "projects", "home", "punchlist"];
  const [placeholder, setPlaceholder] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => {
        setHistory((prev) => {
          const newHistory = [searchTerm, ...prev.filter(item => item !== searchTerm)].slice(0, 5);
          localStorage.setItem("searchHistory", JSON.stringify(newHistory));
          return newHistory;
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Typing effect only on Home page
  useEffect(() => {
    if (!isOpen || pathname !== "/home") return;
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 60 : 100;

    const timeout = setTimeout(() => {
      const updatedText = isDeleting
        ? currentWord.substring(0, charIndex - 1)
        : currentWord.substring(0, charIndex + 1);

      setPlaceholder(updatedText);
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));

      if (!isDeleting && updatedText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      }

      if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, isOpen, pathname]);

  // Handle search differently based on page
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
        try {
          const projectId = localStorage.getItem("selectedProjectId");
          if (!projectId || !searchTerm.trim()) {
            setProjectItems([]);
            setPunchlists([]);
            setInvoices([]);
            return;
          }

          if (pathname.includes("invoice")) {
            // Fetch invoices
            const res = await fetch(`${URL}/projects/${projectId}/invoice`);
            const data = await res.json();
            const invoicesArray = Array.isArray(data) ? data : [data];
            const filtered = invoicesArray.filter(inv =>
              inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setInvoices(filtered);
          } else if (pathname.includes("punchlist")) {
            // Fetch punchlists
            const res = await fetch(`${URL}/projects/${projectId}/punch-list`);
            const data = await res.json();
            const punchlistsArray = Array.isArray(data) ? data : [data];
            const filtered = punchlistsArray.filter(p =>
              p.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setPunchlists(filtered);
          } else {
            // Home Page: fetch search suggestions
            const res = await fetch(`${URL}/search?query=${searchTerm}&projectId=${projectId}`);
            const data = await res.json();
            setProjectItems(data.items || []);
            setPunchlists(data.punchlists || []);
          }
        } catch (error) {
          console.error("Error fetching search data:", error);
        }
      };

      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pathname]);

  const handleClearAll = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
    setSearchTerm("");
  };

  const handleSelectSuggestion = (item) => {
    setSearchTerm(item);
    onClose();

    if (item.toLowerCase().includes("document")) {
      navigate("/docs");
    } else if (item.toLowerCase().includes("invoice")) {
      navigate("/invoice");
    } else if (item.toLowerCase().includes("punchlist")) {
      navigate("/punchlist");
    } else if (item.toLowerCase().includes("home")) {
      navigate("/home");
    }
  };

  const handleSelectProjectItem = (itemId) => {
    onClose();
    navigate(`/orderInfo/${itemId}`);
  };

  const handleSelectPunchlist = (punchlistId) => {
    onClose();
    navigate(`/punchlist-detail/${punchlistId}`);
  };

  if (!isOpen) return null;

  const filteredSuggestions = words.filter(word =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <button className={styles.outsideCloseBtn} onClick={onClose}>✕</button>
        <div className={styles.modal} style={{ minHeight, maxHeight }}>
          <div className={styles.header}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder={
                pathname.includes("invoice")
                  ? "Search Invoice Number"
                  : pathname.includes("punchlist")
                  ? "Search by Category"
                  : `Search for ${placeholder}`
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className={styles.clearBtn} onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>

          <div className={styles.historyWrapper}>
            <div className={styles.historyHeader}>
              <h4>Suggestions</h4>
              {history.length > 0 && (
                <p className={styles.clearAllBtn} onClick={handleClearAll}>Clear All</p>
              )}
            </div>

            {/* Suggestions List for Home */}
            {pathname === "/home" && (
              <>
                {searchTerm ? (
                  filteredSuggestions.length > 0 ? (
                    <ul className={styles.historyList}>
                      {filteredSuggestions.map((item, idx) => (
                        <li key={idx} onClick={() => handleSelectSuggestion(item)} className={styles.historyItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.emptyText}>No results</p>
                  )
                ) : (
                  <ul className={styles.historyList}>
                    {history.map((item, idx) => (
                      <li key={idx} onClick={() => handleSelectSuggestion(item)} className={styles.historyItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* Project Items */}
          {pathname === "/home" && projectItems.length > 0 && (
            <div className={styles.resultsSection}>
              <h4>Project Items</h4>
              <ul className={styles.historyList}>
                {projectItems.map((item, idx) => (
                  <li key={idx} className={styles.historyItem} onClick={() => handleSelectProjectItem(item.id)}>
                    {item.itemName}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Punchlists */}
          {(pathname.includes("punchlist") || pathname === "/home") && punchlists.length > 0 && (
            <div className={styles.resultsSection}>
              <h4>Punchlists</h4>
              <ul className={styles.historyList}>
                {punchlists.map((p, idx) => (
                  <li key={idx} className={styles.historyItem} onClick={() => handleSelectPunchlist(p.id)}>
                    {p.category || p.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Invoices */}
          {pathname.includes("invoice") && invoices.length > 0 && (
            <div className={styles.resultsSection}>
              <h4>Invoices</h4>
              <ul className={styles.historyList}>
                {invoices.map((inv, idx) => (
                  <li key={idx} className={styles.historyItem}>
                    {inv.invoiceNumber}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ModalSearch;
