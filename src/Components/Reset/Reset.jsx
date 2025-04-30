import React, { useState } from 'react';
import styles from '../Reset/Reset.module.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import URL from '../../config/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Reset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem('customerInfo'));
  const customerId = customer?.id;

  const containsEmoji = (text) => {
    return /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(text);
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.includes(" ")) return "Password cannot contain spaces.";
    if (containsEmoji(password)) return "Emojis are not allowed.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password.length > 15) return "Password must be no more than 15 characters.";
    return "";
  };

  const handlePasswordReset = async () => {
    setError("");

    const newPassError = validatePassword(newPassword);
    const confirmPassError = validatePassword(confirmPassword);

    if (newPassError) return setError(newPassError);
    if (confirmPassError) return setError(confirmPassError);
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    try {
      const response = await axios.put(`${URL}/customer/set-new-password/${customerId}`, {
        newPassword,
        confirmPassword,
      });

      console.log("✅ Password reset success:", response.data);
      navigate('/onboarding');

    } catch (err) {
      console.error("❌ Reset error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
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
          <img src='Svg/resetLock.svg' alt='Reset Icon' />
        </div>

        <div className={styles.Title}>
          <h1>Reset Password to Access</h1>
          <p>Please enter your new password to reset your account.</p>
        </div>

        <div className={styles.confirmDivMian}>
          <div className={styles.confirmDiv}>
            <div className={styles.Input1}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                className={styles.inputField}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div onClick={() => setShowNewPassword(prev => !prev)} style={{ cursor: "pointer" }}>
                {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </div>
            </div>

            <div className={styles.Input2}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className={styles.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div onClick={() => setShowConfirmPassword(prev => !prev)} style={{ cursor: "pointer" }}>
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </div>
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.BtnDiv}>
            <div className={styles.CancelBtn} onClick={() => navigate("/")}>
              <p>Cancel</p>
            </div>
            <div className={styles.ContinueBtn} onClick={handlePasswordReset}>
              <p>Continue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
