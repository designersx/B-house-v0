import React, { useEffect, useState } from 'react';
import styles from '../Onboarding/Onboarding.module.css';
import Modal from '../Modal/Modal';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import URL from '../../config/api.js';

const onboardingItems = [
  { img: 'Svg/Coi.svg', title: 'Building Delivery Hours' },
  { img: 'Svg/Coi.svg', title: 'Building Sample (COI)' }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const customerInfo = localStorage.getItem("customerInfo");
  const clientId = customerInfo ? JSON.parse(customerInfo)?.id : null;
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [project, setProject] = useState(null);
  const [projectId, setProjectId] = useState(null);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryHours, setDeliveryHours] = useState('');
  const [customHours, setCustomHours] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-GB', options);
  };

  const handleChange = (e) => {
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRes = await axios.get(`${URL}/projects/client/${clientId}`);
        const selected = projectRes.data[0];
        if (!selected) return;

        const full = await axios.get(`${URL}/projects/${selected.id}`);
        setProject(full.data);
        setProjectId(selected.id);

        setDeliveryAddress(full.data.deliveryAddress || "");
        setDeliveryHours(full.data.deliveryHours || "");
        setCustomHours(["Regular Hours", "Before 9 AM", "After 6 PM"].includes(full.data.deliveryHours) ? "" : full.data.deliveryHours);
        setSelectedDate(full.data.estimatedCompletion?.split('T')[0] || today);
      } catch (err) {
        console.error("Error fetching project", err);
      }
    };

    if (clientId) fetchProject();
  }, [clientId]);

  const handleSubmit = async () => {
    try {
      const data = {
        deliveryAddress,
        deliveryHours: deliveryHours === "Other" ? customHours : deliveryHours,
        estimatedCompletion: selectedDate
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      await axios.put(`${URL}/projects/${projectId}`, formData);

      setCompletedSteps([...completedSteps, openModalIndex]);
      setOpenModalIndex(null);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update project.");
    }
  };

  return (
    <div className={styles.OnboardingMain}>
      <div className={styles.headerPart}>
        <div className={styles.OnboardingTitle}>
          <p>Welcome to Bhouse,</p>
          <h1>New <b>Customer</b> Onboarding</h1>
          <div className={styles.logo}>
            <img src='Svg/b-houseBlack.svg' alt='Logo' />
          </div>
        </div>
        <div><img src='Svg/lamp.svg' alt='lamp' /></div>
      </div>

      <div className={styles.bodyMain}>
        {onboardingItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.bodypart} ${completedSteps.includes(index) ? styles.completedStepBorder : ''}`}
          >
            <div className={styles.FlexDiv}>
              <div className={`${styles.iconLogo} ${completedSteps.includes(index) ? styles.completedStep : ''}`}>
                <img src={item.img} alt='' />
              </div>
              <div><h2>{item.title}</h2></div>
            </div>
            {completedSteps.includes(index) ? (
              <div><img src='Svg/done.svg' alt='' /></div>
            ) : (
              <div onClick={() => setOpenModalIndex(index)} style={{ cursor: 'pointer' }}>
                <img src='Svg/start.svg' alt='' />
              </div>
            )}
          </div>
        ))}

        <div className={styles.bodypart2}>
          <div className={styles.FlexDiv}>
            <div className={styles.iconLogo}><img src='Svg/Coi.svg' alt='Coi' /></div>
            <div><h2>Est. Occupancy date</h2></div>
          </div>
          <div className={styles.dateWrapper}>
            <input
              type="date"
              value={selectedDate}
              onChange={handleChange}
              className={styles.hiddenInput}
            />
            <div className={styles.display} onClick={() => document.querySelector(`.${styles.hiddenInput}`).showPicker()}>
              {formatDate(selectedDate)}
            </div>
          </div>
        </div>

        <p className={styles.signP}>
          Upload your documents to proceed or <b>skip</b> for later.
        </p>
      </div>

      <div className={styles.skipMain}>
        {completedSteps.length === onboardingItems.length ? (
          <div className={styles.continueDiv} onClick={() => navigate("/home")}>
            <button className={styles.continueButton}>Continue</button>
          </div>
        ) : (
          <div className={styles.skipDiv}>
            <div onClick={() => navigate("/home")}><p>Skip Now</p></div>
          </div>
        )}
      </div>

      {openModalIndex !== null && (
        <Modal isOpen={true} onClose={() => setOpenModalIndex(null)}>
          <div className={styles.modalContent}>
            <h2>{onboardingItems[openModalIndex].title}</h2>

            {openModalIndex === 0 && (
              <>
                <div className={styles.formGroup}>
                  <label>Delivery Address*</label>
                  <input
                    type="text"
                    placeholder="Write delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Delivery Hours*</label>
                  <select
                    value={deliveryHours}
                    onChange={(e) => {
                      setDeliveryHours(e.target.value);
                      if (e.target.value !== "Other") setCustomHours("");
                    }}
                  >
                    <option>Regular Hours</option>
                    <option>Before 9 AM</option>
                    <option>After 6 PM</option>
                    <option>Other</option>
                  </select>
                </div>

                {deliveryHours === "Other" && (
                  <div className={styles.formGroup}>
                    <label>Other</label>
                    <textarea
                      placeholder="Enter custom hours"
                      value={customHours}
                      onChange={(e) => setCustomHours(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {openModalIndex === 1 && (
              <>
                <div className={styles.formGroup}>
                  <label>Insurance Provider Names*</label>
                  <select>
                    <option>Ex-UnitedHealth Group</option>
                    <option>Aetna</option>
                    <option>BlueCross BlueShield</option>
                    <option>Cigna</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Upload COI Document</label>
                  <input type="file" />
                </div>

                <div className={styles.formGroup}>
                  <label>Comments or Notes</label>
                  <textarea placeholder="Leave your thought here" />
                </div>
              </>
            )}
          </div>

          <button onClick={handleSubmit} className={styles.submitButton}>Update</button>
        </Modal>
      )}
    </div>
  );
};

export default Onboarding;
