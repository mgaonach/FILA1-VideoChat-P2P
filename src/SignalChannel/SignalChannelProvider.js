import React, { createContext, Component } from 'react';
import io from 'socket.io-client';
const SERVER_LOCATION = 'http://172.17.3.116:2019/';

export const SignalChannelContext = createContext({
    user: {
        name: "",
        sdp: ""
    },
    peer: {},
    joinRoom: () => { },
    leaveRoom: () => { },
    setUsername: () => {}
});

class SignalChannelProvider extends Component {
    socket = null;

    state = {
        user: {
            name: "",
            sdp: ""
        },
        peer: {},
        room : '',

        /**
         * Allows to set the local user's Session Description Protocol (SDP).
         * It will be sent to peers to make communication possible
         * @param sdp the 
         */
        setSdp: (sdp) => {
            return new Promise((resolve, reject) => {
                if ( sdp == null ) {
                    reject("Bad parameter");
                }

                this.socket.emit('set sdp', sdp, (response) => {
                    if (response.error) {
                        reject();
                    }
                    
                    this.setState({
                        user: {
                            sdp: sdp
                        }
                    });
                    resolve();
                });
            });
        },

        /**
         * Allows to request for a username change
         * @param username The new username
         */
        setUsername: (username) => {
            return new Promise((resolve, reject) => {
                if ( username == null || username === "" ){
                    reject("Bad parameter");
                }

                this.socket.emit('set username', username, (response) => {
                    if (response.error) 
                        reject();
                    
                    this.setState({
                        user: {
                            name: username
                        }
                    });
                    resolve();
                });
            });
        },

        /**
         * Allows to request joining a room
         * @param room The name of the room to join
         */
        joinRoom: (room) => { 
            return new Promise((resolve, reject) => {
                if ( room == null || room === "" ){
                    reject("Bad parameter");
                }

                this.socket.emit('join room', room, (response) => {
                    if (response.error) {
                        reject();
                    }
                    
                    this.setState({
                        room: room
                    });
                    resolve();
                });
            });
        },

        /**
         * Allows to request to leave a room
         */
        leaveRoom: () => {
            return new Promise((resolve, reject) => {
                this.socket.emit('leave room', (response) => {
                    if (response.error) {
                        reject();
                    }
                    
                    this.setState({
                        peer: {},
                        room: ''
                    });
                    resolve();
                });
            });
        }
    }

    componentWillMount(){
        console.log("socket.io connection here");
        this.socket = io(SERVER_LOCATION);

        this.socket.on('username set', function(previousName, newName) {
            this.setState((state) => {
                if (state.peer == null) {
                    return {
                        peer: {
                            name: newName
                        }
                    };
                } else {
                    return {
                        peer: {
                            name: newName,
                            sdp: state.peer.sdp
                        }
                    };
                }
            });
        });

        this.socket.on('peer left', function() {
            this.setState({
                peer: {}
            });
        });

        this.socket.on('offer recieved', function(sdp, username) {
            this.setState({
                peer: {
                    name: username,
                    sdp: sdp
                }
            });
        })
    }

    render() {
        return (
            <SignalChannelContext.Provider value={this.state}>
                {this.props.children}
            </SignalChannelContext.Provider>
        );
    }
}

/**
 * Turns a component into a SignalChannelContext.Consumer
 * @param {*} Component Le composant qui utilisera ce contexte
 * @return le composant après ajout du contenu contexte dans la liste de ses props
 */
export const withSignalChannel = Component => props => (
    <SignalChannelContext.Consumer>
        {signalChannel => <Component {...props} {...signalChannel} />}
    </SignalChannelContext.Consumer>
);

export default SignalChannelProvider;
