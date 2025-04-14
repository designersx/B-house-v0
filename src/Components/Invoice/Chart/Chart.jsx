import React, { useState, useEffect } from 'react';
import styles from '../Chart/Chart.module.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from 'axios';
import URL from '../../../config/api';

const Chart = () => {
    const [totalCost, setTotalCost] = useState(0);
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const projectId = localStorage.getItem('selectedProjectId');

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const projectRes = await axios.get(`${URL}/projects/${projectId}`);
                const project = projectRes.data;
    
                const baseTotalAmount = Number(project.totalValue || 0);
                const baseAdvance = Number(project.advancePayment || 0);
    
                let invoices = [];
                
                try {
                    const invoiceRes = await axios.get(`${URL}/projects/${projectId}/invoice`);
                    invoices = Array.isArray(invoiceRes.data) ? invoiceRes.data : [invoiceRes.data];
                } catch (invoiceErr) {
                    if (invoiceErr.response && invoiceErr.response.status === 404) {
                        // No invoices, use only project data
                        setTotalCost(baseTotalAmount);
                        setTotalPaidAmount(baseAdvance);
                        setRemaining(baseTotalAmount - baseAdvance);
                        return;
                    } else {
                        // Some other error — rethrow
                        throw invoiceErr;
                    }
                }
    
                // Invoices exist — continue with full logic
                const invoiceTotal = invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0);
                const totalProjectCost = Math.max(baseTotalAmount, invoiceTotal);
    
                const paidFromInvoices = invoices.reduce((sum, invoice) => {
                    let paid = 0;
                    if (invoice.status === 'Paid') {

                        paid += Number(invoice.totalAmount || 0);
                    } else {
                        paid += Number(invoice.advancePaid || 0);
                    }
                    return sum + paid;
                }, 0);
    
                const totalPaid = baseAdvance + paidFromInvoices;
                const balanceDue = totalProjectCost - totalPaid;
    
                setTotalCost(totalProjectCost);

                setTotalPaidAmount(totalPaid);
                setRemaining(balanceDue);
            } catch (err) {
                console.error('Error fetching finance data:', err);
            }
        };
    
        if (projectId) {
            fetchFinanceData();
        }
    }, [projectId]);
    
    

    const percentage = totalCost > 0 ? (totalPaidAmount / totalCost) * 100 : 0;

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
                            styles={buildStyles({
                                pathColor: "#FF8C00",
                                trailColor: "#fff",
                                strokeLinecap: "round",
                            })}
                        />

                        <div className={styles.overlayText}>
                            <div className={styles.amount}>
                                ${Math.abs(remaining).toLocaleString()}
                            </div>
                            <div className={styles.label}>
                                {remaining >= 0 ? "Balance Due" : "Overpaid"}
                            </div>
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
