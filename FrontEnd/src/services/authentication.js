import axios from "axios";
import {useContext} from "react";
import UserData from "./UserContext";


const API_URL = "http://localhost:8000/";

const register = (username, email, password) => {
    return axios.post(API_URL + "users", {
        username,
        email,
        password,
    }) .then((response) => {
        if (response.data) {
            return response.data;
        }
    });
};

function login(username, password){
    return axios
        .post(API_URL + "login", {
            "username":username,
            "password":password,
        })
        .then((response) => {
            if (response.data.authToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
}

const auth = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    return axios
        .post(API_URL + "auth", {
            authToken: user["authToken"],
            refreshToken: user["refreshToken"],
        })
        .then((response) => {
            if (response.data.authToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            if(response.data.valid === "False"){
                return false;
            }else{
                return response.data;
            }
        });
};

const logout = () => {
    var data = localStorage.getItem('user');
    return axios
        .post(API_URL + "logout", {
            data
        })
        .then((response) => {
            localStorage.removeItem("user");
        });

};


const addEmoteLink = (emote) => {
    let user = JSON.parse(localStorage.getItem("user"));
    return axios
        .post(API_URL + "users/"+user["id"] +" /emotes/", {
            emote:emote.emoteName,
            accountLinked:user["id"],
        })
        .then((response) => {
            if (response.data.emoteLink) {
                return true;
            }else{
                return false;
            }
        });
}

const removeEmoteLink = (emote) => {
    let user = JSON.parse(localStorage.getItem("user"));
    return axios
        .post(API_URL + "users/"+user["id"] +" /emotes/rm/", {
            emote:emote.emoteName,
            accountLinked:user["id"],
        })
        .then((response) => {
            if (response.data.removed === "True") {
                return true;
            }else{
                return false;
            }
        });
}

const getUser = (id) => {
    return axios
        .get(API_URL + "users/"+id, {
            user_id:id,
        })
        .then((response) => {
            if (response.data.username) {
                return response.data;
            }else{
                return false;
            }
        });
}

const getEmote = (id) => {
    return axios
        .get(API_URL + "users/"+ id +"/emotes/", {
        })
        .then((response) => {
            if (response.data) {
                return response.data;
            }else{
                return false;
            }
        });
}

const uploadEmote = (user, file, name,description =" ") => {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("emoteName", name);
    formData.append("uploader", user);
    formData.append("description", description);
    return axios
        .post(API_URL + "emotes/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            if (response.data) {
                return response.data;
            }else{
                return false;
            }
        });
}

const changeEmail = (pass, email, user) =>{
    var formData = new FormData();
    formData.append("usrpass", pass);
    formData.append("email", email);
    formData.append("user", user);
    return axios
        .post(API_URL + "account/changeEmail", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log(response)
            if (response.data) {
                return response.data;
            }else{
                return false;
            }
        });
}

const changePassword = (oldpass, newpass, user) =>{
    var formData = new FormData();
    formData.append("oldpass", oldpass);
    formData.append("newpass", newpass);
    formData.append("user", user);
    return axios
        .post(API_URL + "account/changePassword", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log(response)
            if (response.data) {
                return response.data;
            }else{
                return false;
            }
        });
}

export default {
    register,
    login,
    logout,
    auth,
    addEmoteLink,
    removeEmoteLink,
    getUser,
    getEmote,
    uploadEmote,
    changeEmail,
    changePassword
};