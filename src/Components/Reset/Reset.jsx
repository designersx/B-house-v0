import React from 'react'
import styles from '../Reset/Reset.module.css'

const Reset = () => {
  return (
    <div className={styles.resetMain}>
        <div className={styles.blackLogo}>
        <img src='Svg/b-houseBlack.svg' alt=''/>
        </div>
        <div className={styles.resetLockDiv}>
            <img src='Svg/resetLock.svg'/>
        </div>
        <div>
            
        </div>
    
    </div>
  )
}

export default Reset
