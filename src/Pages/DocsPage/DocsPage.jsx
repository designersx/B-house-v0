import React from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Docs from '../../Components/Docs/Docs'
import SideBar from '../../Components/SideBar/SideBar.jsx'
import Header from '../../Components/Header/Header.jsx';


const DocsPage = () => {
    return (
        <div>

            <div className="MobContent">
                <div className="HeaderTop">
                    <HeaderTab title='Document' />
                </div>
                <Docs />
                <Footer />
            </div>


            <div className="webContent">
                <div className="HeaderTop">
                    <Header showSearchIcon={false}/>
                </div>
                <div className="mainContent">
                    <div className="Web_Sidebar">
                        <SideBar />
                    </div>

                    <div className="Web_container">
                        <Docs />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default DocsPage
