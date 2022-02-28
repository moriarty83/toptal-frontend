import {useState, useEffect} from 'react'
import { useAppState } from '../AppState'

function NewEntry({newFoodEntry}){

    //////////////
    // Variables
    //////////////
    const {state, dispatch} = useAppState()

    const [formData, setFormData] = useState({
        food: "",
        calories: 0
    })

    const [suggestion, setSuggestion] = useState()

    /////////////
    // METHODS
    //////////////
    const handleChange = (event) =>{
        getSuggestion()
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        const token = JSON.parse(window.localStorage.getItem("auth")).token
        return fetch(state.url+ "foods",{
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
            console.log(data)})
        .catch((error) => {window.alert(error)}
        );
    }

    const getSuggestion = ()=>{
        return fetch("https://trackapi.nutritionix.com/v2/natural/nutrients",{
            method: "post",
            headers: {
                "x-app-id": state.appID,
                "x-app-key": state.key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query:formData.product}) 
               
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
                console.log(data)})
            .catch((error) => {window.alert(error)}
            );
    }
    return(
        <div className='card'>
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
                <input type="submit" />
            </form>
        </div>
    )
}

export default NewEntry