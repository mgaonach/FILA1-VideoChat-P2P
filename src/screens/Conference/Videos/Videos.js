import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';

import { withSignalChannel } from '../../../context/SignalChannel/SignalChannelProvider';

import './Videos.css';

class Videos extends Component {

    render() {
        return (
            <div>Vidéos</div>
        );
    }
}

Videos = withSignalChannel(Videos);

export default Videos;
