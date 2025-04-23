import React, { useEffect, useState } from 'react';
import styles from '../Onboarding/Onboarding.module.css';
import Modal from '../Modal/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import URL from '../../config/api';

const onboardingItems = [
  { img: 'Svg/project-address.svg', title: 'Project Address' },
  { img: 'Svg/delivery-hour.svg', title: 'Building Delivery Hours' },
  { img: 'Svg/sample-icon.svg', title: 'Building Sample (COI)' }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const customerInfo = localStorage.getItem('customerInfo');
  const clientId = customerInfo ? JSON.parse(customerInfo)?.id : null;

  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryHours, setDeliveryHours] = useState('');
  const [customHours, setCustomHours] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${URL}/projects/client/${clientId}`);
        const project = res.data[0];
        if (!project) return;

        setProjectId(project.id);
        const full = await axios.get(`${URL}/projects/${project.id}`);
        const data = full.data;

        setDeliveryAddress(data.deliveryAddress || '');
        setDeliveryHours(data.deliveryHours || '');
        setCustomHours(['Regular Hours', 'Before 9 AM', 'After 6 PM'].includes(data.deliveryHours) ? '' : data.deliveryHours);
        setSelectedDate(data.estimatedCompletion?.split('T')[0] || selectedDate);
      } catch (err) {
        console.error('Error fetching project:', err);
      }
    };

    if (clientId) fetchProject();
  }, [clientId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        deliveryAddress,
        deliveryHours: deliveryHours === 'Other' ? customHours : deliveryHours,
        estimatedCompletion: selectedDate
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      await axios.put(`${URL}/projects/${projectId}`, formData);
      setCompletedSteps((prev) => [...prev, openModalIndex]);
      setOpenModalIndex(null);
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update project.');
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
       {onboardingItems.map((item, index) => {
  const isCompleted = completedSteps.includes(index);

  return (
    <div
      key={index}
      className={`
        ${styles.bodypart}
        ${!isCompleted ? styles.pendingStepBorder : ''}
        ${isCompleted ? styles.completedStepBorder : ''}
      `}
    >
      <div className={styles.FlexDiv}>
        <div className={`${styles.iconLogo} ${isCompleted ? styles.completedStep : ''}`}>
          <img src={item.img} alt='' />
        </div>
        <div><h2>{item.title}</h2></div>
      </div>
      <div onClick={() => setOpenModalIndex(index)} style={{ cursor: 'pointer' }}>
        <img src={isCompleted ? 'Svg/done.svg' : 'Svg/start.svg'} alt='icon' />
      </div>
    </div>
  );
})}


        <div className={styles.bodypart2}>
          <div className={styles.FlexDiv}>
            <div className={styles.iconLogo}><img src='Svg/occupancy-date.svg' alt='Coi' /></div>
            <div className={styles.Date}>
              <h2>Est. Occupancy date</h2>
              <p>{formatDate(selectedDate)}</p>
            </div>
          </div>
        </div>

        <p className={styles.signP}>Upload your documents to proceed or <b>skip</b> for later.</p>
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
                      if (e.target.value !== "Other") setCustomHours('');
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
