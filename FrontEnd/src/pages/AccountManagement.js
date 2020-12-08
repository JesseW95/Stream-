import React, {useContext} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {Col, Row, ButtonGroup, Button} from "react-bootstrap"
import UserEmoteList from "../modules/userEmoteList";
import ChangeEmail from "../modules/ChangeEmail";
import ChangePassword from "../modules/ChangePassword";
import UserData from "../services/UserContext";
import Loader from "react-loader-spinner";
const AccountPage = (props) => {
    //user context
    const {user, setUser} = useContext(UserData);

    if(user.id) {
        return (
            <>
                <br/>
                <Tabs>
                    <Row>
                        <Col sm={3}>
                            <TabList>
                                <ButtonGroup vertical>
                                    <Tab>
                                        <Button variant="info">Manage Account</Button>
                                    </Tab>
                                    <Tab>
                                        <Button variant="info">Manage Emotes</Button>
                                    </Tab>
                                    <Tab>
                                        <Button variant="info">Link/Unlink Platforms</Button>
                                    </Tab>
                                </ButtonGroup>
                            </TabList>
                        </Col>

                        <Col sm={9}>
                            <TabPanel>
                                <div>
                                    <Row>
                                        <Col sm={{span: 5, offset: 0}}><ChangeEmail/></Col>
                                        <Col sm={{span: 5, offset: 1}}><ChangePassword/></Col>
                                    </Row>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <UserEmoteList/>
                            </TabPanel>
                            <TabPanel>
                                <h2>Not Implemented</h2>
                            </TabPanel>
                        </Col>
                    </Row>
                </Tabs>
            </>
        );
    }else{
        return(
            <div className="text-center">
                <br/>
                <br/>
                <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}/>
            </div>)}
}
export default AccountPage;