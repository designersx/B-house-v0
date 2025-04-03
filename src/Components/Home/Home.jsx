import React from 'react';
import styles from '../Home/Home.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Proposal from './ProposalProject/Proposal';
import ProjectOverView from './ProjectOverView/ProjectOverView'
const Home = () => {
  return (
    <div className={styles.homeMain}>
      <Header/>

<Proposal/>
<ProjectOverView/>






      <Footer/>
      </div>
  )
}

export default Home

