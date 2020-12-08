import React, {useContext, useState} from 'react';
import '../styles/Navigation.css';
import { Container, Form, Button, Modal, Nav} from 'react-bootstrap';
import authentication from "../services/authentication";
import {toast, ToastContainer} from "react-toastify";
import UserData from "../services/UserContext";


const Login = (props) => {
    const {user, setUser} = useContext(UserData);
    const [showLogin, toggleLogin] = useState(false);
    const handleClose = () => toggleLogin(false);
    const handleShow = () => toggleLogin(true);

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    //for toast
    const [show, setShow] = useState(false);

    function updateUser(e){
        setUserName(e.target.value);
    }
    function updatePassword(e){
        setPassword(e.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        authentication.login(username, password).then(r => {
            if(r.success === false){
                toast.error(r.message, {containerId: 'A', autoClose:1500});
            }else{
                window.location.reload();
            }

        });

    }

    return (
        <Nav>
            <ToastContainer enableMultiContainer containerId={'A'} position={toast.POSITION.TOP_CENTER} />

            <Button variant="primary" onClick={handleShow}>
                Login
            </Button>
        <Modal size="md" show={showLogin} onHide={ handleClose}>
            <Modal.Header>
                Login
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Enter username" onChange={updateUser}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={updatePassword}/>
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Stay Logged In" />
                </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type={"submit"}>
                    Submit
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>

            </Form>
        </Modal>
            </Nav>
    )
}
export default Login;