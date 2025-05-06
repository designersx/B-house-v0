import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const fromEmailPath = localStorage.getItem("fromEmailPath");
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${URL}/customer/login`, {
        email,
        password,
      });

      const { token, firstLogin, customer } = response.data;
      localStorage.setItem("customerToken", token);
      localStorage.setItem("customerInfo", JSON.stringify(customer));

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      const FCM_Token = await getFcmToken();
      await sendFcmToken(FCM_Token, customer.id);

      setLoading(false);

    
      if (fromEmailPath) {
        localStorage.removeItem("fromEmailPath");
        navigate(fromEmailPath);
      } else {
        navigate(firstLogin ? "/reset" : "/home");
      }
    } catch (err) {
      setLoading(false);
      setFormErrors({
        general: err.response?.data?.message || "Login failed. Try again.",
      });
    }
  };  
  return (
    <div className={styles.signMain}>
      <div className={`HeaderTop ${styles.topBar}`}>
        <div className={styles.ImgDiv}>
          <img src="Images/Home-img.png" alt="" />
        </div>
        <div className={styles.ImgDiv2}>
          <img src="Images/Desktop-home-img.png" alt="" />
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
            onBlur={validate}
          />
          {formErrors.email && (
            <p className={styles.errorMessage}>{formErrors.email}</p>
          )}

          <label>Password<span className={styles.required}>*</span></label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              className={styles.inputPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validate}
            />
            <p
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={showPassword ? "Svg/eye.svg" : "Svg/eye-close.svg"}
                alt="Toggle visibility"
              />
            </p>
          </div>
          {formErrors.password && (
            <p className={styles.errorMessage}>{formErrors.password}</p>
          )}

          {formErrors.general && (
            <p className={styles.errorMessage}>{formErrors.general}</p>
          )}

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
            {loading ? <Loader size={20} /> : "Sign In"}
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
          &copy; 2025 Bhouse. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Sign;
