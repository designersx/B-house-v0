import React, { useEffect } from "react";
import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from '../src/Components/Home/Home'
import Sign from "./Components/Sign/Sign";
import Reset from "./Components/Reset/Reset";
import Onboarding from "./Components/Onboarding/Onboarding";
import Forget from "./Components/Forget/Forget";
import InvoicePage from "./Pages/InvoicePage/InvoicePage";
import DocsPage from "./Pages/DocsPage/DocsPage";
import PunchPage from "./Pages/PunchPage/PunchPage";
import OrderDetail from "./Components/Home/OrderDetail/OrderDetail";
import CreateAccount from "./Components/CreateAccount/CreateAccount";
import Verify from "./Components/Verify/Verify";
import EditProfile from "./Components/EditProfile/EditProfile";
import OrderInfo from "./Components/Home/OrderInfo/OrderInfo";
import TeamMembers from "./Components/TeamMembers/TeamMembers";
import PunchListDetail from "./Components/Punchlist/Punchlistdestail";





function App() {

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Sign />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/reset" element={<Reset />}></Route>
          <Route path="/verify" element={<Verify />}></Route>
          <Route path="/edit-profile" element={<EditProfile />}></Route>
          <Route path="/team" element={<TeamMembers />}></Route>
          <Route path="/create-account" element={<CreateAccount />}></Route>
          <Route path="/onboarding" element={<Onboarding />}></Route>
          <Route path="/forget" element={<Forget />}></Route>
          <Route path="/invoice" element={<InvoicePage />}></Route>
          <Route path="/docs" element={<DocsPage />}></Route>
          <Route path="/punchlist" element={<PunchPage />}></Route>
          <Route path="/order/:id" element={<OrderDetail />} />

          <Route path="/orderInfo" element={<OrderInfo />} />
          <Route path="/punchlist-detail" element={<PunchListDetail />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
