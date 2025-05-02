import React, { useState } from 'react';
import styles from '../Verify/Verify.module.css';
import axios from 'axios';
import URL from '../../config/api';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('otpEmail'); 

  const handleChangeOtp = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const finalOtp = otp.join('');
      if (finalOtp.length !== 6 || !newPassword) {
        setError('Please enter a valid OTP and password');
        setResendMsg('');
        setSuccessMsg('');
        return;
      }
  
      setError('');
      setResendMsg('');
      const response = await axios.post(`${URL}/customer/reset-password-otp`, {
        email,
        otp: finalOtp,
        newPassword,
      });
  
      setSuccessMsg(response.data.message || "Password reset successful!");
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
      setSuccessMsg('');
      setResendMsg('');
    }
  };
  
  const handleResendOTP = async () => {
    try {
      if (!email) {
        setError("Email not found in session");
        setResendMsg('');
        setSuccessMsg('');
        return;
      }
  
      await axios.post(`${URL}/customer/forgot-password`, { email });
      
      // ✅ Clear previous OTP inputs
      setOtp(['', '', '', '', '', '']);
  
      setResendMsg("OTP resent to your email.");
      setError('');
      setSuccessMsg('');
      setTimeout(() => setResendMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
      setResendMsg('');
      setSuccessMsg('');
    }
  };
  
  

  return (
    <div className={styles.VerifyMain}>
      <div className={styles.detailsDiv}>
      <div className="HeaderTop">
          <div className={styles.blackLogo}>
            <img src="Svg/b-houseBlack.svg" alt="Bhouse Logo" />
          </div>
        </div>

        <div className={styles.OtpMain}>
          <h2>Verify Your Email</h2>
          <p>Enter code sent to your inbox <b>{email}</b></p>

          <div className={styles.OtpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type='text'
                maxLength='1'
                value={digit}
                className={`${styles.input} ${digit ? styles.filled : ''}`}
                onChange={(e) => handleChangeOtp(index, e.target.value)}
              />
            ))}
          </div>

          <div className={styles.Input1}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your new password'
              className={styles.inputField}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
              <img
                src={showPassword ? 'Svg/eye.svg' : 'Svg/eye-close.svg'}
                alt='Toggle visibility'
              />
            </div>
          </div>

          {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
          {successMsg && <p style={{ color: 'green', marginTop: 10 }}>{successMsg}</p>}
          {resendMsg && <p style={{ color: 'blue', marginTop: 10 }}>{resendMsg}</p>}

          <div className={styles.resend}>
            <p>Didn't get the code? <span onClick={handleResendOTP} style={{ cursor: 'pointer', color: '#007bff' }}><b>Resend it</b></span></p>
          </div>

          <div className={styles.BtnDiv}>
            <div className={styles.ContinueBtn} onClick={handleSubmit}>
              <p>Submit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
