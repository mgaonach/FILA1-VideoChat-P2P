import React from 'react';
import { Card, Row, Col } from 'react-bootstrap'
import './Error.css'

const errors = {
    "404": 'La page recherchée n\'existe pas ou plus.',
    "520": 'Une erreur inconnue est survenue.'
}

function Error(props) {
    let code = props.code;
    let error = errors[code];

    if (error === undefined) {
        code = "520";
        error = errors[code];
    }

    return (
        <Card className="screen">
            <Row>
                <Col className="code" xs={2}>
                    <Card.Body className="code-text">{code}</Card.Body>
                </Col>
                <Col>
                    <Card.Body className="message">
                        <Card.Title>{error}</Card.Title>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}

export default Error;