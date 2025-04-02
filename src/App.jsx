import React from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from '../src/Components/Home/Home'
import Sign from "./Components/Sign/Sign";


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/" element={<Sign />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
