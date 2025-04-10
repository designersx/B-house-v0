import React, { useState } from 'react';
import styles from '../HeaderTab/HeaderTab.module.css';
import { useNavigate } from 'react-router-dom';
import ModalSearch from '../ModalSearch/ModalSearch';

const HeaderTab = ({ title, subtitle }) => {
    const navigate = useNavigate();
    const [showModalSearch, setShowModalSearch] = useState(false);
    return (
        <div className={styles.headerMain}>
            <div className={styles.titleDiv}>
                <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
                    <img src='Svg/back-arrow.svg' alt='Back' />
                </div>
                <div>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>
            </div>

            <div className={styles.IconBoth}>
                <div className={styles.iconSearch} onClick={() => setShowModalSearch(true)}>
                    <img src='Svg/searchSvg.svg' alt='Search' />
                </div>
                <div className={styles.iconFillter}>
                    <img src='Svg/filterSvg.svg' alt='Filter' />
                </div>
            </div>
        

            <ModalSearch isOpen={showModalSearch}
                onClose={() => setShowModalSearch(false)}
                minHeight="30%"
            />
        </div>

    );
};

export default HeaderTab;
