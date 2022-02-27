import logo from './logo.svg';
import './App.css';

import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router';
import {Routes, Route} from 'react-router'
import { useAppState } from './AppState'

import Home from './pages/Home';
import Auth from './pages/Auth';
import NewEntry from './pages/NewEntry';

function App() {

  const {state, dispatch} = useAppState();
  const navigate = useNavigate()
  
  const auth = JSON.parse(window.localStorage.getItem("auth"))
  const token = window.localStorage.getItem("auth") ? JSON.parse(window.localStorage.getItem("auth")).token : ""

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/new" element={<NewEntry/>} />

      </Routes>
    </div>
  );
}

export default App;
