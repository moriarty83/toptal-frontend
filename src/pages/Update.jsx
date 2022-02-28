import {useState, useEffect} from 'react'
import { useAppState } from '../AppState'
import {useParams} from 'react-router-dom'


function Update(){

    const params = useParams()
    console.log(params.id)
    
    const {state} = useAppState()

    const getEntry = ()=>{
        const token = JSON.parse(window.localStorage.getItem("auth")).token
        return fetch(state.url+"foods/"+params.id,{
            method: "get",
            headers: { "Authorization": "Bearer " + token,
            "Content-Type": "application/json"},})
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
            setFormData(data)
            })
        .catch((error) => {window.alert(error)}
        );
    }
    const [formData, setFormData] = useState()

    const handleChange = (event) =>{
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        const token = JSON.parse(window.localStorage.getItem("auth")).token
        return fetch(state.url+ "foods/"+params.id,{
            method: "put",
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

    const handleDelete = ()=>{
        const token = JSON.parse(window.localStorage.getItem("auth")).token
        return fetch(state.url+ "foods/"+params.id,{
            method: "delete",
            headers: { "Authorization": "Bearer " + token,
            "Content-Type": "application/json"}})
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
        );}

    const loading = ()=>{
        return(
            <h1>Loading...</h1>
        )
    }

    const loaded = ()=>{
        return(
            <div className='card'>
            <h1>Update</h1>
            <form onSubmit={handleSubmit}>
                <div class="input-group mb-3">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">User ID: {formData.user_id}</span>
                    
                </div>
                    <span class="input-group-text" id="basic-addon1">Food Name</span>
                    <input onChange={handleChange} value={formData.product} name="product" type="text" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Calories</span>
                    <input onChange={handleChange} value={formData.calories} name="calories" type="number" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Date</span>
                    <input onChange={handleChange} value={formData.date} name="date" type="date" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Time</span>
                    <input onChange={handleChange} value={formData.time.substring(11, 16)} name="time" type="time" class="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <input type="submit" />
                
            </form>
            <button onClick={handleDelete}>Delete</button>
        </div>
        )
    }


    useEffect(getEntry, [])

    return(
        <>
        {formData ? loaded() : loading()}
        </>
    )
}

export default Update