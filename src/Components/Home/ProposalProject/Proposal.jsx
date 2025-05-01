import React, { useEffect, useState } from "react";
import styles from "./Proposal.module.css";
import axios from "axios";
import URL from "../../../config/api";
import ProjectOverView from "../ProjectOverView/ProjectOverView";
import ProjectDelivery from "../ProjectDelivery/ProjectDelivery";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../Loader/Loader";

function Proposal({ onArchivedStatus }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [docData, setDocsData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [parsedTeamUsers, setParsedTeamUsers] = useState([]);
  const [prevProjectId, setPrevProjectId] = useState(null); // store last valid project

  const fetchDocs = async (projectId) => {
    try {
      const res = await axios.get(`${URL}/customerDoc/document/${projectId}`);
      setDocsData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  const fetchInvoice = async (projectId) => {
    try {
      const res = await axios.get(`${URL}/projects/${projectId}/invoice`);
      if (res.data?.error === "No invoices found for this project") {
        setInvoiceData([]);
      } else {
        setInvoiceData(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setInvoiceData([]);
    }
  };

  const fetchTeamUsers = (project) => {
    const allUserIds = project?.assignedTeamRoles?.flatMap((role) => role.users || []) || [];
    setParsedTeamUsers(allUserIds);
    localStorage.setItem("teamusers", allUserIds.join(","));
  };

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customerInfo"));
    const storedProjectId = localStorage.getItem("selectedProjectId");

    if (!customer?.id) return;

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${URL}/projects/client/${customer.id}`);
        const projectsData = res.data || [];
        setProjects(projectsData);

        const storedProject = projectsData.find((p) => p.id.toString() === storedProjectId) || projectsData[0];

        if (storedProject) {
          setSelectedProjectId(storedProject.id);
          setPrevProjectId(storedProject.id); // set as previous valid
          setSelectedProject(storedProject);
          localStorage.setItem("selectedProjectId", storedProject.id);
          localStorage.setItem("selectedProject", JSON.stringify(storedProject));

          const allProjectIds = projectsData.map((project) => project.id);
          localStorage.setItem("allProjectIds", JSON.stringify(allProjectIds));

          fetchTeamUsers(storedProject);
          fetchDocs(storedProject.id);
          fetchInvoice(storedProject.id);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("fromEmail") === "true") {
      const projectId = params.get("projectId");
      const project = projects.find((p) => p.id.toString() === projectId);

      if (project) {
        setSelectedProjectId(projectId);
        setPrevProjectId(projectId);
        setSelectedProject(project);
        localStorage.setItem("selectedProjectId", projectId);
        localStorage.setItem("selectedProject", JSON.stringify(project));

        fetchTeamUsers(project);
        fetchDocs(projectId);
        fetchInvoice(projectId);
      }
    }
  }, [location, projects]);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find((p) => p.id.toString() === projectId);

    if (project?.status === "Archived") {
      onArchivedStatus?.(); // Show popup
      // Revert dropdown to previous valid project
      setSelectedProjectId(prevProjectId);
    } else {
      setSelectedProjectId(projectId);
      setSelectedProject(project);
      setPrevProjectId(projectId); // update prev only if valid
      localStorage.setItem("selectedProjectId", projectId);
      localStorage.setItem("selectedProject", JSON.stringify(project));

      fetchTeamUsers(project);
      fetchDocs(projectId);
      fetchInvoice(projectId);
    }
  };

  const steps = [
    {
      id: 1,
      img: "/Svg/docs.svg",
      label: "Docs",
      count: `${docData.length || 0}`,
      color: "#015369",
      colorSmall: "#015369",
    },
    {
      id: 3,
      img: "/Svg/invoice.svg",
      label: "Invoice",
      count: `${invoiceData.length || 0}`,
      color: "#E1917A",
      colorSmall: "#E1917A",
    },
    {
      id: 4,
      img: "/Svg/team.svg",
      label: "Team",
      count: `${parsedTeamUsers.length || 0}`,
      color: "#E7FAF6",
      colorSmall: "#E7FAF6",
    },
  ];

  return (
    <>
      {!selectedProject ? (
        <div className={styles.ForLoder}>
          <Loader />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <h4 className={styles.statusBadge}>{selectedProject.status}</h4>
            <div className={styles.projectSelector}>
              <span className={styles.projectTitle}>Project: </span>
              <select value={selectedProjectId || ""} onChange={handleProjectChange}>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name.length > 10 ? proj.name.slice(0, 10) + "..." : proj.name}
                    {proj.status === "Archived" ? " (Archived)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <p className={styles.subText}>Here's what's happening with your projects</p>
          </div>

          <div className={styles.progressTracker}>
            {steps.map((step) => (
              <div
                key={step.id}
                className={styles.step}
                onClick={() => navigate(`/${step.label.toLowerCase()}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.circle}>
                  <div className={styles.count} style={{ backgroundColor: step.colorSmall }}>
                    <span className={styles.counttip} style={{ borderColor: step.colorSmall }}></span>
                    <span className={step.id === 1 ? styles.whiteCount : ""}>{step.count}</span>
                  </div>
                  <img src={step.img} alt={step.label} className={styles.icon} />
                </div>
                <p className={styles.label}>{step.label}</p>
              </div>
            ))}
          </div>

          <div className={styles.progressBar}>
            {steps.map((step) => (
              <div key={step.id} className={styles.barSegment} style={{ backgroundColor: step.color }}></div>
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
