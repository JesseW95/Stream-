import React, {useCallback, useRef, useState, useEffect, useContext} from 'react';
import {Row, Container, Col, Card, InputGroup, FormControl, Modal, Form, Button} from 'react-bootstrap';
import EmoteSearch from '../modules/EmoteSearch';
import authentication from "../services/authentication";
import {AutoSizer, CellMeasurer, CellMeasurerCache, Grid} from "react-virtualized";
import Loader from 'react-loader-spinner'
import UserData from "../services/UserContext";

const UserEmoteList = (props) => {

    const cache = useRef(new CellMeasurerCache({
        fixedWidth: true,
        fixedHeight: true,
    }))
    //user context
    const {user, setUser} = useContext(UserData);

    //get emotes using user id
    const [emotes, setEmotes] = useState({});
    useEffect(()=>{
       authentication.getEmote(user.id).then(r=>{
           setEmotes(r);
           console.log(r);
       });
    }, [user]);

    //toggling the add emote modal
    const [showModal, toggleModal] = useState(false);
    const [selectedEmote, changeSelection] = useState({});
    const [uploader, setUploader] = useState({});
    const [addEmote, toggleAdd] = useState(true); //controls whether we add or remove emote link.
    const handleClose = () => toggleModal(false);
    const handleShow = () => {
        toggleModal(true);
    }

    const emoteClicked = (emote) =>{
        changeSelection(emote);
        authentication.getUser(emote.uploader).then(r =>{
            setUploader(r);
        });
        let userdata = JSON.parse(localStorage.getItem("user"));
        if(userdata != null) {

            let tmpCmp = user.usingEmotes.filter(em => (em.emote == emote.emoteName));
            if (tmpCmp.length > 0) {
                toggleAdd(false);
            } else {
                toggleAdd(true)
            }
        }
        handleShow();
    }

    function handleSubmit(e){
        e.preventDefault();
        if(authentication.auth()){
            let userdata = JSON.parse(localStorage.getItem("user"));
            if(addEmote){
                if(userdata == null) return;
                return authentication.auth(userdata["id"]).then(r =>{
                    authentication.addEmoteLink(selectedEmote);
                    setUser(r);
                    handleClose();
                });
            }else{

                return authentication.auth(userdata["id"]).then(ret =>{
                    authentication.removeEmoteLink(selectedEmote).then(r =>{
                        setUser(ret);
                        setEmotes(r);
                    });
                    handleClose();
                });
            }
        }

    }


    if(user.usingEmotes == null){
        return(<Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
        />)}
    else
        return(
            <div>
                {/*Modal for adding emotes to account*/}
                <Modal size="sm" show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        Add/Remove Emote
                    </Modal.Header>

                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col sm={{span: 10, offset: 4}}>
                                    <img className={"emote"} src={"http://127.0.0.1:8000" + selectedEmote.emoteURL}
                                         alt={selectedEmote.emoteName}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={{span: 10, offset: 0}}>
                                    <p>Emote: {selectedEmote.emoteName}</p>
                                </Col>
                            </Row>
                            {selectedEmote.description != null && <Row>
                                <Col sm={{span: 12, offset: 0}}>
                                    <p>Description: {selectedEmote.description}</p>
                                </Col>
                            </Row>}
                            <Row>
                                <Col sm={{span: 10, offset: 0}}>
                                    <p>Uploaded By: {uploader.username}</p>
                                </Col>
                            </Row>
                        </Modal.Body>
                        {<Modal.Footer>
                            <Button variant="primary" type={"submit"}>
                                {addEmote && "Add"}
                                {!addEmote && "Remove"}
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>}

                    </Form>
                </Modal>

                {/*Modal for adding emotes to account*/}


                {/*Display list of emojis in a virtualized grid.*/}
                <div style={{width: "100%", height: "50vh"}}>
                    <AutoSizer>
                        {({width, height}) => (
                                <Grid
                                    style={{backgroundColor: "#727275"}}
                                    width={width}
                                    height={height}
                                    columnWidth={136}
                                    maxWidth={400}
                                    columnCount={6}
                                    rowHeight={148}
                                    rowCount={6}
                                    cellRenderer={({key, rowIndex, columnIndex, style, parent}) => {
                                        let currIndex = (rowIndex + 1) * 6 - 6 + columnIndex
                                        const emoteData = emotes[currIndex];
                                        if (emoteData != null && currIndex < emotes.length) {
                                            return (
                                                <div style={style}>
                                                    <div className={"emoteHolder"} onClick={() => emoteClicked(emoteData)}>
                                                        <div className={"emoteImgHolder"}>
                                                            <img className={"emote"}
                                                                 src={"http://127.0.0.1:8000" + emoteData.emoteURL}
                                                                 alt={emoteData.description}/>
                                                        </div>
                                                        <p className={"emoteText"}
                                                           title={emoteData.description}>{emoteData.emoteName}</p>
                                                    </div>
                                                </div>)
                                        }
                                    }}/>
                        )}
                    </AutoSizer>
                </div>
            </div>

        )
}
export default UserEmoteList;