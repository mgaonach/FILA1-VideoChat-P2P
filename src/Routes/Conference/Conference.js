import React, { Component } from "react"
import VideoConference from '../../VideoConference'

import { withSignalChannel } from '../../SignalChannel/SignalChannelProvider'

class Conference extends Component {

    componentWillMount(){
        this.props.joinRoom('Accueil');
    }

    render() {
        return (
            <React.Fragment>
                <VideoConference />
            </React.Fragment>
        );
    }
}

export default withSignalChannel(Conference);

