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
  const [errors, setErrors] = useState({});

const Navigate = useNavigate();

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  // Validate individual field
  validateField(name, value);
};
const validateField = (name, value) => {
  let message = "";
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\d{10}$/;
  const companyRegex = /^[a-zA-Z0-9\s]+$/;
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  switch (name) {
    case "fullName":
      if (!value.trim()) message = "Full name is required.";
      else if (!nameRegex.test(value)) message = "Only letters and spaces allowed.";
      break;

    case "email":
      if (!value.trim()) message = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(value)) message = "Invalid email address.";
      break;

    case "phone":
      if (!value.trim()) message = "Phone number is required.";
      else if (!phoneRegex.test(value)) message = "Phone number must be exactly 10 digits.";
      break;

    case "companyName":
      if (!value.trim()) message = "Company name is required.";
      else if (!companyRegex.test(value)) message = "Alphanumeric and spaces only.";
      else if (emojiRegex.test(value)) message = "Emojis are not allowed in the company name.";
      break;

    case "description":
      if (!value.trim()) message = "Description is required.";
      else if (value.length < 10) message = "Minimum 10 characters required.";
      else if (emojiRegex.test(value)) message = "Emojis are not allowed in the description.";
      break;

    case "address":
      if (value.length > 100) message = "Max 100 characters allowed.";
      else if (emojiRegex.test(value)) message = "Emojis are not allowed in the address.";
      break;

    default:
      break;
  }

  setErrors((prev) => ({ ...prev, [name]: message }));
};


const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate all fields before submitting
  Object.entries(formData).forEach(([key, value]) => validateField(key, value));

  const hasErrors = Object.values(errors).some((msg) => msg);
  if (hasErrors) {
    toast.error("Please correct the highlighted errors.");
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
    setErrors({});
  } catch (err) {
    console.error("Request failed:", err);
    const message = err.response?.data?.message || "Submission failed. Please try again.";
    toast.error(message);
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
        <h2 className={styles.heading}>Create an Account</h2>
        <p className={styles.subtext}>
          Fill in your details below and we’ll get your account set up in no
          time.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Full Name<span className={styles.required}>*</span></label>
          <input
            type="text"
            placeholder="Full name"
            className={styles.input}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            maxLength={30}
          />
          {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}

          <label>Email<span className={styles.required}>*</span></label>
          <input
            type="email"
            placeholder="youremail@gmail.com"
            className={styles.input}
            name="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={50}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <label>Phone Number<span className={styles.required}>*</span></label>
          <input
            type="tel"
            placeholder="88-XXX-XXX-88"
            className={styles.input}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
          />
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}

          <label>Company Name<span className={styles.required}>*</span></label>
          <input
            type="text"
            placeholder="XYZ Company"
            className={styles.input}
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            maxLength={30}
          />
          {errors.companyName && <p className={styles.error}>{errors.companyName}</p>}

          <label>Description<span className={styles.required}>*</span></label>
          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Describe "
            rows="3"
            value={formData.description}
            onChange={handleChange}
            maxLength={200}
          />
          {errors.description && <p className={styles.error}>{errors.description}</p>}

          <label>Address (Optional)</label>
          <input
            type="text"
            placeholder="Street, City, Zip"
            className={styles.input}
            name="address"
            value={formData.address}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.address && <p className={styles.error}>{errors.address}</p>}

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
