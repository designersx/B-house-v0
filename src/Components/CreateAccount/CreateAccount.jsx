import React from 'react'
import styles from '../CreateAccount/CreateAccount.module.css'

const CreateAccount = () => {

    return (
        <div className={styles.signMain}>
            <div className={styles.ImgDiv}>
                <img src='Images/Home-img.png' alt='' />
            </div>
            <div className={styles.logoContainer}><img src='Svg/b-houseLogo.svg' alt='' /></div>
            <div className={styles.signPart}>
                <h2 className={styles.heading}>Create an Account</h2>
                <p className={styles.subtext}>Fill in your details below and we’ll get your account set up in no time.</p>
                <form className={styles.form} >
                    <label>Full Name*</label>
                    <input
                        type="text"
                        placeholder="Full name"
                        className={styles.input}
                        value=''

                    />

                    <label>Email*</label>
                    <div className={styles.passwordContainer}>
                        <input
                            type="email"
                            placeholder="Youremail@gmail.com"
                            className={styles.inputPassword}
                            value=''

                        />

                    </div>
                    <label>Phone Number*</label>
                    <input
                        type="number"
                        placeholder="88-XXX-XXX-88"
                        className={styles.input}
                        value=''

                    />
                    <label>Company Name*</label>
                    <input
                        type="text"
                        placeholder="XYZ Company Name"
                        className={styles.input}
                        value=''
                    />
                    <label>Description*</label>
                    <textarea  className={styles.textarea} id="w3review" name="w3review" rows="2" cols="50">Description</textarea>
                    <button type="submit" className={styles.signInButton}>Request to Create an Account</button>
                </form>

                <footer className={styles.footer}>
                    &copy; © 2025 Bhouse. All rights reserved for the use of terms related to Bhouse.
                </footer>
            </div>
        </div>
    )
}

export default CreateAccount
