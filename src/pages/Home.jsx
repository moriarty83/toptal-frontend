import { useState, useEffect } from "react";
import { useAppState } from "../AppState";

function Home(props){

    const {state, dispace} = useAppState()

    const [myEntries, setMyEntries] = useState();

    /////////////////
    //METHODS 
    ////////////////
    const getEntries =()=>{
        
        if(JSON.parse(window.localStorage.getItem("auth"))){
            const token = JSON.parse(window.localStorage.getItem("auth")).token
            return fetch(state.url+ "foods",{
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
                console.log(data)
                setMyEntries(data)
            })
            .catch((error) => {window.alert(error)}
            );
        }
    }

    const loading = ()=>{
        <tr className="table">
            <td className="table">
                Loading...
            </td>
        </tr>
    }
    const loaded = () =>{
        const user = JSON.parse(window.localStorage.getItem("data")).user
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
                console.log("end")
                tableArray.push({data: subArray, date: currentDate, total: dayTotal})
            }
        }

        console.log(tableArray)

        const tables = tableArray.map((element, index)=>{
            return(
                <div>
                <h2>Date: {element.date}</h2>
                <h4>Total Calories: {element.total} of {user.daily_limit}</h4>
                <table className="table table-dark table-striped">

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
                        
                        <tr >
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

    useEffect(getEntries, [])

    return(
        <>
            <h1>Home</h1>
            
                {myEntries ? loaded() : loading()}
           

        </>
    )
}

export default Home