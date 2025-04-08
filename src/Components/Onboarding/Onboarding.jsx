import React, { useState } from 'react';
import styles from '../Onboarding/Onboarding.module.css';
import Modal from '../Modal/Modal';
import { useNavigate } from "react-router-dom";

const onboardingItems = [
    { img: 'Svg/Coi.svg', title: 'Project Address' },
    { img: 'Svg/Coi.svg', title: 'Building Delivery Hours' },
    { img: 'Svg/Coi.svg', title: 'Building Sample (COI)' },

];
const Onboarding = () => {
    const navigate = useNavigate();
    const [openModalIndex, setOpenModalIndex] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);

    const handleOpenModal = (index) => {
        if (index === 0 || completedSteps.includes(index - 1)) {
            setOpenModalIndex(index);
        }
    };

    const handleSubmit = () => {
        setCompletedSteps([...completedSteps, openModalIndex]);
        setOpenModalIndex(null);
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
                {onboardingItems.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.bodypart} ${completedSteps.includes(index) ? styles.completedStepBorder : ''}`}
                    >
                        <div className={styles.FlexDiv}>
                            <div
                                className={`${styles.iconLogo} ${completedSteps.includes(index) ? styles.completedStep : ''}`}
                            >
                                <img src={item.img} alt='' />
                            </div>
                            <div>
                                <h2>{item.title}</h2>
                            </div>
                        </div>

                        {completedSteps.includes(index) ? (
                            <div>
                                <img src='Svg/done.svg' alt='' />
                            </div>
                        ) : (
                            <div onClick={() => handleOpenModal(index)} style={{ cursor: 'pointer' }}>
                                <img src='Svg/start.svg' alt='' />
                            </div>
                        )}
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

            {openModalIndex !== null && (
                <Modal isOpen={true} onClose={() => setOpenModalIndex(null)}>
                    <div className={styles.modalContent}>
                        <h2>{onboardingItems[openModalIndex].title}</h2>

                        {openModalIndex === 0 && (
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
                                {/* <div className={styles.formGroup}>
                                    <label>Other</label>
                                    <textarea placeholder="Leave your thoughts here" />
                                </div> */}
                            </>
                        )}

                        {openModalIndex === 1 && (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Delivery Address*</label>
                                    <input type="text" placeholder="Write delivery address" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Delivery Hours*</label>
                                    <select>
                                        <option>Ex-Regular hours, Before 9 am, after 6pm</option>
                                        <option>9 am to 6 pm</option>
                                        <option>24 Hours Access</option>
                                    </select>
                                </div>
                             
                            </>
                        )}

                        {openModalIndex === 2 && (
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
