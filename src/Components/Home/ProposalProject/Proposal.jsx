import React, { useEffect, useState } from "react";
import styles from "./Proposal.module.css";
import axios from "axios";
import URL from "../../../config/api";
import ProjectOverView from "../ProjectOverView/ProjectOverView";
import ProjectDelivery from "../ProjectDelivery/ProjectDelivery";

function Proposal() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const steps = [
    {
      id: 1,
      img: "/Svg/docs.svg",
      label: "Docs",
      count: "08",
      color: "#A5C9FF",
      colorSmall: "#B8DFFF",
    },
    {
      id: 2,
      img: "/Svg/tracking.svg",
      label: "Tracking",
      count: "04",
      color: "#F9C74F",
      colorSmall: "#FFCD88",
    },
    {
      id: 3,
      img: "/Svg/invoice.svg",
      label: "Invoice",
      count: "02",
      color: "#F94144",
      colorSmall: "#FF8D90",
    },
    {
      id: 4,
      img: "/Svg/team.svg",
      label: "Team",
      count: "01",
      color: "#90BE6D",
      colorSmall: "#D9D9D9",
    },
    {
      id: 5,
      img: "/Svg/EIN.svg",
      label: "EIN",
      count: "05",
      color: "#577590",
      colorSmall: "#FFEA81",
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const customer = JSON.parse(localStorage.getItem("customerInfo"));
      const storedProjectId = localStorage.getItem("selectedProjectId");
  
      if (!customer?.id) return;
  
      try {
        const res = await axios.get(`${URL}/projects/client/${customer.id}`);
        const projectsData = res.data || [];
        setProjects(projectsData);
        
  
        // Check if a previously selected project exists
        if (storedProjectId) {
          const matched = projectsData.find(p => p.id.toString() === storedProjectId);
          if (matched) {
            setSelectedProjectId(matched.id);
            setSelectedProject(matched);
            return;
          }
        }
  
        // Fallback to the first project if no match
        if (projectsData.length > 0) {
          setSelectedProjectId(projectsData[0].id);
          setSelectedProject(projectsData[0]);
          localStorage.setItem("selectedProjectId", projectsData[0].id);
          localStorage.setItem("selectedProject", JSON.stringify(projectsData[0]));
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
  
    fetchProjects();
  }, []);
  
  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find((p) => p.id.toString() === projectId);
    setSelectedProjectId(projectId);
    setSelectedProject(project);
    localStorage.setItem("selectedProjectId", projectId);

  };
 

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h4 className={styles.statusBadge}>
          {selectedProject ? selectedProject.status : "Loading..."}
        </h4>

        <div className={styles.projectSelector}>
          <span className={styles.projectTitle}>Project: </span>
          <select
            value={selectedProjectId || ""}
            onChange={handleProjectChange}
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        <p className={styles.subText}>
          Here's what's happening with your projects
        </p>
      </div>

      {/* Progress Tracker Section */}
      <div className={styles.progressTracker}>
        {steps.map((step) => (
          <div key={step.id} className={styles.step}>
            <div className={styles.circle}>
              <div
                className={styles.count}
                style={{ backgroundColor: step.colorSmall }}
              >
                <span
                  className={styles.counttip}
                  style={{ borderColor: step.colorSmall }}
                ></span>
                <span>{step.count}</span>
              </div>
              <img src={step.img} alt={step.label} className={styles.icon} />
            </div>
            <p className={styles.label}>{step.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        {steps.map((step) => (
          <div
            key={step.id}
            className={styles.barSegment}
            style={{ backgroundColor: step.color }}
          ></div>
        ))}
      </div>
      <ProjectOverView  selectedProject={selectedProject}/>
      <ProjectDelivery selectedProject={selectedProject}/>
    </div>
  );
}

export default Proposal;
