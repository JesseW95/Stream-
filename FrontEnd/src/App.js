import React, {Component, useState, useReducer, useEffect} from 'react';
import './App.css';
import Layout from './layout/layout';
import Home from './pages/home';
import AddEmotes from './pages/BrowseEmotes';
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/AccountManagement"
import UserData from "./services/UserContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import authentication from "./services/authentication";
const App = (props) => {
    function reducer(state, item) {
        return [...state, item]
    }
    let userdata = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState([]);

    useEffect(()=>{if (userdata != null && user.usingEmotes == null) {
        authentication.auth(userdata["id"]).then(r => {
            setUser(r);
        });


    }}, []);


    // Call it once in your app. At the root of your app is the best place
    toast.configure({
        autoClose: 500,
        draggable: false
    });



    return (
        <UserData.Provider value={{user, setUser}}>
            <BrowserRouter>
                <Layout>
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        <Route path="/emotes" exact component={AddEmotes}/>
                        <Route path="/account" exact component={AccountPage}/>
                        <Route path="*" component={NotFound}/>
                    </Switch>
                </Layout>
            </BrowserRouter>
        </UserData.Provider>
    );
}
export default App;