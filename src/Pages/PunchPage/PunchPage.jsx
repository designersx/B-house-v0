
import React from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Punchlist from '../../Components/Punchlist/Punchlist'
import Loader from '../../Components/Loader/Loader'
import SideBar from '../../Components/SideBar/SideBar.jsx'
import Header from '../../Components/Header/Header.jsx';
import { useState } from 'react'


const PunchPage = () => {
  const [statusFilters, setStatusFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div>
        <div className="MobContent">

          <div className="HeaderTop">
            <HeaderTab
              title="Punchlist"
              onStatusFilterChange={setStatusFilters}
              onSearchTermChange={setSearchTerm} // ✅ Pass to HeaderTab
              statusOptions={["Pending", "Resolved", "Rejected"]}
            />
          </div>
          <Punchlist statusFilters={statusFilters} searchTerm={searchTerm} />


        </div>
        <div className="mainContent">
          <div className="Web_Sidebar">
            <SideBar />
          </div>

          <div className="Web_container">


            <div className="HeaderTop">
              <Header />

            </div>

            <Punchlist statusFilters={statusFilters} searchTerm={searchTerm} />
          
          </div>

        </div>
      </div>
    </>
  )
}



export default PunchPage;
