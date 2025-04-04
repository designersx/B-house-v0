import React, { useState } from 'react';
import styles from '../Onboarding/Onboarding.module.css';
import Modal from '../Modal/Modal';
import { useNavigate, } from "react-router-dom";



const onboardingItems = [
    { img: 'Svg/Coi.svg', title: 'Project Address', link: 'https://login.microsoftonline.com/5a89ca1e-6149-40f1-95b4-3123ceacb89c/oauth2/authorize?client%5Fid=00000003%2D0000%2D0ff1%2Dce00%2D000000000000&response%5Fmode=form%5Fpost&response%5Ftype=code%20id%5Ftoken&resource=00000003%2D0000%2D0ff1%2Dce00%2D000000000000&scope=openid&nonce=A61BBC1955D66B2B7114210A659BF3CD3E3DF1F5CE3E3315%2DCB371FF6B1BCEF357322B54AFEC812891EC308005D1B4F45C3EDFEDD1E810F0B&redirect%5Furi=https%3A%2F%2Fmapeigroup%2Esharepoint%2Ecom%2F%5Fforms%2Fdefault%2Easpx&state=OD0w&claims=%7B%22id%5Ftoken%22%3A%7B%22xms%5Fcc%22%3A%7B%22values%22%3A%5B%22CP1%22%5D%7D%7D%7D&wsucxt=1&cobrandid=11bd8083%2D87e0%2D41b5%2Dbb78%2D0bc43c8a8e8a&client%2Drequest%2Did=d84885a1%2D9073%2D0000%2D49d3%2D3ee9dee858ef' },
    { img: 'Svg/Coi.svg', title: 'Building Delivery Hours', link: 'https://ttp.cbp.dhs.gov/' },
    { img: 'Svg/Coi.svg', title: 'Building Sample (COI)', link: 'https://docs.google.com/gview?embedded=true&url=https://polyglass.us/wp-content/uploads/2024/01/Polyflex-5.0-PDS_.pdf' },
    { img: 'Svg/Coi.svg', title: 'Est. Occupancy date', link: 'https://polyglass.us/wp-content/uploads/2023/03/2023-Sparc-Brochure-2023-NL_web.pdf' }
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
                      
                        {/*Sirf Start button pe modal open hoga */}
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

                <p className={styles.signP}>
                    Upload your documents to proceed or <b>skip</b> for later.
                </p>
            </div>


            <div className={styles.skipMain}>
                {completedSteps.length === onboardingItems.length && (
                    <div className={styles.continueDiv} onClick={() => navigate("/home")}>
                        <button className={styles.continueButton}>Continue</button>
                    </div>
                )}

                {completedSteps.length !== onboardingItems.length && (
                    <div className={styles.skipDiv}>
                        <div onClick={() => navigate("/home")}><p>Skip Now</p></div>
                    </div>
                )}
            </div>
            {openModalIndex !== null && (
                <Modal isOpen={true} onClose={() => setOpenModalIndex(null)}>
                    <div className={styles.modalContent}>
                        <h2>{onboardingItems[openModalIndex].title}</h2>
                        <p>{onboardingItems[openModalIndex].desc}</p>

                        {onboardingItems[openModalIndex].link.includes('.pdf') ? (
                            <iframe
                                src={onboardingItems[openModalIndex].link}
                                width="100%"
                                height="500px"
                                style={{ border: 'none' }}
                            ></iframe>
                        ) : (
                            <div className={styles.LinkDiv}>
                                <b>Explore Now : </b>
                                <a
                                    href={onboardingItems[openModalIndex].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.openLinkButton}
                                >
                                    Open this Link
                                </a>
                            </div>
                        )}

                    </div>
                    <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>

                </Modal>
            )}

        </div>
    );
};

export default Onboarding;
