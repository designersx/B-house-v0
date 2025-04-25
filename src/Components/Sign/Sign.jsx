import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Sign/Sign.module.css";
import axios from "axios";
import URL from "../../config/api";
import { getFcmToken } from "../../../src/firebase/getFCMToken/getToken";
import { sendFcmToken } from "../../../src/firebase/sendFcmTokenToDb/sendFcmToDb";
import Loader from "../Loader/Loader";
const Sign = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post(`${URL}/customer/login`, {
        email,
        password,
      });
      const { token, firstLogin, customer} = response.data;
      localStorage.setItem("customerToken", token);
      localStorage.setItem("customerInfo", JSON.stringify(customer));
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
        //save Fcm
        const FCM_Token = await getFcmToken();
        
        await sendFcmToken(FCM_Token,customer.id)
        setLoading(false)
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
        //save Fcm
        const FCM_Token = await getFcmToken();
        await sendFcmToken(FCM_Token,customer.id)
        setLoading(false)
      }
      if (firstLogin) {
        setLoading(false)
        navigate("/reset");
        
      } else {
        setLoading(false)
        navigate("/home");
        
      }
    } catch (err) {
      setLoading(false)
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.signMain}>
         <div className="HeaderTop">
      <div className={styles.ImgDiv}>
        <img src="Images/Home-img.png" alt="" />
      </div>
    
      <div className={styles.logoContainer}>
        <img src="Svg/b-houseLogo.svg" alt="" />
      </div>
      </div>
      <div className={styles.signPart}>
        <h2 className={styles.heading}>Sign In</h2>
        <p className={styles.subtext}>
          Enter your email and password to sign in!
        </p>
        <form className={styles.form} onSubmit={handleSignIn}>
          <label>Email<span className={styles.required}>*</span></label>
          <input
            type="email"
            placeholder="Youremail@gmail.com"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password<span className={styles.required}>*</span></label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              className={styles.inputPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={showPassword ? "Svg/eye.svg" : "Svg/eye-close.svg"}
                alt=""
              />
            </p>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.options}>
            <div className={styles.checkBoxDiv}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe"> Keep me logged in</label>
            </div>
            <div>
              <a
                className={styles.forgotPassword}
                onClick={() => navigate("/forget")}
              >
                Forget password?
              </a>
            </div>
          </div>

          <button type="submit" className={styles.signInButton}>
            {loading? <Loader size={20}/>: "Sign In"}
            
          </button>
        </form>
        <p className={styles.registerText}>
          Not registered yet?{" "}
          <a
            className={styles.registerLink}
            onClick={() => navigate("/create-account")}
          >
            Request to Create an Account
          </a>
        </p>
        <footer className={styles.footer}>
          &copy; 2025 Bhouse. All rights reserved for the use of terms related to Bhouse.
        </footer>
      </div>
    </div>
  );
};

export default Sign;
