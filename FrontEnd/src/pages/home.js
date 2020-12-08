import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import '../styles/Home.css';
const home = (props) => {
    return (
        <Row>
            <Col md={12}>
                <div className={'homeText'}>
                    <h1>Streaming+</h1>
                    <Button variant="secondary">Get the Extension</Button>
                </div>
            </Col>
        </Row>
    )
}
export default home;