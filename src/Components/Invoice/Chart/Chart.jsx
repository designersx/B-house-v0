import React from 'react'
import styles from '../Chart/Chart.module.css'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const Chart = () => {

    //    ......... Circule chart.......////

    const totalCost = 12310;
    const paidAmount = 3880;
    const remaining = totalCost - paidAmount;
    const percentage = (paidAmount / totalCost) * 100;

    return (
        <div className={styles.ChartMain}>
            <div className={styles.card}>
                <div className={styles.financeBox}>
                    <div className={styles.cost}>
                        <p className={styles.amount}>${totalCost.toLocaleString()}</p>

                        <p className={styles.label}>Total Cost</p>
                    </div>

                    <div className={styles.chartContainer}>
                        {/* Progress Circle */}
                        <CircularProgressbar
                            value={percentage}
                            styles={buildStyles({
                                pathColor: "#FF8C00",
                                trailColor: "#fff",
                                strokeLinecap: "round",
                            })}
                        />

                        {/* Custom text inside the circle */}
                        <div className={styles.overlayText}>
                            <div className={styles.amount}>${remaining.toLocaleString()}</div>
                            <div className={styles.label}>Balance Due</div>
                        </div>
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


        </div>
    )
}

export default Chart
