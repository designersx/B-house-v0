import React from 'react';
import styles from '../Home/Home.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
const Home = () => {
  return (
    <div className={styles.homeMain}>
      <Header/>
      <Footer/>
      </div>
  )
}

export default Home

