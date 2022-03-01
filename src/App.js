import logo from './logo.svg';
import './App.css';

import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router';
import {Routes, Route} from 'react-router'
import { useAppState } from './AppState'

import Home from './pages/Home';
import Auth from './pages/Auth';
import NewEntry from './pages/NewEntry';
import Admin from './pages/Admin'
import Update from './pages/Update'
import Nav from './componenets/Nav'

function App() {

  const {state, dispatch} = useAppState();
  const navigate = useNavigate()
  
  const auth = JSON.parse(window.localStorage.getItem("auth"))
  const token = window.localStorage.getItem("auth") ? JSON.parse(window.localStorage.getItem("auth")).token : ""
  const user = JSON.parse(window.localStorage.getItem("data")).user

  ///////////////////////
  // METHODS
  ///////////////////////
  const newFoodEntry = (foodEntry) =>{
    return fetch(state.url+ "food_entries",{
        method: "post",
        headers: { "Authorization": "Bearer " + state.token},
        body: JSON.stringify(foodEntry)})
    .then( (response) => {
        if(response.ok){
            return response.json()
        }
        else{
            throw new Error("An error of type " + response.status + " occured")
        };
    })
    .then((data)=>{
        console.log(data)})
    .catch((error) => {window.alert(error)}
    );
  }
  return (
    <div className="App">
      <Nav user={user} />
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/new" element={<NewEntry newFoodEntry={newFoodEntry}/>} />
        {user.admin ? <><Route path="/admin" element={<Admin />} />
        <Route path="/admin/:id" element={<Update newFoodEntry={newFoodEntry}/>} />
</> : ""}
        

      </Routes>
    </div>
  );
}

export default App;
