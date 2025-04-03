import React from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from '../src/Components/Home/Home'
import Sign from "./Components/Sign/Sign";
import Reset from "./Components/Reset/Reset";
import Onboarding from "./Components/Onboarding/Onboarding";
import Forget from "./Components/Forget/Forget";


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sign />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/reset" element={<Reset/>}></Route>
          <Route path="/onboarding" element={<Onboarding />}></Route>
          <Route path="/forget" element={<Forget  />}></Route>
          <Route path="*" element={<h2 className="comingSoon">Coming Soon</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
