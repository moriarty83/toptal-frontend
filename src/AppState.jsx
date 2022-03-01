import React, { useReducer } from 'react';


/////////////////////////
// INITIAL STATE
/////////////////////////

const initialState = {
    url: process.env.REACT_APP_TOPTAL_URL,
    appID: process.env.REACT_APP_ID,
    key: process.env.REACT_APP_KEY,
    token: null,
    username: null,
}

/////////////////////////
// REDUCER
/////////////////////////
// action = {type: "", payload: ---}
const reducer = (state, action)=>{
    let newState;
    
    switch(action.type){
        case  "auth":
            console.log(action.payload)
            newState = {...state, ...action.payload}
            return newState
        case "logout":
            newState = {...state, token: null}
            window.localStorage.removeItem("auth")
            window.sessionStorage.removeItem("recipe")
            return newState

            
        default:
            return state
            
            
    }
}

/////////////////////////
// APPCONTEXT
/////////////////////////

// Provides state to everything
const AppContext = React.createContext(null)


/////////////////////////
// APP STATE COMPONENET
/////////////////////////
export function AppState (props){
    const [state, dispatch] = useReducer(reducer, initialState)

    return(
        <AppContext.Provider value={{state, dispatch}}>
            {props.children}
        </AppContext.Provider>
    )
}


/////////////////////////
// USE APPSTATE HOOK
/////////////////////////
// Create a custom hook for app state

export const useAppState = ()=>{
    return React.useContext(AppContext)
}
