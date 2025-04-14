import React from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Chart from '../../Components/Invoice/Chart/Chart.jsx'
import List from '../../Components/Invoice/List/List.jsx'

const InvoicePage = () => {
    return (
        <div>
            <div className="HeaderTop">
                <HeaderTab title='Invoice List' />
            </div>
            <Chart />
            <List />

            <Footer />
        </div>
    )
}

export default InvoicePage
