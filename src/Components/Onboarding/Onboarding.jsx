import React, { useEffect, useState, useRef } from "react";
import styles from "../Onboarding/Onboarding.module.css";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import URL from "../../config/api";
import { url2 } from "../../config/url";
import Loader from "../Loader/Loader";
const onboardingItems = [
  // { img: 'Svg/project-address.svg', title: 'Project Address' },
  { img: "Svg/delivery-hour.svg", title: "Building Delivery Hours" },
  { img: "Svg/sample-icon.svg", title: "Building Sample (COI)" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const customerInfo = localStorage.getItem("customerInfo");
  const clientId = customerInfo ? JSON.parse(customerInfo)?.id : null;
  const [estimatedWeeks, setEstimatedWeeks] = useState("");

  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryHours, setDeliveryHours] = useState("");
  const [customHours, setCustomHours] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [projects, setProjects] = useState([]);
  const [docsData, setDocsData] = useState([]);
  const [docFile, setDocFile] = useState();
  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${URL}/projects/client/${clientId}`);
        const allProjects = res.data;

        if (!allProjects.length) return;

        setProjects(allProjects);
        const firstProject = allProjects[0];

        setProjectId(firstProject.id); // Default select first project
        fetchProjectDetails(firstProject.id);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    if (clientId) fetchProject();
  }, [clientId]);
  const [laoding, setLoading] = useState(false);
  const fetchDocs = async () => {
    setLoading(true);
    const id = projectId;
    try {
      const res = await axios.get(`${URL}/customerDoc/document/${id}`);
      setDocsData(res.data || []);
      const sampleCOIDoc = res.data.find(
        (doc) => doc.documentType === "Sample COI"
      );
      setDocFile(sampleCOIDoc?.filePath);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [openModalIndex]);
  const fetchProjectDetails = async (id) => {
    try {
      const full = await axios.get(`${URL}/projects/${id}`);
      const data = full.data;

      setDeliveryAddress(data.deliveryAddress || "");
      setDeliveryHours(data.deliveryHours || "");
      setCustomHours(
        ["Regular Hours", "Before 9 AM", "After 6 PM"].includes(data.deliveryHours)
          ? ""
          : data.deliveryHours
      );

      // ✅ Convert weeks into a real date using createdAt
      const baseDate = data.createdAt ? new Date(data.createdAt) : new Date();
      const weeks = parseInt(data.estimatedCompletion, 10);
      if (!isNaN(weeks)) {
        setEstimatedWeeks(weeks); // Store just the number
      }



    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        deliveryAddress,
        deliveryHours: deliveryHours === "Other" ? customHours : deliveryHours,
        // estimatedCompletion: selectedDate,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );

      await axios.put(`${URL}/projects/${projectId}`, formData);
      setCompletedSteps((prev) => [...prev, openModalIndex]);
      setOpenModalIndex(null);
    } catch (err) {
      console.error("Update failed", err);
      // alert('Failed to update project.');
    } finally {
      setLoading(false);
    }
  };

  const inputRef = useRef(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [rangeValue, setRangeValue] = useState(0);

  useEffect(() => {
    const today = new Date();
    const iso = today.toISOString().split("T")[0];
    setDeliveryDate(iso);
    setRangeValue(getDayDiffFromToday(iso));
  }, []);

  const openCalendar = () => {
    try {
      inputRef.current?.showPicker?.();
    } catch {
      inputRef.current?.click();
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDeliveryDate(newDate);
    setRangeValue(getDayDiffFromToday(newDate));
  };

  const handleRangeChange = (e) => {
    const daysToAdd = parseInt(e.target.value, 10);
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const newDate = today.toISOString().split("T")[0];
    setDeliveryDate(newDate);
    setRangeValue(daysToAdd);
  };

  const formatDate2 = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    // Split the formatted date into day and month
    const [day, month] = formattedDate.split(" ");

    return (
      <span>
        <span className={styles.day}>{day} </span>
        <span className={styles.month}>{month}</span>
      </span>
    );
  };

  const getDayDiffFromToday = (dateStr) => {
    const today = new Date();
    const given = new Date(dateStr);
    return Math.round((given - today) / (1000 * 60 * 60 * 24));
  };
  const [file, setFile] = useState(null);
  const handleUploadDoc = async () => {
    setLoading(true);
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("projectId", projectId);
    formData.append("documentType", "Sample COI");

    try {
      const response = await axios.post(`${URL}/customerDoc/add`, formData);
      // alert("File uploaded successfully!");
      setCompletedSteps((prev) => [...prev, openModalIndex]);
      setOpenModalIndex(null);
    } catch (err) {
      console.error("Upload failed", err);
      // alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.OnboardingMain}>
      <div className={styles.headerPart}>
        <div className={styles.OnboardingTitle}>
          <p>Welcome to Bhouse,</p>
          <h1>
            New <b>Customer</b> Onboarding
          </h1>
          <div className={styles.logo}>
            <img src="Svg/b-houseBlack.svg" alt="Logo" />
          </div>
        </div>
        <div>
          <img src="Svg/lamp.svg" alt="lamp" />
        </div>
      </div>

      <div className={styles.bodyMain}>
        {/* <div className={styles.dateDiv}>
          <p className={styles.title}>Select Desired Delivery Date</p>

          <div className={styles.flexrange}>
            <div className={styles.range}>
              <input
                type="range"
                min="0"
                max="365"
                value={rangeValue}
                onChange={handleRangeChange}
                className={styles.rangeInput}
              />
              <div
                className={styles.selectedDate}
                style={{
                  left: `calc(${(rangeValue / 365) * 85}%`,
                  transform:
                    rangeValue === 0
                      ? "translateX(0%)"
                      : rangeValue === 365
                        ? "translateX(0%)"
                        : "translateX(0%)",
                }}
              >
                <p className={styles.dateP}>
                  {formatDate2(deliveryDate)}
                </p>

              </div>
            </div>


            <div className={styles.datePickerWrapper}>
              <label htmlFor="deliveryDate" className={styles.label} onClick={openCalendar}>
                <img src="Svg/calendar-icon.svg" alt="Calendar Icon" />
              </label>
              <p>  Date Picker</p>


              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                ref={inputRef}
                value={deliveryDate}
                onChange={handleDateChange}
                className={styles.dateInput}
              />
            </div>

            <select
  value={projectId}
  onChange={(e) => {
    const selectedId = e.target.value;
    setProjectId(selectedId);
    fetchProjectDetails(selectedId);
  }}
>
  {projects.map((project) => (
    <option key={project.id} value={project.id}>
      {project.name}
    </option>
  ))}
</select>
          </div>
        </div> */}

        <select
          className={styles.fancySelect}
          value={projectId}
          onChange={(e) => {
            const selectedId = e.target.value;
            setProjectId(selectedId);
            fetchProjectDetails(selectedId);
          }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {onboardingItems.map((item, index) => {
          const isCompleted = completedSteps.includes(index);

          return (
            <div
              key={index}
              className={`
        ${styles.bodypart}
        ${!isCompleted ? styles.pendingStepBorder : ""}
        ${isCompleted ? styles.completedStepBorder : ""}
      `}
            >
              <div className={styles.FlexDiv}>
                <div
                  className={`${styles.iconLogo} ${isCompleted ? styles.completedStep : ""
                    }`}
                >
                  <img src={item.img} alt="" />
                </div>
                <div>
                  <h2>{item.title}</h2>
                </div>
              </div>
              <div
                onClick={() => setOpenModalIndex(index)}
                style={{ cursor: "pointer" }}
              >
                <img
                  onClick={fetchDocs}
                  src={isCompleted ? "Svg/done.svg" : "Svg/start.svg"}
                  alt="icon"
                />
              </div>
            </div>
          );
        })}

        <div className={styles.bodypart2}>
          <div className={styles.FlexDiv}>
            <div className={styles.iconLogo}>
              <img src="Svg/occupancy-date.svg" alt="Coi" />
            </div>
            <div className={styles.Date}>
              <h2>Est. Occupancy date</h2>
              <p>{estimatedWeeks} Week{Number(estimatedWeeks) > 1 ? "s" : ""}</p>



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
            <div onClick={() => navigate("/home")}>
              <p>Skip Now</p>
            </div>
          </div>
        )}
      </div>

      {openModalIndex !== null && (
        <Modal isOpen={true} onClose={() => setOpenModalIndex(null)}>
          <div className={styles.modalContent}>
            <div className={styles.titleDiv}>
              <h2>{onboardingItems[openModalIndex].title}</h2>
            </div>

            {/* {openModalIndex === 0 && (
              <>
                <div className={styles.formGroup}>
                  <label>Project Address*</label>
                  <input
                    type="text"
                    placeholder="Write project address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Project Hours*</label>
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
            )} */}

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
                {/* <div className={styles.formGroup}>
                  <label>Insurance Provider Names*</label>
                  <select>
                    <option>Ex-UnitedHealth Group</option>
                    <option>Aetna</option>
                    <option>BlueCross BlueShield</option>
                    <option>Cigna</option>
                  </select>
                </div> */}

                <div className={styles.formGroup}>
                  {laoding ? (
                    <Loader />
                  ) : (
                    <>
                      {docFile ? (
                        (() => {
                          const fileExtension = docFile
                            .split(".")
                            .pop()
                            .toLowerCase();
                          const fileUrl = `${url2}/${docFile}`;

                          if (fileExtension === "pdf") {
                            return (
                              <iframe
                                height="300px"
                                width="100%"
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                                  fileUrl
                                )}&embedded=true`}
                                title="PDF Preview"
                              />
                            );
                          } else if (
                            ["jpg", "jpeg", "png"].includes(fileExtension)
                          ) {
                            return (
                              <img
                                src={fileUrl}
                                alt="Document Preview"
                                style={{
                                  maxWidth: "100%",
                                  height: "300px",
                                  objectFit: "contain",
                                }}
                              />
                            );
                          } else {
                            return <p>Unsupported file format.</p>;
                          }
                        })()
                      ) : (
                        <>
                          <label>Upload COI Document</label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* <div className={styles.formGroup}>
                  <label>Comments or Notes</label>
                  <textarea placeholder="Leave your thought here" />
                </div> */}
              </>
            )}
          </div>

          <button
            onClick={openModalIndex == 0 ? handleSubmit : handleUploadDoc}
            className={
              openModalIndex == 0 || (!docFile && openModalIndex == 1)
                ? styles.submitButton
                : null
            }
          >
            {openModalIndex == 0 || (!docFile && openModalIndex == 1) ? (
              laoding ? (
                <Loader size={13} />
              ) : (
                "Update"
              )
            ) : null}
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Onboarding;
