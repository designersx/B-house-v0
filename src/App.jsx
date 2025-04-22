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
import ProtectedRoute from "./Components/Private/ProtectedRoute";

function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };
  //Check User has Permission
  const requestPermission = async () => {
    console.log('Requesting permission...');
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.warn('Notification permission denied.');
      }

    } catch (error) {
      console.error('An error occurred while requesting permission or getting token:', error);
    }
  };
  
  //function lock
  useEffect(() => {
    requestPermission()
  }, [])
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Sign />}></Route>
        
          <Route path="/home" element={   <ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path="/reset" element={<ProtectedRoute><Reset /></ProtectedRoute>}></Route>
          <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>}></Route>
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>}></Route>
          <Route path="/team" element={<ProtectedRoute><TeamMembers /></ProtectedRoute>}></Route>
          <Route path="/create-account" element={<ProtectedRoute><CreateAccount /></ProtectedRoute>}></Route>
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>}></Route>
          <Route path="/forget" element={<ProtectedRoute><Forget /></ProtectedRoute>}></Route>
          <Route path="/invoice" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>}></Route>
          <Route path="/docs" element={<ProtectedRoute><DocsPage /></ProtectedRoute>}></Route>
          <Route path="/punchlist" element={<ProtectedRoute><PunchPage /></ProtectedRoute>}></Route>
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          <Route path="/orderInfo" element={<ProtectedRoute><OrderInfo /></ProtectedRoute>} />
          <Route path="/punchlist-detail" element={<ProtectedRoute><PunchListDetail /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
