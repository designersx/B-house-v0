import React, { useState } from 'react'
import styles from '../Chart/Chart.module.css'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const Chart = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Recent");
    //    ......... Circule chart.......////

    const totalCost = 12310;
    const paidAmount = 3880;
    const remaining = totalCost - paidAmount;
    const percentage = (paidAmount / totalCost) * 100;


    //    ......... DropDowan Function.......////

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };
   

    return (
        <div className={styles.ChartMain}>
            <div className={styles.card}>
                <div className={styles.financeBox}>
                    <div className={styles.cost}>
                        <p className={styles.amount}>${totalCost.toLocaleString()}</p>

                        <p className={styles.label}>Total Cost</p>
                    </div>

                    <div className={styles.chartContainer}>
                        <CircularProgressbar
                            value={percentage}
                            text={`$${remaining.toLocaleString()}`}
                            styles={buildStyles({
                                textSize: "18px",
                                pathColor: "#FF8C00",
                                trailColor: "#fff",
                                textColor: "#fff",
                                strokeLinecap: "round",
                            })}
                        />
                    </div>

                    <div className={styles.cost}>
                        <p className={styles.amount}>${paidAmount.toLocaleString()}</p>
                        <p className={styles.label}>Paid Amt.</p>
                    </div>
                </div>

                <div className={styles.cashflowMessage}>
                    <img src="Svg/cashFlow.svg" alt="Cashflow" />
                    <div className={styles.cashFlowTextMain}>
                        <p className={styles.cashflowTitle}>Cashflow Looks Good!</p>
                        <p className={styles.cashflowText}>
                            You're managing it well, stay consistent!
                        </p>
                    </div>
                </div>
            </div>
            {/* All Invoice List Ui */}

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
                                    <img src="Svg/timer.svg" alt="" />
                                    <p className={styles.date}>Today</p>
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
                                    <img src="Svg/timer.svg" alt="" />
                                    <p className={styles.date}>12 MAR 11:38 PM</p>
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
                                    <img src="Svg/timer.svg" alt="" />
                                    <p className={styles.date}>2 days ago</p>
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
                                    <img src="Svg/timer.svg" alt="" />
                                    <p className={styles.date}>12 MAR 11:38 PM</p>
                                    <p className={styles.amount}>$92.18 out of $102.15</p>
                                </div>
                            </div>
                            <span className={`${styles.status} ${styles.PartlyPaid}`}>Partly Paid</span>
                        </div>

                    </div>
                </div>


            </div>

        </div>
    )
}

export default Chart
