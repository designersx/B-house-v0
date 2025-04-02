import React from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from '../src/Components/Home/Home'
import Sign from "./Components/Sign/Sign";
import Reset from "./Components/Reset/Reset";


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sign />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/reset" element={<Reset/>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
