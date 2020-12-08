import React, {useState, useRef, useCallback} from 'react';
import logo from '../logo.svg';
import '../App.css';
import useEmoteSearch from "./useEmoteSearch";
import {
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    Grid
} from 'react-virtualized';
import {Button, Form, Modal, Row, Col} from "react-bootstrap";
import authentication from "../services/authentication";


export default function EmoteSearch(props) {
    // eslint-disable-next-line no-unused-vars
    const query = props.searchQuery

    // eslint-disable-next-line no-unused-vars
    let pageNumber = props.page
    const searchURL = "http://127.0.0.1:8000/emotes/"
    const cache = useRef(new CellMeasurerCache({
        fixedWidth: true,
        fixedHeight: true,
    }))
    const {
        emoteCount,
        emotes,
        hasMore,
        loading,
        error
    } = useEmoteSearch(query, searchURL, pageNumber * 25)

    const observer = useRef()
    const lastEmoteElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                pageNumber++;
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const [usingEmotes, setUsingEmotes] = useState({});

    //toggling the add emote modal
    const [showModal, toggleModal] = useState(false);
    const [selectedEmote, changeSelection] = useState({});
    const [uploader, setUploader] = useState({});
    const [user, setUser] = useState(()=>{
        let userdata = JSON.parse(localStorage.getItem("user"));
        if(userdata == null) return;
        return authentication.getUser(userdata["id"]).then(r =>{
            setUser(r);
        });
    });

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
                return authentication.auth(userdata["id"]).then(ret =>{
                    authentication.addEmoteLink(selectedEmote).then(r=>{
                        window.location.reload(false);
                    });
                    setUser(ret);
                    handleClose();
                });
            }else{
                return authentication.auth(userdata["id"]).then(ret =>{
                    authentication.removeEmoteLink(selectedEmote).then(r =>{
                        window.location.reload(false);
                    });
                    setUser(ret);
                    handleClose();
                });
            }
        }

    }


    return (
        <div>
            {/*Modal for adding emotes to account*/}
            <Modal size="sm" show={showModal} onHide={ handleClose}>
                <Modal.Header>
                    Add/Remove Emote
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col sm={{span: 10, offset:4}}>
                        <img className={"emote"} src={"http://127.0.0.1:8000" + selectedEmote.emoteURL} alt={selectedEmote.emoteName} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={{span:10, offset:0}}>
                                <p>Emote: {selectedEmote.emoteName}</p>
                            </Col>
                        </Row>
                        {selectedEmote.description != null && <Row>
                            <Col sm={{span:12, offset:0}}>
                                <p>Description: {selectedEmote.description}</p>
                            </Col>
                        </Row>}
                        <Row>
                            <Col sm={{span:10, offset:0}}>
                                <p>Uploaded By: {uploader.username}</p>
                            </Col>
                        </Row>
                    </Modal.Body>
                    {user != null &&<Modal.Footer>
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
            <div style={{width: "100%", height: "85vh"}}>
                <AutoSizer>
                    {({width, height}) => (
                        <>
                            <Grid
                                style={{backgroundColor:"#727275"}}
                                width={width}
                                height={height}
                                columnWidth={130}
                                maxWidth={800}
                                columnCount={8}
                                rowHeight={148}
                                deferredMeasurementCache={cache.current}
                                rowCount={Math.ceil(emotes.length / 8)}
                                cellRenderer={({key, rowIndex, columnIndex, style, parent}) => {
                                    let currIndex = (rowIndex + 1) * 8 - 8 + columnIndex
                                    const emote = emotes[currIndex];

                                    if(emote != null && currIndex < emoteCount){
                                    if (emotes.length === rowIndex*columnIndex + 1) {
                                        return (<CellMeasurer key={key} cache={cache.current} parent={parent}
                                                              columnIndex={columnIndex} rowIndex={rowIndex}>
                                            <div style={style} ref={lastEmoteElementRef}>
                                                <div className={"emoteHolder"} onClick={emoteClicked(emote)}>
                                            <div className={"emoteImgHolder"}>
                                                <img className={"emote"} src={"http://127.0.0.1:8000" + emote.emoteURL} alt={emote.emoteName}/>
                                            </div>
                                            <p className={"emoteText"} title={emote.description}>{emote.emoteName}</p>
                                            </div>
                                            </div>
                                        </CellMeasurer>)
                                    } else {
                                        return (<CellMeasurer key={key} cache={cache.current} parent={parent}
                                                              columnIndex={columnIndex} rowIndex={rowIndex}>
                                            <div style={style}>
                                                <div className={"emoteHolder"} onClick={() => emoteClicked(emote)}>
                                                    <div className={"emoteImgHolder"}>
                                                        <img className={"emote"} src={"http://127.0.0.1:8000" + emote.emoteURL} alt={emote.emoteName}/>
                                                    </div>
                                                    <p className={"emoteText"} title={emote.description}>{emote.emoteName}</p>
                                            </div>
                                            </div>
                                        </CellMeasurer>)
                                    }
                                    }
                                }}/>
                            <div>{loading && 'Loading...'}</div>
                            <div>{error && 'error'}</div>
                        </>
                    )}
                </AutoSizer>
            </div>
            {!hasMore && emotes.length > 0 &&
            <div>You've seen it all.</div>}
        </div>

    )

}
