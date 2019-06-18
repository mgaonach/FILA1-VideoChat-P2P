import React, { Component } from "react"
import { Link } from 'react-router-dom'


import { withSignalChannel } from '../../SignalChannel/SignalChannelProvider'

class Home extends Component {

    render() {
        return (
            <div>
                <h1>Hello, { this.props.user.name } !</h1>
                
                <Link to="/conference">Démarrer une conférence</Link>
            </div>
        );
    }
}

export default withSignalChannel(Home);
