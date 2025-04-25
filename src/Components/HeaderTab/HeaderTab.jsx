import React, { useState } from 'react';
import styles from '../HeaderTab/HeaderTab.module.css';
import { useNavigate } from 'react-router-dom';
import ModalSearch from '../ModalSearch/ModalSearch';
import OffCanvas from '../OffCanvas/OffCanvas';

const HeaderTab = ({ title, subtitle }) => {
    const navigate = useNavigate();
    const [showModalSearch, setShowModalSearch] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    return (
        <>
            <div className={styles.headerMain}>
                <div className={styles.titleDiv}>
                    <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
                        <img src='/Svg/back-arrow.svg' alt='Back' />
                    </div>
                    <div>
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </div>
                </div>

                <div className={styles.IconBoth}>
                    <div className={styles.iconSearch} onClick={() => setShowModalSearch(true)}>
                        <img src='/Svg/searchSvg.svg' alt='Search' />
                    </div>
                    <div className={styles.iconFillter} onClick={() => setShowCanvas(true)}>
                        <img src='/Svg/filterSvg.svg' alt='Filter' />
                    </div>
                </div>

                <ModalSearch
                    isOpen={showModalSearch}
                    onClose={() => setShowModalSearch(false)}
                    minHeight="30%"
                />


            </div>
            <OffCanvas
                isOpen={showCanvas}
                onClose={() => setShowCanvas(false)}
                direction="right"
                width="80%"
                overlay={true}
          
            >
                <div className={styles.filterWrap}>
                    <h3 className={styles.heading}>Filter Data</h3>

                    <label className={styles.checkboxItem}>
                        <input type="checkbox" />
                        <span>Lead Time</span>
                    </label>

                    <label className={styles.checkboxItem}>
                        <input type="checkbox" />
                        <span>Punchlist</span>
                    </label>

                    <label className={styles.checkboxItem}>
                        <input type="checkbox" />
                        <span>Team Member</span>
                    </label>
                    <div className={styles.subBtn}><button>Submit</button></div>
                </div>
            </OffCanvas>
        </>

    );
};

export default HeaderTab;
