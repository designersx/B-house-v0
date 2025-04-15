import React, { useRef } from "react";
import Slider from "react-slick";
import styles from "./SliderPunch.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SimpleSlider() {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px", 
    autoplay: false,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 376,
        settings: {
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 2, 
          centerPadding: "25px",
        },
      },
    ],
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className={styles.PunchImageSlider}>
      <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>
        <img src="Svg/leftArrow.svg" alt="Previous Slide" />
      </button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={nextSlide}>
        <img src="Svg/rightArrow.svg" alt="Next Slide" />
      </button>
      <Slider ref={sliderRef} {...settings}>
        <div className={styles.slideImg}>
          <img src="/Images/ChairImg.png" alt="Slider Image 1" />
        </div>
        <div className={styles.slideImg}>
          <img src="/Images/ChairImg.png" alt="Slider Image 2" />
        </div>
        <div className={styles.slideImg}>
          <img src="/Images/ChairImg.png" alt="Slider Image 3" />
        </div>
        <div className={styles.slideImg}>
          <img src="/Images/ChairImg.png" alt="Slider Image 4" />
        </div>
        <div className={styles.slideImg}>
          <img src="/Images/ChairImg.png" alt="Slider Image 5" />
        </div>
        <div className={styles.slideImg}>
          <img src="/Images/ChairImg.png" alt="Slider Image 6" />
        </div>
      </Slider>
    </div>
  );
}
