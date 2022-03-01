import { useState, useEffect } from "react";
import { useAppState } from "../AppState";

function Home(props){

    const {state, dispace} = useAppState()

    const [myEntries, setMyEntries] = useState();

    const [dateFilter, setDateFilter] = useState({dateFrom: "none", dateTo:"none"})

    /////////////////
    //METHODS 
    ////////////////

    // GET ENTRIES //
    const getEntries = async ()=>{
        let from = "none"
        let to = "none"

        if (dateFilter.dateFrom != undefined){
            from = dateFilter.dateFrom
        }
        if (dateFilter.dateTo != undefined){
            to = dateFilter.dateTo
        }
        
        if(JSON.parse(window.localStorage.getItem("auth"))){
            const token = JSON.parse(window.localStorage.getItem("auth")).token
            return await fetch(state.url+ "foods",{
                method: "get",
                headers: { "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                from: from,
                to: to    
            },
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
                console.log(data)
                setMyEntries(data)
            })
            .catch((error) => {window.alert(error)}
            );
        }
    }

    // SET FILTER //
    const handleFilter = (event)=>{
        setDateFilter({...dateFilter, [event.target.name]: event.target.value})
    }
    
    // CLEAR FILTER //
    const handleClear = ()=>{
        setDateFilter("none")
    }

    ////////////////
    // LOADING/LOADED
    /////////////////

    const loading = ()=>{
        <tr className="table">
            <td className="table">
                Loading...
            </td>
        </tr>
    }
    const loaded = () =>{
        if(myEntries.length < 1){
            return(
                <h2>No Data to Display</h2>
            )
        }
        const user = JSON.parse(window.localStorage.getItem("data")).user
        console.log(user.daily_limit)
        const tableArray = []
        let dayTotal = 0;
        let currentDate = myEntries[0].date
        let subArray = []
        for(let i = 0; i < myEntries.length; i++){
            console.log(currentDate)
            if(myEntries[i].date === currentDate){
                dayTotal = dayTotal + myEntries[i].calories
                subArray.push(myEntries[i])
            }
            else{
                tableArray.push({data: subArray, date: currentDate, total: dayTotal})
                subArray = []
                currentDate = myEntries[i].date
                dayTotal = 0
                dayTotal = dayTotal + myEntries[i].calories
                subArray.push(myEntries[i])
            }
            console.log(i)
            if(i === myEntries.length-1){
                tableArray.push({data: subArray, date: currentDate, total: dayTotal})
            }
        }

        const tables = tableArray.map((element, index)=>{
            return(
                <div key={index} className={element.date + " w90 m1 flex-col"}>
                <h2>Date: {element.date}</h2>
                <h4>Total Calories: {element.total}/{user.daily_limit}</h4>
                <table className="table table-dark table-striped w90">

                <thead>
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">Product</th>
                      <th scope="col">Calories</th>
                      <th scope="col">Time</th>
                  </tr>
              </thead>
              <tbody>
                      {element.data.map((e, i)=>{
                        return(
                        
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{e.product}</td>
                            <td>{e.calories}</td>
                            <td>{e.time}</td>
                        </tr>
                        
                        )
                      })}
                    </tbody>
                </table>
              </div>
            )
        })
        return(
        <>
            {tables}
        </>)
    }

    //////////////
    // USE EFFECT
    //////////////

    useEffect(getEntries, [dateFilter])


    //////////////
    // RENDER
    //////////////
    return(
        <div className="flex-col">
            <h1>My Food Entries</h1>
            <div className="card flex col">
                <h4>Filter</h4>
                <div className="flex-row">
                    <span className="input-group-text label" id="basic-addon1">From</span>
                    <input onChange={handleFilter} name="dateFrom" type="date" className="form-control" placeholder="filter" aria-label="Filter" aria-describedby="basic-addon1" /> 
                </div>
                <div className="flex-row">
                    <span className="input-group-text label" id="basic-addon1">To</span>
                    <input onChange={handleFilter} name="dateTo" type="date" className="form-control" placeholder="filter" aria-label="Filter" aria-describedby="basic-addon1" />
                </div>
                <div className="buttons">
                <button className="btn btn-secondary" onClick={getEntries}>Submit</button>
                <button className="btn btn-secondary" onClick={handleClear}>Clear Filter</button>
                </div>
            </div>
            {myEntries ? loaded() : loading()}
        </div>
    )
}

export default Home