import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../Sign/Sign.module.css";
import users from '../../Json/user.json';

const Sign = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            setError('');
            navigate('/reset');
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
                        placeholder="Youremail@gmail.com"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password*</label>
                    <div className={styles.passwordContainer}>
                        <input
                            type={showPassword ? "text" : "password"} 
                            placeholder="Min. 8 characters"
                            className={styles.inputPassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                            <img src={showPassword ? 'Svg/eye.svg' : 'Svg/eye-close.svg'} alt='' />
                        </span>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.options}>
                        <div className={styles.checkBoxDiv}>
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe"> Keep me logged in</label>
                        </div>
                        <div><a href="" className={styles.forgotPassword} onClick={() => navigate("/forget")}>Forget password?</a></div>
                    </div>

                    <button type="submit" className={styles.signInButton}>Sign In</button>
                </form>
                <p className={styles.registerText}>Not registered yet? <text className={styles.registerLink} onClick={() => navigate("/create-account")}>Request to Create an Account</text></p>
                <footer className={styles.footer}>
                    &copy; © 2025 Bhouse. All rights reserved for the use of terms related to Bhouse.
                </footer>
            </div>
        </div>
    );
};

export default Sign;
