
import React , {useState ,useEffect} from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Punchlist from '../../Components/Punchlist/Punchlist'
import Loader from '../../Components/Loader/Loader'
import SideBar from '../../Components/SideBar/SideBar.jsx'
import Header from '../../Components/Header/Header.jsx';
import axios from 'axios'
import URL from '../../config/api.js'

const PunchPage = () => {
    const [statusFilters, setStatusFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [lastNotificationTime, setLastNotificationTime] = useState(null);
    const projectId = localStorage.getItem("selectedProjectId");
  const fetchLastNotificationTime = async () => {
    if (!projectId) return;

    try {
      const res = await axios.get(`${URL}/projects/${projectId}`);
      setLastNotificationTime(res.data?.lastNotificationSentAt || null);
      console.log(res.data?.lastNotificationSentAt)
    } catch (err) {
      console.error("Failed to fetch project info:", err);
    }
  };
  useEffect(() => {
    fetchLastNotificationTime();
  }, [projectId]);
    const formatDate = (date) => {
    const d = new Date(date);
  
    const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    // Format with lowercase am/pm
    let formatted = d.toLocaleString('en-GB', options);
  
    // Capitalize AM/PM
    formatted = formatted.replace(/\b(am|pm)\b/, (match) => match.toUpperCase());
  
    return formatted;
  };
  console.log({lastNotificationTime})
  return (
    <>
      <div>
        <div className="MobContent">
          <div className="HeaderTop">
            <HeaderTab
              title="Punchlist"
              onStatusFilterChange={setStatusFilters}
              onSearchTermChange={setSearchTerm}
              statusOptions={["Pending", "Resolved", "Rejected"]}
            />
          </div>

         
          <Punchlist statusFilters={statusFilters} searchTerm={searchTerm} />


          <Footer />

        </div>

        <div className="webContent">
          <div className="HeaderTop">
            <Header showSearchIcon={false}/>
          </div>
          <div className="mainContent">
            <div className="Web_Sidebar">
              <SideBar />
            </div>


            <div className="Web_container">
            <div className="HeaderTop2">
            <HeaderTab
              title="Punchlist"
              onStatusFilterChange={setStatusFilters}
              onSearchTermChange={setSearchTerm}
              statusOptions={["Pending", "Resolved", "Rejected"]}
              
            />
          </div>
             {lastNotificationTime && (
          <p style={{marginLeft: "28px"}}>
            <b>Last Updated:{" "}</b>
            {lastNotificationTime && !isNaN(new Date(lastNotificationTime))
              ? formatDate(lastNotificationTime)
              : "Not Updated"}
          </p>

        )}
              <Punchlist statusFilters={statusFilters} searchTerm={searchTerm} />
            </div>
            <Footer />

          </div>
        </div>
      </div>
    </>
  )
}



export default PunchPage;
