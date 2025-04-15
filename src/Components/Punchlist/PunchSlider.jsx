import React from "react";
import Slider from "react-slick";
import styles from "./SliderPunch.module.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


// import styles from "./Punchlist.module.css";

export default function SimpleSlider() {
    const settings = {
        dots: false ,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
      };
  return (
    <div className={` ${styles.PunchImageSlider} PunchImageSlider `}>
    <Slider {...settings}>
      <div className={styles.slideImg}>
       <img src="/Images/ChairImg.png" alt="Slider Image 1" />
      </div>
      <div  className={styles.slideImg}>
      <img src="/Images/ChairImg.png" alt="Slider Image 1" />
      </div>
      <div  className={styles.slideImg}>
      <img src="/Images/ChairImg.png" alt="Slider Image 1" />
      </div>
      <div  className={styles.slideImg}>
      <img src="/Images/ChairImg.png" alt="Slider Image 1" />
      </div>
      <div  className={styles.slideImg}>
      <img src="/Images/ChairImg.png" alt="Slider Image 1" />
      </div>
      <div  className={styles.slideImg}>
      <img src="/Images/ChairImg.png" alt="Slider Image 1" />
      </div>
    </Slider>

{/* <Slider {...settings}>
        <div className={styles.slide}>Slide 1</div>
        <div className={styles.slide}>Slide 2</div>
        <div className={styles.slide}>Slide 3</div>
        <div className={styles.slide}>Slide 4</div>
        <div className={styles.slide}>Slide 5</div>
      </Slider> */}
    </div>
  );
}