import React, { useState } from 'react'
import styles from '../List/List.module.css'

const List = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Recent");
    //    ......... DropDowan Function.......////

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
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
                            <img src='Svg/drop-Arrow.svg' alt='drop-Arrow' />
                        </span>
                    </button>
                    {isOpen && (
                        <ul className={styles.dropdownMenu}>
                            <li onClick={() => handleSelect("1 Month")}>1 Month</li>
                            <li onClick={() => handleSelect("3 Months")}>3 Months</li>
                            <li onClick={() => handleSelect("6 Months")}>6 Months</li>
                        </ul>
                    )}
                </div>
            </div>

            <div>
                <div className={styles.transactionList}>

                    {/* Transaction 1 */}
                    <div className={styles.transactionItem}>
                        <img src="Images/sofa.png" alt="Rounded Sofe" className={styles.image} />
                        <div className={styles.details}>
                            <p className={styles.title}>Rounded Sofe</p>
                            <div className={styles.track}>
                                <div className={styles.DFlex}>
                                <img src="Svg/timer.svg" alt="" />
                                <p className={styles.date}>Today</p>

                                </div>
                                
                                <p className={styles.amount}>$105.34</p>
                            </div>
                        </div>
                        <span className={`${styles.status} ${styles.Pending}`}>Pending</span>
                    </div>

                    {/* Transaction 2 */}
                    <div className={styles.transactionItem}>
                        <img src="Images/sofaset.png" alt="7 seater sofa set" className={styles.image} />
                        <div className={styles.details}>
                            <p className={styles.title}>7 seater sofa set</p>
                            <div className={styles.track}>
                            <div className={styles.DFlex}>
                                <img src="Svg/timer.svg" alt="" />
                                <p className={styles.date}>12 MAR 11:38 PM</p>
                                </div>
                                <p className={styles.amount}>$2,480</p>
                            </div>
                        </div>
                        <span className={`${styles.status} ${styles.Paid}`}>Paid</span>
                    </div>

                    {/* Transaction 3 */}
                    <div className={styles.transactionItem}>
                        <img src="Images/table.png" alt="Boss Table" className={styles.image} />
                        <div className={styles.details}>
                            <p className={styles.title}>Boss Table</p>
                            <div className={styles.track}>
                            <div className={styles.DFlex}>
                                <img src="Svg/timer.svg" alt="" />
                                <p className={styles.date}>2 days ago</p>
                                </div>
                                <p className={styles.amount}>$92.18</p>
                            </div>
                        </div>
                        <span className={`${styles.status} ${styles.Pending}`}>Pending</span>
                    </div>

                    {/* Transaction 4 */}
                    <div className={styles.transactionItem}>
                        <img src="Images/cupboard.png" alt="Cupboard" className={styles.image} />
                        <div className={styles.details}>
                            <p className={styles.title}>Cupboard</p>
                            <div className={styles.track}>
                            <div className={styles.DFlex}>
                                <img src="Svg/timer.svg" alt="" /> 
                                <p className={styles.date}> 12 MAR 11:38 PM</p>
                               </div>
                                <p className={styles.amount}>$92.18 out of $102.15</p>
                            </div>
                        </div>
                        <span className={`${styles.status} ${styles.PartlyPaid}`}>Partly Paid</span>
                    </div>

                </div>
            </div>


        </div>
    )
}

export default List
