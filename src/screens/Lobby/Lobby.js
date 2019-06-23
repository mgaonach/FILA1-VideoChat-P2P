import React, { Component } from "react";

import { withSignalChannel } from '../../SignalChannelProvider';
import { withRouter } from 'react-router-dom';

import { Card, Row, Col, Button, Form } from 'react-bootstrap';

import './Lobby.css';

class Lobby extends Component {
    state = {
        room : ""
    }

    componentDidMount(){
        this.roomInput.focus();
    }

    handleRoomChange = (e) => {
        this.setState({ room: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.joinRoom(this.state.room).then(() => {
            this.props.history.push('/conference');
        }).catch(() => {
            this.props.pushNotification("Impossible de rejoindre ce salon pour le moment.", "danger");
        });
    }

    render() {
        return (
            <Card className="screen">
                <Row>
                    <Col className="greetings">
                        <Card.Body className="greetings-text">Bonjour <b>{ this.props.user.name }</b> !</Card.Body>
                    </Col>
                    <Col className="room-form">
                        <Card.Body>
                            <Card.Title>Choisissez un salon pour démarrer une conférence</Card.Title>

                            <Form onSubmit={ this.handleSubmit }>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control 
                                        type="text" 
                                        onChange={ this.handleRoomChange } 
                                        value={ this.state.room } 
                                        placeholder="Saissez un nom de salon" 
                                        ref={(input) => { this.roomInput = input; }} 
                                    />
                                </Form.Group>
                            </Form>

                            <Button onClick={ this.handleSubmit }>Rejoindre</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        );
    }
}

Lobby = withRouter(Lobby);
Lobby = withSignalChannel(Lobby);

export default Lobby;

