import React from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from '../src/Components/Home/Home'
import Sign from "./Components/Sign/Sign";
import Reset from "./Components/Reset/Reset";
import Onboarding from "./Components/Onboarding/Onboarding";
import Invoice from "./Components/Invoice/Invoice";
import Docs from "./Components/Docs/Docs";
import Punchlist from "./Components/Punchlist/Punchlist";



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sign />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/reset" element={<Reset/>}></Route>
          <Route path="/onboarding" element={<Onboarding />}></Route>
          <Route path="/invoice" element={<Invoice />}></Route>
          <Route path="/docs" element={<Docs />}></Route>
          <Route path="/punchlist" element={<Punchlist />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
