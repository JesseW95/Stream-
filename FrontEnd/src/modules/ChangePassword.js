import React, {useContext, useState} from "react";
import UserData from "../services/UserContext";
import authentication from "../services/authentication";
import {Button, Form} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";

const ChangePassword = (props) =>{
    const {user, setUser} = useContext(UserData);

    const [newPassword, setNewPassword] = useState("");
    const [password, setPassword] = useState("");

    function updatePassword(e){
        setPassword(e.target.value);
    }
    function updateNewPassword(e){
        setNewPassword(e.target.value);
    }


    function handleSubmit(e){
        e.preventDefault();
        if(authentication.auth(user.id)){
            authentication.changePassword(password, newPassword, user.id).then(r =>{
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
            <legend>Change Password</legend>
            <Form.Group>
                <Form.Label>New Password:</Form.Label>
                <Form.Control type="password" onChange={updateNewPassword}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Old Password:</Form.Label>
                <Form.Control type="password"  onChange={updatePassword}/>
            </Form.Group>
            <div className="text-center">
                <Button variant="primary" type={"submit"} >
                    Save
                </Button>
            </div>
        </Form>
    )
}
export default ChangePassword;