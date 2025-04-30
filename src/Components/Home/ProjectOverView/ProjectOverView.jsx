import React, { useEffect, useState } from "react";
import styles from "../ProjectOverView/ProjectOv.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import URL from "../../../config/api";
import { url2 } from "../../../config/url";

function ProjectOverView({ selectedProject }) {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [punchList, setPunchList] = useState([]);
  const [balanceDue, setBalanceDue] = useState(0);
  const [docData, setDocsData] = useState();
  const [leadTimeValue, setLeadTimeValue] = useState(0);
const [leadTimeUnit, setLeadTimeUnit] = useState("Days");

  const fetchDocs = async () => {
    const id = JSON.parse(localStorage.getItem("selectedProjectId"));
    try {
      const res = await axios.get(`${URL}/customerDoc/document/${id}`);
      setDocsData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);
  useEffect(() => {
    const fetchProject = async () => {
      const projectId = localStorage.getItem("selectedProjectId");

      if (!projectId) return;

      try {
        const [projectRes, punchListRes] = await Promise.all([
          axios.get(`${URL}/projects/${projectId}`),
          axios.get(`${URL}/projects/${projectId}/punch-list`),
        ]);

        const project = projectRes.data;
        const punchList = punchListRes.data;

        setProject(project);
        setPunchList(punchList);


      // Lead time calculation
if (project?.createdAt && project?.estimatedCompletion) {
  const created = new Date(project.createdAt);
  const [amountStr, unit] = project.estimatedCompletion.toLowerCase().split("_");
  const amount = parseInt(amountStr);
  let estimated = new Date(created);

  if (unit === "day" || unit === "days") {
    estimated.setDate(created.getDate() + amount);
  } else if (unit === "week" || unit === "weeks") {
    estimated.setDate(created.getDate() + amount * 7);
  } else if (unit === "month" || unit === "months") {
    estimated.setMonth(created.getMonth() + amount);
  } else {
    console.warn("Unknown estimatedCompletion format:", project.estimatedCompletion);
    estimated = new Date(created); // fallback
  }

  const today = new Date();
  const diffTime = estimated - today;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    setLeadTimeValue(0);
    setLeadTimeUnit("Completed");
  } else if (daysRemaining < 7) {
    setLeadTimeValue(daysRemaining);
    setLeadTimeUnit(daysRemaining === 1 ? "Day" : "Days");
  } else {
    const weeks = Math.floor(daysRemaining / 7);
    const leftoverDays = daysRemaining % 7;
    if (leftoverDays === 0) {
      setLeadTimeValue(weeks);
      setLeadTimeUnit(weeks === 1 ? "Week" : "Weeks");
    } else {
      setLeadTimeValue(`${weeks}w ${leftoverDays}d`);
      setLeadTimeUnit("Left");
    }
  }
}

        
      } catch (err) {
        console.error("Failed to fetch project or punch list", err);
      }
    };

    fetchProject();
  }, [selectedProject]);
  const totalPunchItems = punchList.length;
  const resolvedPunchItems = punchList.filter(
    (item) => item.status === "Resolved"
  ).length;

  let teamUsers = [];
  try {
    const roles = Array.isArray(project?.assignedTeamRoles)
      ? project.assignedTeamRoles
      : JSON.parse(project?.assignedTeamRoles || "[]");

    teamUsers = roles.flatMap((role) => role.users || []);
  } catch (err) {
    console.error("Error parsing team data:", err);
  }

  const visible = teamUsers.slice(0, 4);
  const remaining = teamUsers.length - 4;
  JSON.stringify(localStorage.setItem("visible", visible));
  JSON.stringify(localStorage.setItem("teamusers", teamUsers));
  JSON.stringify(localStorage.setItem("remaining", remaining));
  const [users, setusers] = useState();
  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${URL}/auth/getAllUsers`);
      const allUsers = res.data;

      const filteredUsers = allUsers.filter((user) =>
        visible.includes(user.id)
      );
      setusers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const calculateBalance = async (projectId) => {
    try {
      const projectRes = await axios.get(`${URL}/projects/${projectId}`);
      const project = projectRes.data;

      const baseTotalAmount = Number(project.totalValue || 0);
      const baseAdvance = Number(project.advancePayment || 0);

      let invoiceTotal = 0;
      let paidFromInvoices = 0;

      try {
        const invoiceRes = await axios.get(
          `${URL}/projects/${projectId}/invoice`
        );
        const invoices = Array.isArray(invoiceRes.data)
          ? invoiceRes.data
          : [invoiceRes.data];

        invoiceTotal = invoices.reduce(
          (sum, invoice) => sum + Number(invoice.totalAmount || 0),
          0
        );
        paidFromInvoices = invoices.reduce((sum, invoice) => {
          let paid = 0;
          if (invoice.status === "Paid") {
            paid += Number(invoice.totalAmount || 0);
          } else {
            paid += Number(invoice.advancePaid || 0);
          }
          return sum + paid;
        }, 0);
      } catch (invoiceErr) {
        if (invoiceErr.response?.status !== 404) throw invoiceErr;
      }

      const totalCost = Math.max(baseTotalAmount, invoiceTotal);
      const totalPaid = baseAdvance + paidFromInvoices;
      setBalanceDue(totalCost - totalPaid);
    } catch (err) {
      console.error("Error calculating balance due:", err);
    }
  };

  useEffect(() => {
    const projectId = localStorage.getItem("selectedProjectId");
    if (projectId) calculateBalance(projectId);
  }, []);
  useEffect(() => {
    getUserDetails();
  }, [project]);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Project Overview</h2>

          <div className={styles.FlexControl}>
            <div className={styles.grid}>
              <div>
              <p className={styles.bigText}>
  {leadTimeValue}
  <span className={styles.subText}> {leadTimeUnit}</span>
</p>
<p className={styles.label}>Lead Time</p>




              </div>

              <div onClick={() => navigate("/punchlist")}>
                <p className={styles.bigText}>
                  {resolvedPunchItems}
                  <span className={styles.subText}>
                    {" "}
                    out of {totalPunchItems}
                  </span>
                </p>
                <p className={styles.label}>Punchlist</p>
              </div>

              <div
                className={styles.team}
                onClick={() =>
                  navigate("/team", {
                    state: { visible, remaining: teamUsers.slice(4) },
                  })
                }
              >
                <div className={styles.avatars}>
                  {users?.map((user, idx) => (
                    <img
                      key={idx}
                      src={
                        user?.profileImage
                          ? `${url2}/${user.profileImage}`
                          : "/Images/profile-picture.webp"
                      }
                      alt={`User ${user?.firstName || ""}`}
                      className={styles.avatar}
                    />
                  ))}
                  {remaining > 0 && (
                    <span className={styles.plus}>+{remaining}</span>
                  )}
                </div>
                <p className={styles.label}>Team Member</p>
              </div>
            </div>

            <hr></hr>

            <div className={styles.grid}>
              <div>
                <p className={styles.bigText}>
                  {project?.totalValue?.toLocaleString() || 0}
                  <span className={styles.subText}> $</span>
                </p>
                <p
                  onClick={() => navigate("/invoice")}
                  className={styles.label}
                >
                  Total Value
                </p>
              </div>

              <div>
                <p className={styles.bigText}>
                  {balanceDue.toLocaleString()}
                  <span className={styles.subText}> $</span>
                </p>

                <p
                  onClick={() => navigate("/invoice")}
                  className={styles.label}
                >
                  Balance Due
                </p>
              </div>

              <div className={styles.advance}>
                <p
                  onClick={() => navigate("/invoice")}
                  className={styles.advanceText}
                >
                  Advance Paid{" "}
                </p>
                <p className={styles.bigTextbox}>
                  {project?.advancePayment?.toLocaleString() || 0}
                  <span> $</span>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.document}>
            <div className={styles.docStyle}>
              <img
                src="/Svg/UploadDocument.svg"
                alt="Document"
                className={styles.docImage}
              />
              <div>
                <p className={styles.docTitle}>
                  {" "}
                  0{docData?.length}/05 Document Received
                </p>
                <p className={styles.docSubtitle}>
                  Upload latest COI document ASAP!
                </p>
              </div>
            </div>
            <button className={styles.plusButton}>
              <img
                onClick={() => navigate("/docs")}
                src="/Svg/PlusIcon.svg"
                alt="Add"
                className={styles.docImage}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverView;
