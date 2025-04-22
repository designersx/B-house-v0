import React from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Docs from '../../Components/Docs/Docs'
const DocsPage = () => {
    return (
        <div>
             <div className="HeaderTop">
             <HeaderTab title='Document' />
             </div>
            <Docs />
            <Footer />
        </div>
    )
}

export default DocsPage
