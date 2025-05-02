import React, { useState } from "react";
import styles from "../Home/Home.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Proposal from "./ProposalProject/Proposal";
import SideBar from '../../Components/SideBar/SideBar.jsx';
import PopUp2 from "../PopUp2/PopUp2.jsx";

const Home = () => {
  const [showArchivedPopup, setShowArchivedPopup] = useState(false);
  const [allArchived, setAllArchived] = useState(false);

  return (
    <div>
      <div className="HeaderTop">
        <Header />
      </div>
      {allArchived ? (
        <PopUp2
          isOpen={true}
          isClosable={false}
          title="All Projects Are Archived"
        >
          <p>All of your projects are archived. Please contact support for further access.</p>
        </PopUp2>
      ) : (
        <>
          <div className="MobContent">
            <div className={`${styles.homeMain} ${showArchivedPopup ? styles.blurred : ""}`}>
              <Proposal
                onArchivedStatus={() => setShowArchivedPopup(true)}
                onAllArchived={() => setAllArchived(true)}
              />
              <Footer />
            </div>
          </div>
          <div className="webContent">
            <div className="mainContent">
              <div className="Web_Sidebar">
                <SideBar />
              </div>
              <div className={`Web_container ${showArchivedPopup ? styles.blurred : ""}`}>
                <Proposal
                  onArchivedStatus={() => setShowArchivedPopup(true)}
                  onAllArchived={() => setAllArchived(true)}
                />
              </div>
            </div>
          </div>
          {showArchivedPopup && (
            <PopUp2
              isOpen={true}
              isClosable={true}
              onClose={() => setShowArchivedPopup(false)}
              title="Archived Project"
            >
              <p>The selected project is archived and cannot be accessed.</p>
            </PopUp2>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
