import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from "../Sign/Sign.module.css";
import users from '../../Json/user.json'

const Sign = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate function

    const handleSignIn = (e) => {
        e.preventDefault();

        // Check user authentication
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            setError('');
            alert("Sign in successful!");
            navigate('/reset'); // Redirect to Reset Password Page
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className={styles.signMain}>
            <div className={styles.ImgDiv}>
                <img src='Images/Home-img.png' alt='' />
            </div>
            <div className={styles.logoContainer}><img src='Svg/b-houseLogo.svg' alt=''/></div>
            <div className={styles.signPart}>
                <h2 className={styles.heading}>Sign In</h2>
                <p className={styles.subtext}>Enter your email and password to sign in!</p>
                <form className={styles.form} onSubmit={handleSignIn}>
                    <label>Email*</label>
                    <input
                        type="email"
                        placeholder="YourEmail@gmail.com"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password*</label>
                    <div className={styles.passwordContainer}>
                        <input
                            type="password"
                            placeholder="Min. 8 characters"
                            className={styles.inputPassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className={styles.eyeIcon}><img src='Svg/eye.svg' alt='' /></span>
                    </div>

                    {/* Show error message with red color */}
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.options}>
                        <div className={styles.checkBoxDiv}>
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe"> Keep me logged in</label>
                        </div>
                        <div> <a href="#" className={styles.forgotPassword}>Forget password?</a></div>
                    </div>

                    <button type="submit" className={styles.signInButton}>Sign In</button>
                </form>
                <p className={styles.registerText}>Not registered yet? <a href="#" className={styles.registerLink}>Request to Create an Account</a></p>
                <footer className={styles.footer}>
                    &copy; 2025 Bhouse. All rights reserved for the use of terms related to Bhouse.
                </footer>
            </div>
        </div>
    );
}

export default Sign;
