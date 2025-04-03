import React from 'react'
import styles from './Header.module.css'
// import { Link } from 'react-router-dom'

function header() {
  return (
    <div>

<div className={styles.headerMain}>
    <div className={styles.headerLogo}>
        <img src="/Svg/Logo-Bhouse.svg" alt="logo" className={styles.logo}/>
    </div>

    <div className={styles.headerSideIcon}>

        <img src="/Svg/searchIcon.svg" alt="searchIcon" className={styles.vector1}/>
        <img src="/Svg/BellIcon.svg" alt="BellIcon" className={styles.vector1}/>
        <img src="/Svg/UserIcon1.svg" alt="UserIcon" className={styles.vector1}/>





    </div>


    




</div>







    </div>
  )
}

export default header