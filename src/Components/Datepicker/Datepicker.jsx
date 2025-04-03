import React, { useState, useRef } from "react";
import styles from "../Datepicker/DatePicker.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Datepicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const datePickerRef = useRef(null);
  const sliderMax = 30;
  
  // Function to update date from slider
  const handleSliderChange = (e) => {
    const daysToAdd = parseInt(e.target.value, 10);
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };

  // Function to update date from DatePicker
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Desired Delivery Date</h2>
      <div className={styles.dragDiv}>
        <div className={styles.wrapper}>
          {/* Date in Marker */}
          <div
            className={styles.marker}
            style={{
              transform: `translateX(${Math.min(
                Math.max(
                  ((selectedDate - new Date()) / (1000 * 60 * 60 * 24)) * (100 / sliderMax),
                  0
                ),
                100
              )}%)`,
              clipPath: "path('M 100 0 C 100 0 101 76 0 139 C 0 0 0 179 0 -100')"
            }}
          >
            
            <span className={styles.date}>{selectedDate.getDate()}</span>
            <span className={styles.month}>{selectedDate.toLocaleString("default", { month: "short" })}</span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max={sliderMax}
            value={(selectedDate - new Date()) / (1000 * 60 * 60 * 24)}
            onChange={handleSliderChange}
            className={styles.slider}
          />
        </div>
        <div className={styles.Reactdate}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className={styles.hiddenDatePicker}
            ref={datePickerRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Datepicker;