import React, { Component } from "react"
import { Modal, Button, Form } from 'react-bootstrap'

import { withSignalChannel } from '../context/SignalChannel/SignalChannelProvider'

class SettingsModal extends Component {
    constructor(){
        super();

        this.state = {
            username : ""
        }
    }

    componentDidMount(){
        this.setState((state, props) => {
            return {username: props.user.name};
        });

        this.usernameInput.focus();
    }

    handleUsernameChange = (e) => {
        this.setState({ username: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.setUsername(this.state.username).then(() => {
            this.props.onHide();
        }).catch(() => {
        });
    }

    render() {
        return (
            <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Paramètres
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={ this.handleSubmit }>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Nom d'utilisateur</Form.Label>
                            <Form.Control 
                                type="text" 
                                onChange={ this.handleUsernameChange } 
                                value={ this.state.username } 
                                placeholder="Saissez un nom d'utilisateur" 
                                ref={(input) => { this.usernameInput = input; }} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={ this.handleSubmit }>Valider</Button>
                <Button onClick={ this.props.onHide }>Fermer</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default withSignalChannel(SettingsModal);

