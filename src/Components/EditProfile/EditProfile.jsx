import React, { useRef, useState } from 'react'
import styles from '../EditProfile/EditProfile.module.css'
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState('Images/profle.png');

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setProfileImage(imageURL);
        }
    };
    return (
        <div className={styles.profileContainer}>
            <div className={styles.BlueImg}>
                <img src='Images/Bg-blue.png' alt='' />
            </div>
            <button className={styles.backButton}>
                <img src='Svg/back-arrow.svg' alt='' onClick={() => navigate(-1)} />
                <h2 className={styles.title}>Edit Profile</h2>
            </button>


            <div className={styles.ProfileSection}>
                <div className={styles.imageSection}>
                    <img src={profileImage} alt="Profile" className={styles.profileImage} />
                    <button className={styles.editIcon} onClick={handleImageClick}>
                        <img src="/Svg/roundEdit.svg" alt="Edit" />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                <div className={styles.detalis}>
                    <p className={styles.name}>Jenny Wilson</p>
                    <p className={styles.email}>J.wilson@example.com</p>
                </div>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label>Full Name<span>*</span></label>
                    <input type="text" placeholder="Full name" />
                </div>

                <div className={styles.formGroup}>
                    <label>Email<span>*</span></label>
                    <input type="email" placeholder="YourEmail@gmail.com" />
                </div>

                <div className={styles.formGroup}>
                    <label>Phone Number<span>*</span></label>
                    <input type="tel" placeholder="88-XXX-XXX-88" />
                </div>

                <div className={styles.formGroup}>
                    <label>Company Name<span>*</span></label>
                    <input type="text" placeholder="XYZ Company Name" />
                </div>

                <div className={styles.updateBtn}>
                    <p>Update</p>
                </div>
            </div>

        </div>
    )
}

export default EditProfile
