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
import ProjectDeliveryList from "./Components/Home/ProjectDelivery/ProjectDeliveryList";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  initializeApp,
  getApps
} from "firebase/app";
import {
  getMessaging,
  onMessage,
  isSupported
} from "firebase/messaging";
import RouteWatcher from "./utils/RouteWatcher";
// Initialize Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyDblY3fqpz8K5KXDA3HacPUzHxBnZHT1o0",
  authDomain: "bhouse-dc970.firebaseapp.com",
  projectId: "bhouse-dc970",
  storageBucket: "bhouse-dc970.appspot.com",
  messagingSenderId: "577116029205",
  appId: "1:577116029205:web:659adeb7405b59ad21691c",
  measurementId: "G-RFFMNTE7XQ"
};
// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

function App() {
  // Notification setup
  useEffect(() => {
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          const { title, body } = payload?.data || {};
          toast.info(
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://b-house-v0-ten.vercel.app/Svg/Logo-Bhouse.svg"
                alt="B-House"
                style={{ width: 60, height: 60, marginRight: 10, borderRadius: 8 }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#333' }}>{title}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{body}</div>
              </div>
            </div>,
            {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style: {
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '10px 15px',
                border: '1px solid #004680',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
              }
            }
          );
        });
      } else {
        console.warn("Firebase Messaging not supported on this device.");
      }
    }).catch((err) => {
      console.error("Error checking messaging support:", err);
    });
  }, []);
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
        <RouteWatcher />

        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Sign />}></Route>

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path="/reset" element={<Reset />}></Route>
          <Route path="/verify" element={<Verify />}></Route>
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>}></Route>
          <Route path="/team" element={<ProtectedRoute><TeamMembers /></ProtectedRoute>}></Route>
          <Route path="/create-account" element={<CreateAccount />}></Route>
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>}></Route>
          <Route path="/forget" element={<Forget />}></Route>
          <Route path="/invoice" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>}></Route>
          <Route path="/docs" element={<ProtectedRoute><DocsPage /></ProtectedRoute>}></Route>
          <Route path="/punchlist" element={<ProtectedRoute><PunchPage /></ProtectedRoute>}></Route>
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          <Route path="/orderInfo/:id" element={<ProtectedRoute><OrderInfo /></ProtectedRoute>} />
          <Route path="/punchlist-detail/:id" element={<ProtectedRoute><PunchListDetail /></ProtectedRoute>} />

          <Route path="/project-delivery-list" element={<ProtectedRoute><ProjectDeliveryList /></ProtectedRoute>} />


        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  )
}

export default App
