import React, { Component } from "react"
import { Link } from 'react-router-dom'

import './Home.css'

import { Card, /*Row,*/ Col } from 'react-bootstrap'

import { withSignalChannel } from '../../SignalChannel/SignalChannelProvider'

class Home extends Component {

    handleSubmit = (e) => {
        e.preventDefault();

        
    }

    render() {
        return (
            <React.Fragment>
                <Col className="greetings">
                    <Card.Body className="greetings-text">Bonjour <b>{ this.props.user.name }</b> !</Card.Body>
                </Col>
                <Col className="room-form">
                    <Card.Body>
                        <Card.Title>Choisissez un salon pour démarrer une conférence !</Card.Title>
                        <Link to="/conference">Conférence de test</Link>
                    </Card.Body>
                </Col>
            </React.Fragment>
        );
    }
}

export default withSignalChannel(Home);

