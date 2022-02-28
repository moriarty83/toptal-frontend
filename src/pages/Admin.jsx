import React, { useState, useEffect } from "react";
import {useParams, useNavigate, Navigate } from "react-router-dom"
import { useAppState } from "../AppState"

function Admin (props){
    const [entries, setEntries] = useState()

    const {state, dispatch} = useAppState()

    var today = new Date();

    console.log(today)
    ////////////
    // METHODS
    ////////////

    const getEntries = ()=>{
        const token = JSON.parse(window.localStorage.getItem("auth")).token
        return fetch(state.url+ "admin",{
            method: "get",
            headers: { "Authorization": "Bearer " + token,
            "Content-Type": "application/json"},
            })
        .then( (response) => {
            if(response.ok){
                return response.json()
            }
            else{
                throw new Error("An error of type " + response.status + " occured")
            };
        })
        .then((data)=>{
            setEntries(data)})
        .catch((error) => {window.alert(error)}
        );
    }

    const updateEntry = (entry)=>{
        const token = JSON.parse(window.localStorage.getItem("auth")).token
        return fetch(state.url+ "admin",{
            method: "put",
            headers: { "Authorization": "Bearer " + token,
            "Content-Type": "application/json"},
            body: JSON.stringify(entry)
            })
        .then( (response) => {
            if(response.ok){
                return response.json()
            }
            else{
                throw new Error("An error of type " + response.status + " occured")
            };
        })
        .then((data)=>{
            setEntries(data)})
        .catch((error) => {window.alert(error)}
        );
    }

    const [formData, setFormData] = useState({
        food: "",
        calories: 0
    })

    const handleChange = (event) =>{
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        const token = JSON.parse(window.localStorage.getItem("auth")).token
        return fetch(state.url+ "admin",{
            method: "post",
            headers: { "Authorization": "Bearer " + token,
            "Content-Type": "application/json"},
            body: JSON.stringify({product: formData.product, 
                calories: formData.calories, 
                date: formData.date,
                time: formData.time})})
        .then( (response) => {
            if(response.ok){
                return response.json()
            }
            else{
                throw new Error("An error of type " + response.status + " occured")
            };
        })
        .then((data)=>{
            setEntries(data)})
        .catch((error) => {window.alert(error)}
        );
    }

    const index=()=>{
        return(
            <table className="table table-dark table-striped">
                <thead>
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">Product</th>
                      <th scope="col">Calories</th>
                      <th scope="col">Time</th>
                      <th scope="col">User ID</th>
                      <th scope="col">Details</th>
                  </tr>
              </thead>
              <tbody>
                    {entries.map((e, i)=>{
                        let time = ""
                        if(e.time != null){time = e.time.substring(11, 19)}

                    return(
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td><input type="text" value={e.product} /></td>
                        <td><input type="number" value={e.calories} /></td>
                        <td><input type="time" value={time} /></td>
                        <td><input type="number" value={e.user_id}/></td>
                        <td><a href={"./admin/"+e.id}>Details</a></td>

                    </tr>
                    )
                    })}
                </tbody>
            </table>

            
        )
    }

    const thisWeek = ()=>{
        let total = 0;
        const week = entries.filter(item => (today - Date.parse(item.created_at))  < 604800000);
        
        for(let row of week){
            total = total + row.calories
        }
        const average = total/week.length
        const rows = week.map((e, i)=>{
            let time = ""
            if(e.time != null){time = e.time.substring(11, 19)}
        return(
        
        <tr key={i}>
            <td>{i+1}</td>
            <td>{e.product}</td>
            <td>{e.calories}</td>
            <td>{time}</td>
            <td>{e.user_id}</td>
        </tr>
        )
        })
        
        return(<>
                <h2>Average: {average.toPrecision(6)}</h2>
                <table className="table table-dark table-striped">

                <thead>
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">Product</th>
                      <th scope="col">Calories</th>
                      <th scope="col">Time</th>
                      <th scope="col">User ID</th>

                  </tr>
              </thead>
              <tbody>
                    {rows}
                </tbody>
            </table>
            </>)
    }

    const lastWeek = ()=>{
        console.log(today - Date.parse(entries[10].created_at))
        const temp = entries.filter(item => (today - Date.parse(item.created_at))  > 604800000);
        const pastWeek = temp.filter(item => (today - Date.parse(item.created_at))  < 604800000*2);

        let total = 0
        for(let row of pastWeek){
            total = total + row.calories
        }
        const average = total/pastWeek.length
        const rows = pastWeek.map((e, i)=>{
            let time = ""
            if(e.time != null){time = e.time.substring(11, 19)}
        return(
        
        <tr key={i}>
            <td>{i+1}</td>
            <td><input type="text" value = {e.product}/></td>
            <td>{e.calories}</td>
            <td>{time}</td>
            <td>{e.user_id}</td>
        </tr>
        )
        })
        return(
                <>
                <h2>Average: {average}</h2>
                <table className="table table-dark table-striped">

                <thead>
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">Product</th>
                      <th scope="col">Calories</th>
                      <th scope="col">Time</th>
                      <th scope="col">User ID</th>

                  </tr>
              </thead>
              <tbody>
                    {rows}
                </tbody>
            </table>
            </>)
    }

    const loading = ()=>{
        <table className="table table-dark table-striped">
            <tr>Loading</tr>
        </table>
    }

    const loaded =()=>{
        return(
            <>
            <div className="index">
            {index()}
            </div>
            <div className="sub-table">
            {thisWeek()}
            {lastWeek()}
            </div>
            </>
        )

        
    }

    /////////////
    // USE EFFECT
    /////////////
    useEffect(getEntries, [])

    return (
        <>
        {entries ? loaded() : loading()}

        

        <div className="form">
            <h1>New Food Entry</h1>
            <form onSubmit={handleSubmit}>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Food Name</span>
                    <input onChange={handleChange} name="product" type="text" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Calories</span>
                    <input onChange={handleChange} name="calories" type="number" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Date</span>
                    <input onChange={handleChange} name="date" type="date" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Time</span>
                    <input onChange={handleChange} name="time" type="time" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <input className="button" type="submit" />
            </form>
        </div>
    
        </>
    )
}
export default Admin