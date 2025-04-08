import React, { useState } from 'react';
import styles from '../Onboarding/Onboarding.module.css';
import Modal from '../Modal/Modal';
import { useNavigate } from "react-router-dom";

const onboardingItems = [
    // { img: 'Svg/Coi.svg', title: 'Project Address' },
    { img: 'Svg/Coi.svg', title: 'Building Delivery Hours' },
    { img: 'Svg/Coi.svg', title: 'Building Sample (COI)' },
];

const Onboarding = () => {
    const navigate = useNavigate();
    const [openModalTitle, setOpenModalTitle] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [selectedDeliveryHour, setSelectedDeliveryHour] = useState('');

    const handleOpenModal = (title) => {
        const index = onboardingItems.findIndex(item => item.title === title);
        const prevTitle = onboardingItems[index - 1]?.title;

        // Allow open if it's the first or previous step is done
        if (index === 0 || completedSteps.includes(prevTitle)) {
            setOpenModalTitle(title);
        } else {
            alert("Please complete the previous step first!");
        }
    };

    const handleSubmit = () => {
        if (!completedSteps.includes(openModalTitle)) {
            setCompletedSteps([...completedSteps, openModalTitle]);
        }
        setOpenModalTitle(null);
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

                <div>
                    <img src='Svg/lamp.svg' alt='lamp' />
                </div>
            </div>

            <div className={styles.bodyMain}>
                {onboardingItems.map((item) => (
                    <div
                        key={item.title}
                        className={`${styles.bodypart} ${completedSteps.includes(item.title) ? styles.completedStepBorder : ''}`}
                    >
                        <div className={styles.FlexDiv}>
                            <div
                                className={`${styles.iconLogo} ${completedSteps.includes(item.title) ? styles.completedStep : ''}`}
                            >
                                <img src={item.img} alt='' />
                            </div>
                            <div>
                                <h2>{item.title}</h2>
                            </div>
                        </div>

                        <div onClick={() => handleOpenModal(item.title)} style={{ cursor: 'pointer' }}>
                            {completedSteps.includes(item.title) ? (
                                <img src='Svg/done.svg' alt='done' />
                            ) : (
                                <img src='Svg/start.svg' alt='start' />
                            )}
                        </div>
                    </div>
                ))}

                <div className={styles.bodypart2}>
                    <div className={styles.FlexDiv}>
                        <div className={styles.iconLogo}>
                            <img src='Svg/Coi.svg' alt='Coi' />
                        </div>
                        <div className={styles.Date}>
                            <h2>Est. Occupancy date</h2>
                            <p>08 April 2025</p>
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

            {openModalTitle && (
                <Modal isOpen={true} onClose={() => setOpenModalTitle(null)} height='70vh'>
                    <div className={styles.modalContent}>
                        <h2>{openModalTitle}</h2>

                        {openModalTitle === 'Project Address' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Project Address*</label>
                                    <input type="text" placeholder="Write project address" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Project Hours*</label>
                                    <select>
                                        <option>Ex-Regular hours, Before 9 am, after 6pm</option>
                                        <option>9 am to 6 pm</option>
                                        <option>24 Hours Access</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {openModalTitle === 'Building Delivery Hours' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Delivery Address*</label>
                                    <input type="text" placeholder="Write delivery address" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Delivery Hours*</label>
                                    <select
                                        value={selectedDeliveryHour}
                                        onChange={(e) => setSelectedDeliveryHour(e.target.value)}
                                    >
                                        <option value="">Select option</option>
                                        <option value="Regular hours">Regular hours</option>
                                        <option value="Before 9 am">9 am</option>
                                        <option value="After 6 pm">After 6 pm</option>
                                        <option value="Others">Others</option>
                                    </select>

                                    {selectedDeliveryHour === "Others" && (
                                        <textarea
                                            className={styles.textarea}
                                            placeholder="Please specify delivery hours"
                                            rows="3"
                                        />
                                    )}
                                </div>

                            </>
                        )}

                        {openModalTitle === 'Building Sample (COI)' && (
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
