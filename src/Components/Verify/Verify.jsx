import React, { useState } from 'react'
import styles from '../Verify/Verify.module.css'
import { useNavigate } from "react-router-dom";

const Verify = () => {
    const navigate = useNavigate();
    const [showPassword1, setShowPassword1] = useState(false);
    const handleClick = () => {
        navigate("/reset");
    };
    return (
        <div className={styles.VerifyMain}>
            <div className={styles.detailsDiv}>
                <div className={styles.blackLogo}>
                    <img src='Svg/b-houseBlack.svg' alt='' />
                </div>
                <div className={styles.OtpMain}>
                    <h2>Verify Your Email</h2>
                    <p>Enter code we’ve sent to your inbox
                        info@bhouse.com</p>
                    <div className={styles.OtpContainer}>
                        <input type="text" maxLength="1" value="5" className={`${styles.input} ${styles.filled}`} />
                        <input type="text" maxLength="1" value="1" className={`${styles.input} ${styles.filled}`} />
                        <input type="text" maxLength="1" className={`${styles.input} ${styles.active}`} />
                        <input type="text" maxLength="1" className={styles.input} />

                    </div>
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

                    <div className={styles.resend}>
                        <p>Don’t get the code? <a href=''>Resend it.</a></p>
                    </div>
                    <div className={styles.BtnDiv} onClick={handleClick}>
                        <div className={styles.ContinueBtn}>
                            <p >Submit</p>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default Verify
