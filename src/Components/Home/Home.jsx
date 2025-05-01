import React, { useState } from "react";
import styles from "../Home/Home.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Proposal from "./ProposalProject/Proposal";

import SideBar from "../../Components/SideBar/SideBar.jsx";
import PopUp2 from "../PopUp2/PopUp2.jsx";

const Home = () => {
  const [showArchivedPopup, setShowArchivedPopup] = useState(false);

  // Close popup function
  const handleClosePopup = () => {
    setShowArchivedPopup(false);
  };


  return (
    <div>
      {/* Mobile View */}
      <div className="MobContent">
        <div className="HeaderTop">
          <Header />
        </div>
        <div className={`${styles.homeMain} ${showArchivedPopup ? styles.blurred : ""}`}>
          <Proposal onArchivedStatus={() => setShowArchivedPopup(true)} />
          <Footer />
        </div>
      </div>

      {/* Web View */}
      <div className="webContent">
        <div className="HeaderTop">
          <Header />
        </div>

        <div className="mainContent">
          <div className="Web_Sidebar">
            <SideBar />
          </div>
          <div className={`Web_container ${showArchivedPopup ? styles.blurred : ""}`}>
            <Proposal onArchivedStatus={() => setShowArchivedPopup(true)} />
          </div>
        </div>
      </div>

      {/* Popup overlay on top */}
      {showArchivedPopup && (
        <PopUp2
          isOpen={true}
          onClose={handleClosePopup}
          title="Archived Project"
        >
          <p>This project is archived. You cannot interact with it.</p>
        </PopUp2>
      )}
    </div>
  );
};

export default Home;
