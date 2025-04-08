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
            <img src='Svg/back-arrow.svg' alt='' onClick={() => navigate(-1)}/>
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

                <p className={styles.name}>Jenny Wilson</p>
                <p className={styles.email}>J.wilson@example.com</p>
            </div>

        </div>
    )
}

export default EditProfile
