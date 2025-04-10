import React, { useState, useEffect } from 'react';
import styles from '../Chart/Chart.module.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from 'axios';
import URL from '../../../config/api'; 

const Chart = () => {
    const [totalCost, setTotalCost] = useState(0);
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);  // This will store the total paid amount
    const [remaining, setRemaining] = useState(0);

    // Get projectId from localStorage
    const projectId = localStorage.getItem('selectedProjectId');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${URL}/projects/${projectId}/invoice`);
                const invoices = Array.isArray(response.data) ? response.data : [response.data];
                const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
                const totalPaid = invoices.reduce((sum, invoice) => {
                    if (invoice.status === 'Paid') {
                        return sum + invoice.totalAmount; 
                    }
                    return sum + (invoice.advancePaid || 0);  
                }, 0);


    //    ......... Circule chart.......////
    const totalCost = 123410;
    const paidAmount = 3880;
    const remaining = totalCost - paidAmount;
    const percentage = (paidAmount / totalCost) * 100;

                const balanceDue = totalAmount - totalPaid;

                // Update state with the calculated values
                setTotalCost(totalAmount);
                setTotalPaidAmount(totalPaid);
                setRemaining(balanceDue);
            } catch (err) {
                console.error('Error fetching invoices:', err);
            }
        };

        if (projectId) {
            fetchInvoices();
        }
    }, [projectId]);

    const percentage = (totalPaidAmount / totalCost) * 100;

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
                        <p className={styles.amount}>${totalPaidAmount.toLocaleString()}</p>
                        <p className={styles.label}>Paid Amt.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;
