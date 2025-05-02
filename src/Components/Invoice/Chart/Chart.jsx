import React, { useState, useEffect } from 'react';
import styles from '../Chart/Chart.module.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from 'axios';
import URL from '../../../config/api';
import Loader from '../../Loader/Loader';

const Chart = () => {
    const [totalCost, setTotalCost] = useState(0);
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
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
                        setTotalCost(baseTotalAmount);
                        setTotalPaidAmount(baseAdvance);
                        setRemaining(baseTotalAmount - baseAdvance);
                        setIsLoading(false);
                        return;
                    } else {
                        throw invoiceErr;
                    }
                }
    
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
            } finally {
                setIsLoading(false);
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
                        <p className={styles.amount}>
                            {isLoading ? <Loader /> : `$${totalCost.toLocaleString()}`}
                        </p>
                        <p className={styles.label}>Total Cost</p>
                    </div>

                    <div className={styles.chartContainer}>
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>

                    <div className={styles.cost}>
                        <p className={styles.amount}>
                            {isLoading ? <Loader /> : `$${totalPaidAmount.toLocaleString()}`}
                        </p>
                        <p className={styles.label}>Paid Amt.</p>
                    </div>
                </div>

                <div className={styles.cashflowMessage}>
                    <img src='Svg/cashFlow.svg' alt='' />
                    <div className={styles.cashFlowTextMain}>
                        <p className={styles.cashflowTitle}>Cashflow Looks Good!</p>
                        <p className={styles.cashflowText}>You're managing it well, stay consistent!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;
