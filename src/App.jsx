import React from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
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



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sign />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/reset" element={<Reset/>}></Route>
          <Route path="/create-account" element={<CreateAccount/>}></Route>
          <Route path="/onboarding" element={<Onboarding />}></Route>
          <Route path="/forget" element={<Forget  />}></Route>
          <Route path="/invoice" element={<InvoicePage />}></Route>
          <Route path="/docs" element={<DocsPage />}></Route>
          <Route path="/punchlist" element={<PunchPage />}></Route>
        
          <Route path="/order/:id" element={<OrderDetail />} />
          {/* <Route path="/order" element={<OrderDetail />}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
