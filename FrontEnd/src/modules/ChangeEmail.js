import {Button, Form, Modal} from "react-bootstrap";
import React, {useContext, useState} from "react";
import authentication from "../services/authentication";
import UserData from "../services/UserContext";
import accountPage from "../pages/AccountManagement";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangeEmail = (props) =>{
    const {user, setUser} = useContext(UserData);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function updatePassword(e){
        setPassword(e.target.value);
    }
    function updateEmail(e){
        setEmail(e.target.value);
    }


    function handleSubmit(e){
        e.preventDefault();
        if(authentication.auth(user.id)){
            authentication.changeEmail(password, email, user.id).then(r =>{
                if(r.success === true){
                    toast.success(r.message, {containerId: 'A', autoClose:1500});
                }else{
                    toast.error(r.message, {containerId: 'A', autoClose:1500});
                }
            });
        }
    console.log(user);
    }
    return(
        <Form onSubmit={handleSubmit} className={"formDetails"}>
            <ToastContainer enableMultiContainer containerId={'A'} position={toast.POSITION.TOP_CENTER} />
            <legend>Change Email</legend>
                <Form.Group>
                    <Form.Label>New Email:</Form.Label>
                    <Form.Control placeholder="New Email" onChange={updateEmail}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={updatePassword}/>
                </Form.Group>
            <div className="text-center">
                <Button variant="primary" type={"submit"} >
                    Save
                </Button>
        </div>
        </Form>
    )
}
export default ChangeEmail;

