import React, { Component } from "react";
import {  } from 'react-bootstrap';

import { withSignalChannel } from '../../../context/SignalChannel/SignalChannelProvider';

import './Videos.css';

class Videos extends Component {

    render() {
        return (
            <div className="videos">
                <video>
                    <source src="../../../placeholder.mp4" type="" />
                </video>
            </div>
        );
    }
}

Videos = withSignalChannel(Videos);

export default Videos;
