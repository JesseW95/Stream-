import React, {useContext, useState} from 'react';
import { Row, Container, Col, Card, InputGroup, FormControl} from 'react-bootstrap';
import EmoteSearch from '../modules/EmoteSearch';
import UserEmoteList from '../modules/userEmoteList';
import authentication from "../services/authentication";
import UserData from "../services/UserContext";
import UploadEmote from "../modules/UploadEmote";
const AddEmotes = (props) => {
    const [query, setQuery] = useState("")
    const [pageNumber, setPageNumber] = useState(0)
    function handleSearch(e) {
        setQuery(e.target.value)
        setPageNumber(0)
    }
    //user context
    const {user, setUser} = useContext(UserData);


        return (
            <Container>
                    <br/>
                <Row>


                        <Col sm={{span: 6, offset:0}}>
                        <InputGroup className="mb-3" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Search:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={handleSearch}
                                value={query}
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                        </Col>
                    {user.id && <Col sm={{span: 2}}>
                        <UploadEmote/>
                    </Col>}
                        <Col sm={{span: 12, offset:0}}>
                <EmoteSearch searchQuery={query} page={pageNumber}/>
                        </Col>
                </Row>
            </Container>
        );
}
export default AddEmotes;