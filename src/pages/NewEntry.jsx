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


    const [suggestions, setSuggestions] = useState()

    /////////////
    // METHODS
    //////////////
    const  handleChange = async (event) =>{

        if(event.target.name === 'product'){
            getSuggestion(event)
        }

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

    const getSuggestion = async (event)=>{
        const key = event.target.name
        const value = event.target.value

        let suggestion = await fetch("https://trackapi.nutritionix.com/v2/search/instant",{
            method: "post",
            headers: {
                "x-app-id": state.appID,
                "x-app-key": state.key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query:value}) 
               
            })
            .then( (response) => {                
                {return response.json()}
            })
            .then((data) => {
                let items = data.common.slice(0, 5)
                setSuggestions(items)
            })
    }

    const getFood = (food) =>{
        fetch("https://trackapi.nutritionix.com/v2/natural/nutrients ",{
            method: "post",
            headers: {
                "x-app-id": state.appID,
                "x-app-key": state.key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query:food}) 
               
            })
            .then( (response) => {                
                {return response.json()}
            })
            .then((data) => {  
                setFormData({...formData, product: data.food[0].food_name, calories: data.food[0].nf_calories})
                console.log(data)
            })
    }


    const showSuggestions = ()=>{

        const rows = suggestions.map((element, index)=>{
            return(
                <tr key={index} onClick={()=>{getFood(element.food_name)}}>
                    <td><img src={element.photo.thumb} alt={element.food_name + " thumnail"} className="thumb"/></td>
                    <td>{element.food_name}</td>
                </tr>
            )
        })
        
        return(
            <table className="table table-dark table-striped">
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }



    ////////////
    // RENDER
    ////////////
    return(
        <div className='entry'>
        <div className='card'>
            <h1>New Food Entry</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Food Name</span>
                    <input onChange={handleChange} name="product" value={formData.product} type="text" className="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Calories</span>
                    <input onChange={handleChange} name="calories" value={formData.calories} type="number" className="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Date</span>
                    <input onChange={handleChange} name="date" type="date" className="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Time</span>
                    <input onChange={handleChange} name="time" type="time" className="form-control" placeholder="New Food" aria-label="New Food" aria-describedby="basic-addon1" />
                </div>
                <input type="submit" />
            </form>

        </div>
            <div className='suggestions'>
                {suggestions ? showSuggestions() : ""} 
            </div>
        </div>
    )
}

export default NewEntry