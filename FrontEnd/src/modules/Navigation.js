import React, {useState, useContext} from 'react';
import '../styles/Navigation.css';
import { Container, Navbar, Nav, NavItem} from 'react-bootstrap';
import Login from "./login";
import Logout from "./logout";
import Register from "./register";
import authentication from "../services/authentication";
import UserData from "../services/UserContext";

const Navigation = (props) => {
    const {user, setUser} = useContext(UserData);
    console.log(user);
    return (
        <Container>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/home">Stream+</Navbar.Brand>
            <Navbar.Collapse>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/emotes">Emotes</Nav.Link>
                {user.id &&<Nav.Link href="/account">Account</Nav.Link>}
            </Nav>
                <Nav>
                    {user.length == 0 &&<Login/>}
                    {user.length == 0 &&<Register/>}
                    {user.length != 0 &&(
                        <Navbar.Text>
                            Signed in as: <a href={"/account"}>{user.username}</a> &emsp;
                        </Navbar.Text>)}
                    {user.length != 0 && <Nav.Item><Logout/></Nav.Item>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        </Container>
    )
}
export default Navigation;