import React, { Component } from "react"
import VideoConference from '../../VideoConference'

import { withSignalChannel } from '../../SignalChannel/SignalChannelProvider'

class Conference extends Component {

    componentWillMount(){
        this.props.joinRoom('Accueil');
    }

    render() {
        return (
            <div>
                <h1>Conference</h1>
                <VideoConference />
            </div>
        );
    }
}

export default withSignalChannel(Conference);

