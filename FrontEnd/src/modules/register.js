import React, {useContext, useState} from 'react';
import '../styles/Navigation.css';
import { Container, Form, Button, Modal, Nav, Toast} from 'react-bootstrap';
import authentication from "../services/authentication";
import UserData from "../services/UserContext";
import {toast, ToastContainer} from "react-toastify";


const Register = (props) => {
    const [showRegister, toggleRegister] = useState(false);
    const handleClose = () => toggleRegister(false);
    const handleShow = () => toggleRegister(true);

    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const {user, setUser} = useContext(UserData);


    function updateUser(e){
        setUserName(e.target.value);
    }
    function updatePassword(e){
        setPassword(e.target.value);
    }
    function updateEmail(e){
        setEmail(e.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        authentication.register(username, email, password).then(r => {
            handleClose();
            console.log(r);
            if(r.id){
                authentication.login(username, password);
                window.location.reload();

            }else{
                toast.error(r.message, {containerId: 'A', autoClose:1500});
            }

        });

    }

    return (
        <Nav>
            <ToastContainer enableMultiContainer containerId={'A'} position={toast.POSITION.TOP_CENTER} />
            <Button variant="primary" onClick={handleShow}>
                Register
            </Button>
        <Modal size="md" show={showRegister} onHide={ handleClose}>
            <Modal.Header>
                Create an Account
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control placeholder="Enter email" onChange={updateEmail}/>
                    </Form.Group>

                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Enter username" onChange={updateUser}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={updatePassword}/>
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
export default Register;