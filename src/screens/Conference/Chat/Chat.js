import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';

import { withSignalChannel } from '../../../context/SignalChannel/SignalChannelProvider';

import './Chat.css';

class Chat extends Component {

    render() {
        return (
            <div>Chat</div>
        );
    }
}

Chat = withSignalChannel(Chat);

export default Chat;
