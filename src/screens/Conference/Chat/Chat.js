import React, { Component } from "react";
import { Card, Form, Button } from 'react-bootstrap';

import { withSignalChannel } from '../../../SignalChannelProvider';

import './Chat.css';

class Chat extends Component {
    state = {
        messageInput : ''
    }

    constructor(){
        super();

        this.messagesView = React.createRef();
    }

    componentDidMount(){
        this.props.setSdp({});
    }

    renderPeerName(){
        /*const peerName = this.props.peer.name;
        if ( peerName == null || peerName === '' ) {
            return 'En attente de pair...';
        }*/

        return this.props.room;
    }

    renderMessages(){
        const messages = [];
        for(let i = 0, len = this.props.messages.length; i < len ; i++) {
            const message = this.props.messages[i];

            if ( message.peer ) {
                messages.push(<li key={message.text + Math.random().toString()} className="peer">{message.text}</li>)
            } else {
                messages.push(<li key={message.text + Math.random().toString()}>{message.text}</li>)
            }
        }

        return messages;
    }

    isChatEnabled(){ // TODO
        /*const peerName = this.props.peer.name;
        if ( peerName == null || peerName === '' ) {
            return false;
        }*/
        
        return true;
    }

    handleChange = (e) => {
        this.setState({
            messageInput: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if ( this.state.messageInput.split(' ').join('') !== "" ) {
            this.props.sendMessage(this.state.messageInput);

            if ( this.interval != null ) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this.interval = setInterval(() => {
                this.messagesView.current.scrollTop = this.messagesView.current.scrollHeight;
            }, 100);
        }

        this.setState({
            messageInput: ''
        });
    }

    render() {
        return (
            <div className="chat">
                <Card.Header as="h4" className="chat-header effect6">{ this.renderPeerName() }</Card.Header>
                <ul className="chat-messages" ref={ this.messagesView }>
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
