import React, { useState } from 'react';
import HeaderTab from '../../Components/HeaderTab/HeaderTab';
import Footer from '../../Components/Footer/Footer';
import Punchlist from '../../Components/Punchlist/Punchlist';

const PunchPage = () => {
  const [statusFilters, setStatusFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
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
  );
};

export default PunchPage;
