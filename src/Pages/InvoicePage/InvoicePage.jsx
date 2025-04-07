import React from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Chart from '../../Components/Invoice/Chart/Chart.jsx'
import List from '../../Components/Invoice/List/List.jsx'

const InvoicePage = () => {
    return (
        <div>
            <HeaderTab title='Invoice List' />
            <Chart/>
            <List/>

            <Footer />
        </div>
    )
}

export default InvoicePage
