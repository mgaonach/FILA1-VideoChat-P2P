import React, { Component } from "react"

import { withSignalChannel } from '../../SignalChannel/SignalChannelProvider'

class Home extends Component {

    render() {
        return (
            <div>
                Hello, { this.props.user.name } !
            </div>
        );
    }
}

export default withSignalChannel(Home);
