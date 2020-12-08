import React, {useContext} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './pages/home'
import BrowseEmotes from './pages/BrowseEmotes'
import NotFound from './pages/NotFound'
import AccountPage from './pages/AccountManagement';
import UserData from "./services/UserContext";
const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/emotes' component={BrowseEmotes} />
            <Route path='/account' component={AccountPage} />
            <Route path='*' component={NotFound} />
        </Switch>
    </BrowserRouter>
);
export default Routes;