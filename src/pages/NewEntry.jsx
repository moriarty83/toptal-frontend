import {useState, useEffect} from 'react'
import { useAppState } from '../AppState'

function NewEntry({newFoodEntry}){
    const {state, dispatch} = useAppState()

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
    return(
        <div>
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