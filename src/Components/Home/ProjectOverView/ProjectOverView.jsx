import React, { useEffect, useState } from 'react';
import styles from '../ProjectOverView/ProjectOv.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import URL from '../../../config/api';

function ProjectOverView({ selectedProject }) {
  const navigate = useNavigate()
  const [project, setProject] = useState(null);
  const [leadTimeDays, setLeadTimeDays] = useState(0);
  const [punchList, setPunchList] = useState([]);


  useEffect(() => {
    const fetchProject = async () => {
      const projectId = localStorage.getItem("selectedProjectId");
   
    
      if (!projectId) return;

      try {
        const [projectRes, punchListRes] = await Promise.all([
          axios.get(`${URL}/projects/${projectId}`),
          axios.get(`${URL}/projects/${projectId}/punch-list`)
        ]);

        const project = projectRes.data;
        const punchList = punchListRes.data;

        setProject(project);
        setPunchList(punchList);

        // Lead time calculation
        if (project?.createdAt && project?.estimatedCompletion) {
          const created = new Date(project.createdAt);
          const estimated = new Date(project.estimatedCompletion);
          const diffTime = Math.abs(estimated - created);
          const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setLeadTimeDays(days);
        }
      } catch (err) {
        console.error("Failed to fetch project or punch list", err);
      }
    };


    fetchProject();
  }, [selectedProject]);
  const totalPunchItems = punchList.length;
  const resolvedPunchItems = punchList.filter(item => item.status === "Resolved").length;

  let teamUsers = [];
  try {
    const roles = Array.isArray(project?.assignedTeamRoles)
      ? project.assignedTeamRoles
      : JSON.parse(project?.assignedTeamRoles || "[]");

    teamUsers = roles.flatMap(role => role.users || []);
  } catch (err) {
    console.error("Error parsing team data:", err);
  }

  const visible = teamUsers.slice(0, 4);
  const remaining = teamUsers.length - 4;
  console.log(remaining , "remiaing")
  JSON.stringify(localStorage.setItem("visible" , visible    ))
  JSON.stringify(localStorage.setItem("teamusers" , teamUsers    ))
        // JSON.stringify(localStorage.setItem( "remaining"  , ""  ))
      console.log(teamUsers)
        JSON.stringify(localStorage.setItem("remaining" , remaining   ))
   
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Project Overview</h2>

          <div className={styles.FlexControl}>
            <div className={styles.grid}>
              <div>
                <p className={styles.bigText}>
                  {leadTimeDays}
                  <span className={styles.subText}> Days</span>
                </p>
                <p className={styles.label}>Lead Time</p>
              </div>

              <div onClick={() => navigate('/punchlist')}>
                <p className={styles.bigText}>
                  {resolvedPunchItems}
                  <span className={styles.subText}> out of {totalPunchItems}</span>
                </p>
                <p className={styles.label}>Punchlist</p>
              </div>



              <div
      className={styles.team}
      onClick={() => navigate('/team', { state: { visible, remaining: teamUsers.slice(4) } })}
    >
      <div className={styles.avatars}>
        {visible.map((user, idx) => (
          <img
            key={idx}
            src={user?.profileImage || "/Images/profile-picture.webp"}
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

            <div className={styles.grid}>
              <div>
                <p className={styles.bigText}>
                  {project?.totalValue?.toLocaleString() || 0}
                  <span className={styles.subText}> $</span>
                </p>
                <p onClick={()=>navigate('/invoice')} className={styles.label}>Total Value</p>
              </div>

              <div>
                <p className={styles.bigText}>
                  {(project?.totalValue - project?.advancePayment)?.toLocaleString() || 0}
                  <span className={styles.subText}> $</span>
                </p>
                <p onClick={()=>navigate('/invoice')} className={styles.label}>Balance Due</p>
              </div>

              <div className={styles.advance}>
                <p onClick={()=>navigate('/invoice')} className={styles.advanceText}>Advance Paid </p>
                <p className={styles.bigTextbox}>
                  {project?.advancePayment?.toLocaleString() || 0}
                  <span> $</span>
                </p>
              </div>
            </div>

          </div>

          <div className={styles.document}>
            <div className={styles.docStyle}>
              <img src="/Svg/UploadDocument.svg" alt="Document" className={styles.docImage} />
              <div>
                <p className={styles.docTitle}>04 / 05 Document Received</p>
                <p className={styles.docSubtitle}>Upload latest COI document ASAP!</p>
              </div>
            </div>
            <button className={styles.plusButton}>
              <img src="/Svg/PlusIcon.svg" alt="Add" className={styles.docImage} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverView;