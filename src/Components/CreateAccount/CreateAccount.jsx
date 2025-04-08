import React, { useState } from "react";
import styles from "./CreateAccount.module.css";
import axios from "axios";
import URL from "../../config/api";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    description: "",
    address: ""
  });
const Navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.companyName || !formData.description) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await axios.post(`${URL}/requests`, formData);
      toast.success("Account request submitted successfully!");
      Navigate("/");
        setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        description: "",
        address: ""
      });
    } catch (err) {
      console.error("Request failed:", err);
      const message = err.response?.data?.message || "Submission failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className={styles.signMain}>
      <div className={styles.ImgDiv}>
        <img src="Images/Home-img.png" alt="" />
      </div>

      <div className={styles.logoContainer}>
        <img src="Svg/b-houseLogo.svg" alt="" />
      </div>

      <div className={styles.signPart}>
        <h2 className={styles.heading}>Create an Account</h2>
        <p className={styles.subtext}>
          Fill in your details below and we’ll get your account set up in no
          time.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Full Name*</label>
          <input
            type="text"
            placeholder="Full name"
            className={styles.input}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />

          <label>Email*</label>
          <input
            type="email"
            placeholder="youremail@gmail.com"
            className={styles.input}
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Phone Number*</label>
          <input
            type="tel"
            placeholder="88-XXX-XXX-88"
            className={styles.input}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Company Name*</label>
          <input
            type="text"
            placeholder="XYZ Company"
            className={styles.input}
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />

          <label>Description*</label>
          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Describe your need or use case"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Address (Optional)</label>
          <input
            type="text"
            placeholder="Street, City, Zip"
            className={styles.input}
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <button type="submit" className={styles.signInButton}>
            Request to Create an Account
          </button>
        </form>

        <footer className={styles.footer}>
          &copy; 2025 Bhouse. All rights reserved for the use of terms related
          to Bhouse.
        </footer>
      </div>
    </div>
  );
};

export default CreateAccount;
