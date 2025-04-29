import React from "react";
import styles from "../Home/Home.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Proposal from "./ProposalProject/Proposal";
import SideBar from '../../Components/SideBar/SideBar.jsx'



const Home = () => {
  return (
    <div>

      <div className="MobContent">
      <div className="HeaderTop">
        <Header />
      </div>
      <div className={styles.homeMain}>

        <Proposal />

        <Footer />
        </div>

      </div>


      <div className="mainContent">
      <div className="Web_Sidebar">
                    <SideBar />
                </div>

                <div className="Web_container">
                    
                

                    <div className="HeaderTop">
                    <Header />
                    </div>
                    
                    <Proposal />

                </div>


      </div>
    </div>

  );
};

export default Home;
