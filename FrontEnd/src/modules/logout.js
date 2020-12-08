import React, {useState} from 'react';
import '../styles/Navigation.css';
import { Container, Form, Button, Modal, Toast, Col, Row} from 'react-bootstrap';
import authentication from "../services/authentication";


const Logout = (props) => {

    function logout(){
        authentication.logout().finally(r=>{
            window.location.reload();
        })
    }

    return (
        <>
            <Button variant="primary" onClick={logout}>
                Logout
            </Button>
        </>
    )
}
export default Logout;