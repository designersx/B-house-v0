import React, { useState } from "react";
import styles from "../Forget/Forget.module.css";
import axios from "axios";
import URL from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const Nevigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${URL}/customer/forgot-password`, { email });
      toast.success(res.data.message || "OTP sent to your email!");
      localStorage.setItem("otpEmail", email);
      Nevigate("/verify");
    } catch (err) {
      console.error("OTP Error:", err);
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetMain}>
      <div className={styles.detailsDiv}>
        <div className="HeaderTop">
          <div className={styles.blackLogo}>
            <img src="Svg/b-houseBlack.svg" alt="Bhouse Logo" />
          </div>
        </div>
        <div className={styles.resetLockDiv}>
          <img src="Svg/resetLock.svg" alt="Reset Icon" />
        </div>
        <div className={styles.Title}>
          <h1>Forgot Password</h1>
          <p>Please enter your email address to reset your password.</p>
        </div>

        <div className={styles.confirmDivMian}>
          <div className={styles.confirmDiv}>
            <div className={styles.Input1}>
              <input
                type="email"
                placeholder="Enter your email address..."
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.BtnDiv}>
            <div className={styles.ContinueBtn} onClick={handleSendOtp}>
              <p>{loading ? "Sending..." : "Submit"}</p>
            </div>
          </div>

          <div className={styles.emailDiv}>
            <p>
              Don’t remember your email? Contact us at{" "}
              <a href="mailto:Support@bhouse.com">Support@bhouse.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;
