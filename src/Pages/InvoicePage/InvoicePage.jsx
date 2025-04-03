import React from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Chart from '../../Components/Invoice/Chart/Chart.jsx'

const InvoicePage = () => {
    return (
        <div>
            <HeaderTab title='Invoice List' />
            <Chart/>
            <Footer />
        </div>
    )
}

export default InvoicePage
