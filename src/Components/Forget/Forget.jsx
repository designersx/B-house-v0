import React from 'react'
import styles from '../Forget/Forget.module.css'
import { useNavigate } from "react-router-dom";
const Forget = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/verify");
  };
  return (
    <div>
      <div className={styles.resetMain}>
        <div className={styles.detailsDiv}>
          <div className={styles.blackLogo}>
            <img src='Svg/b-houseBlack.svg' alt='' />
          </div>
          <div className={styles.resetLockDiv}>
            <img src='Svg/resetLock.svg' />
          </div>
          <div className={styles.Title}><h1>Reset Password to Access</h1>
            <p>Please enter your new password to reset your account.</p>
          </div>
          <div className={styles.confirmDivMian}>
            <div className={styles.confirmDiv}>
              <div className={styles.Input1}>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className={styles.inputField}
                />
                <div><img src='Svg/eye.svg' alt='' /></div>
              </div>

            </div>

            <div className={styles.BtnDiv}>
              <div className={styles.ContinueBtn} onClick={handleClick}>
                <p >Submit</p>
              </div>
            </div>
            <div className={styles.emailDiv}>
              <p>Don’t remember your email?
                Contact us at <a href='Support@bhouse.com'>Support@bhouse.com</a> </p>

            </div>
          </div>

        </div>

        <div>

        </div>

      </div>
    </div>
  )
}

export default Forget
