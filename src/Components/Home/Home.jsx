import React from 'react';
import styles from '../Home/Home.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Proposal from './ProposalProject/Proposal';
const Home = () => {
  return (
    <div className={styles.homeMain}>
      <Header/>

<Proposal/>






      <Footer/>
      </div>
  )
}

export default Home

