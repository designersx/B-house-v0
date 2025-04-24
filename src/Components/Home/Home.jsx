import React from "react";
import styles from "../Home/Home.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Proposal from "./ProposalProject/Proposal";

const Home = () => {
  return (
    <div>
      <div className="HeaderTop">
        <Header />
      </div>
      <div className={styles.homeMain}>

        <Proposal />

        <Footer />
      </div>
    </div>

  );
};

export default Home;
