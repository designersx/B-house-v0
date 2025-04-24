import React, { useEffect, useState } from "react";
import styles from "./Proposal.module.css";
import axios from "axios";
import URL from "../../../config/api";
import ProjectOverView from "../ProjectOverView/ProjectOverView";
import ProjectDelivery from "../ProjectDelivery/ProjectDelivery";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
function Proposal() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [docData, setDocsData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const teamUsersFromStorage = localStorage.getItem("teamusers");

  const parsedTeamUsers = teamUsersFromStorage
    ? teamUsersFromStorage.split(",").map((id) => Number(id.trim()))
    : [];
  const fetchDocs = async () => {
    const id = JSON.parse(localStorage.getItem("selectedProjectId"));
    try {
      const res = await axios.get(`${URL}/customerDoc/document/${id}`);
      setDocsData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };
  const fetchInvoice = async () => {
    const id = JSON.parse(localStorage.getItem("selectedProjectId"));
    try {
      const res = await axios.get(`${URL}/projects/${id}/invoice`);
      setInvoiceData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };
  useEffect(() => {
    fetchDocs();
  }, []);
  useEffect(() => {
    fetchInvoice();
  }, []);
  const steps = [
    {
      id: 1,
      img: "/Svg/docs.svg",
      label: "Docs",
      count: `${docData?.length || 0}`,
      color: "#015369",
      colorSmall: "#015369",
    },
    // {
    //   id: 2,
    //   img: "/Svg/tracking.svg",
    //   label: "Tracking",
    //   count: "04",
    //   color: "#F9C74F",
    //   colorSmall: "#FFCD88",
    // },
    {
      id: 3,
      img: "/Svg/invoice.svg",
      label: "Invoice",
      count: `${invoiceData?.length || 0}`,
      color: "#E1917A",
      colorSmall: "#E1917A",
    },
    {
      id: 4,
      img: "/Svg/team.svg",
      label: "Team",
      count: `${parsedTeamUsers?.length || 0}`,
      color: "#E7FAF6",
      colorSmall: "#E7FAF6",
    },
    // {
    //   id: 5,
    //   img: "/Svg/EIN.svg",
    //   label: "EIN",
    //   count: "05",
    //   color: "#577590",
    //   colorSmall: "#FFEA81",
    // },
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
  
        const allProjectIds = projectsData.map((project) => project.id);
        localStorage.setItem("allProjectIds", JSON.stringify(allProjectIds));
  
        const matched = storedProjectId
          ? projectsData.find((p) => p.id.toString() === storedProjectId)
          : null;
  
        const fallbackProject = projectsData[0];
  
        const selected = matched || fallbackProject;
  
        if (selected) {
          setSelectedProjectId(selected.id);
          setSelectedProject(selected);
          localStorage.setItem("selectedProjectId", selected.id);
          localStorage.setItem("selectedProject", JSON.stringify(selected));
  
          // ✅ Store team users in localStorage
          const allUserIds = selected.assignedTeamRoles?.flatMap((role) => role.users || []) || [];
          localStorage.setItem("teamusers", allUserIds.join(","));
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
  localStorage.setItem("selectedProject", JSON.stringify(project));

  // ✅ Update teamusers when project changes
  const allUserIds = project?.assignedTeamRoles?.flatMap((role) => role.users || []) || [];
  localStorage.setItem("teamusers", allUserIds.join(","));
};

  return (
    <>
      {!selectedProject ? (
        <div className={styles.ForLoder}>
          <Loader />
        </div>
      ) : (
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
                {projects
                  .filter((proj) => proj.status !== "Archived")
                  .map((proj) => (
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
              <div
                key={step.id}
                className={styles.step}
                onClick={() => navigate(`/${step.label.toLowerCase()}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.circle}>
                  <div
                    className={styles.count}
                    style={{ backgroundColor: step.colorSmall }}
                  >
                    <span
                      className={styles.counttip}
                      style={{ borderColor: step.colorSmall }}
                    ></span>
                    <span className={step.id === 1 ? styles.whiteCount : ""}>
                      {step.count}
                    </span>
                  </div>
                  <img
                    src={step.img}
                    alt={step.label}
                    className={styles.icon}
                  />
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
          <ProjectOverView selectedProject={selectedProject} />
          <ProjectDelivery selectedProject={selectedProject} />
        </div>
      )}
    </>
  );
}

export default Proposal;
