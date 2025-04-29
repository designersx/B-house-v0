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
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import ProtectedRoute from "./Components/Private/ProtectedRoute";
import ProjectDeliveryList from "./Components/Home/ProjectDelivery/ProjectDeliveryList";
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
function App() {
  // Initialize App
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  // Initialize Firebase App
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const messaging = !isIOS() ? getMessaging(app) : null;

  // Request Notification Permission
  const requestPermission = async () => {
    if (!isNewNotificationSupported()) {
      console.warn('Notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.warn('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  // Feature detection for Notification API
  function isNewNotificationSupported() {
    if (!window.Notification || !Notification.requestPermission) return false;
    if (Notification.permission === 'granted') return false;

    try {
      new Notification('');
    } catch (e) {
      if (e.name === 'TypeError') return false;
    }
    return true;
  }

  useEffect(() => {
    if (isIOS()) {
      console.log("iOS device detected. Web push is not supported.");
      return;
    }

    requestPermission();

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        const title = payload?.data?.title || 'B-House Notification';
        const body = payload?.data?.body || 'You have a new message';
        const icon = '/Svg/b-houseLogo.svg';

        if (Notification.permission === 'granted') {
          new Notification(title, { body, icon });
        }
      });

      return () => {
        unsubscribe && unsubscribe();
      };
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(reg => console.log('Service Worker registered:', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, [messaging]);

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
    </>
  )
}

export default App
