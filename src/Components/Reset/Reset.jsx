import React,{useState} from 'react'
import styles from '../Reset/Reset.module.css'
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();
  return (
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
          type={showPassword1 ? "text" : "password"}
          placeholder="Enter your new password"
          className={styles.inputField}
        />
        <div onClick={() => setShowPassword1(!showPassword1)} style={{ cursor: 'pointer' }}>
          <img
            src={showPassword1 ? 'Svg/eye.svg' : 'Svg/eye-close.svg'}
            alt='Toggle visibility'
          />
        </div>
      </div>

      <div className={styles.Input2}>
        <input
          type={showPassword2 ? "text" : "password"}
          placeholder="Confirm new password"
          className={styles.inputField}
        />
        <div onClick={() => setShowPassword2(!showPassword2)} style={{ cursor: 'pointer' }}>
          <img
            src={showPassword2 ? 'Svg/eye.svg' : 'Svg/eye-close.svg'}
            alt='Toggle visibility'
          />
        </div>
      </div>
    </div>

          <div className={styles.BtnDiv}>
            <div className={styles.CancelBtn} onClick={() => navigate("/")}><p>Cancel</p></div>
            <div className={styles.ContinueBtn} onClick={() => navigate("/onboarding")}>
          <p>Continue</p>
        </div>


          </div>
        </div>

      </div>

      <div>

      </div>

    </div>
  )
}

export default Reset
