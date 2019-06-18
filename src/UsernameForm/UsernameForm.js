import React, { Component } from "react"

import { withSignalChannel } from '../SignalChannel/SignalChannelProvider'

class UsernameForm extends Component {

    state = {
        username : ''
    }

    constructor(){
        super();

        this.setState((state, props) => {
            return {
                username: ""
            };
        });
    }

    handleUsernameChange = (e) => {
        this.setState({ username: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.setUsername(this.state.username);
    }

    render() {
        return (
            <form onSubmit= { this.handleSubmit }>
                <input type="text" onChange={ this.handleUsernameChange } value={ this.state.username } />
            </form>
        );
    }
}

export default withSignalChannel(UsernameForm);

