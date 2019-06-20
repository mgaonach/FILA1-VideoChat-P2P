import React, { Component } from "react";
import { Card, Form, Button } from 'react-bootstrap';

import { withSignalChannel } from '../../../context/SignalChannel/SignalChannelProvider';

import './Chat.css';

class Chat extends Component {
    state = {
        messageInput : '',
        messages : [
            {text: 'Aloha ! :D', peer: true},
            {text: 'Ahoy !'},
        ]
    }

    renderPeerName(){
        const peerName = this.props.peer.name;
        if ( peerName == null || peerName === '' ) {
            return 'En attente de pair...';
        }

        return 'avec ' + peerName;
    }

    renderMessages(){
        const messages = [];
        for(let i = 0, len = this.state.messages.length; i < len ; i++) {
            const message = this.state.messages[i];

            if ( message.peer ) {
                messages.push(<li key={message.text + Math.random().toString()} className="peer">{message.text}</li>)
            } else {
                messages.push(<li key={message.text + Math.random().toString()}>{message.text}</li>)
            }
        }

        return messages;
    }

    isChatEnabled(){
        const peerName = this.props.peer.name;
        if ( peerName == null || peerName === '' ) {
            return false;
        }
        
        return true;
    }

    handleChange = (e) => {
        this.setState({
            messageInput: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render() {
        return (
            <div className="chat">
                <Card.Header as="h4" className="chat-header effect6">{ this.renderPeerName() }</Card.Header>
                <ul className="chat-messages">
                    { this.renderMessages() }
                    <br />
                    &nbsp;
                </ul>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Control 
                        className="chat-input" 
                        type="text" 
                        placeholder="Votre message ..." 
                        disabled={ !this.isChatEnabled() } 
                        value={this.state.messageInput}
                        onChange={this.handleChange}
                        />
                    <Button className="chat-btn" variant="dark" type="submit">
                        <i className="fa fa-paper-plane"></i>
                    </Button>
                </Form>
            </div>
        );
    }
}

Chat = withSignalChannel(Chat);

export default Chat;
