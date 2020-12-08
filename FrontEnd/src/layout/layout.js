import React, {useState} from 'react';
import { Row, Container } from 'react-bootstrap';
import Navigation from '../modules/Navigation';
import authentication from "../services/authentication";
const Layout = (props) => {
    const [user, setUser] = useState(()=>{
        let userdata = JSON.parse(localStorage.getItem("user"));
        if(userdata == null) return;
        return authentication.getUser(userdata["id"]).then(r =>{
            setUser(r);
        });
    });
    return (
        <Container>
            <Row>
                <Navigation user={user}/>
            </Row>
            <main>
                {props.children}
            </main>
        </Container>
    )
}
export default Layout