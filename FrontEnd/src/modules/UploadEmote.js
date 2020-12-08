import React, {useContext, useState, useEffect} from 'react';
import '../styles/Navigation.css';
import { Container, Form, Button, Modal, Nav} from 'react-bootstrap';
import authentication from "../services/authentication";
import UserData from "../services/UserContext";
import {useDropzone} from 'react-dropzone';

const UploadEmote = (props) => {
    //settings for file drop
    const [files, setFiles] = useState([]);
    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/jpeg, image/png, .jpeg, .png, .gif',
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumb = {
        display: 'inline-flex',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                />
            </div>
        </div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const {user, setUser} = useContext(UserData);

    const [showUpload, toggleUpload] = useState(false);
    const handleClose = () => {
        toggleUpload(false);
        setFiles([]);
        setDescription("");
        setEmoteName("");
    }
    const handleShow = () => toggleUpload(true);

    const [emoteName, setEmoteName] = useState("");
    const [emoteDescription, setDescription] = useState("");

    //for toast
    const [show, setShow] = useState(false);

    function updateEmoteName(e){
        setEmoteName(e.target.value);
    }
    function updateDescription(e){
        setDescription(e.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        console.log(files[0]);

        if(authentication.auth(user.id)){
            authentication.uploadEmote(user.id, files[0] ,e.target[0].value, e.target[1].value);
        }

    }

    return (
        <Nav>
            <Button variant="primary" onClick={handleShow}>
                Add Emote
            </Button>
            <Modal size="md" show={showUpload} onHide={ handleClose}>
                <Modal.Header>
                    Upload Emote
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Emote Name:</Form.Label>
                            <Form.Control placeholder="emote name" value={emoteName} onChange={updateEmoteName} required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Emote Description:</Form.Label>
                            <Form.Control placeholder="emote description" value={emoteDescription} onChange={updateDescription}/>
                        </Form.Group>
                        <Form.Group >
                            <section className="container">
                                <div {...getRootProps({className: 'fileDrop text-center'})}>
                                    <input {...getInputProps()} required/>
                                    <p>Drag and drop image here, or click to select an image.</p>
                                    {thumbs}
                                </div>
                            </section>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type={"submit"}>
                            Submit
                        </Button>
                        <Button variant="secondary" type={"button"} onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>

                </Form>
            </Modal>
        </Nav>
    )
}
export default UploadEmote;