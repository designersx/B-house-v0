import React, { useState, useEffect } from "react";
import styles from "../ModalSearch/ModalSearch.module.css";

const ModalSearch = ({ isOpen, onClose, minHeight = "30%", maxHeight = "80%" }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [history, setHistory] = useState([]);

    const words = ["chair", "table", "bed"];
    const [placeholder, setPlaceholder] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load history on mount
    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setHistory(storedHistory);
    }, []);

    // Disable scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    // Save to history & localStorage
    useEffect(() => {
        if (searchTerm.trim()) {
            const timer = setTimeout(() => {
                setHistory((prev) => {
                    const newHistory = [searchTerm, ...prev.filter(item => item !== searchTerm)].slice(0, 3);
                    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
                    return newHistory;
                });
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [searchTerm]);

    // Typewriter effect
    useEffect(() => {
        if (!isOpen) return;

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
    }, [charIndex, isDeleting, wordIndex, isOpen]);

    const handleClearAll = () => {
        setHistory([]);
        localStorage.removeItem("searchHistory");
        setSearchTerm("");q
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                style={{
                    minHeight,
                    maxHeight,
                }}
            >
                <div className={styles.header}>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder={`Search for ${placeholder}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => setSearchTerm("")}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className={styles.historyWrapper}>
                    <div className={styles.historyHeader}>
                        <h4>Recent Searches</h4>
                        {history.length > 0 && (
                            <p className={styles.clearAllBtn} onClick={handleClearAll}>
                                Clear All
                            </p>
                        )}
                    </div>

                    {history.length > 0 ? (
                        <ul className={styles.historyList}>
                            {history.map((item, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => setSearchTerm(item)}
                                    className={styles.historyItem}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.emptyText}>No recent searches</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalSearch;
