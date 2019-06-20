import React, { createContext, Component } from 'react';
import io from 'socket.io-client';
//const SERVER_LOCATION = 'http://localhost:2019/';
const SERVER_LOCATION = 'http://192.168.0.12:2019/';

export const SignalChannelContext = createContext({
    user: {
        name: "",
        sdp: {}
    },
    peer: {
        name: "",
        sdp: {}
    },
    room: '',
    connectionEstablished: false,
    setSdp: () => { },
    joinRoom: () => { },
    leaveRoom: () => { },
    setUsername: () => {},
    waitForSignal: () => {}
});

class SignalChannelProvider extends Component {
    socket = null;

    state = {
        user: {
            name: "",
            sdp: ""
        },
        peer: {
            name: "",
            sdp: {}
        },
        room : '',
        connectionEstablished: false,

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
                } else {
                    this.socket.emit('set username', username, (response) => {
                        this.setState({
                            user: {
                                name: username
                            }
                        });
                        resolve();
                    });
                }
                
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
                } else {
                    this.waitForSignal();
                    this.socket.emit('join room', room, (response) => {
                        this.setState({
                            room: room,
                            connectionEstablished: true
                        });
                        resolve();
                    });
                }
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

    /**
     * Permet d'indiquer que l'application en attente du signal channel
     */
    waitForSignal = () => {
        this.setState({
            connectionEstablished: false
        });
    }

    /**
     * Permet de définir les réactions aux messages reçus depuis le serveur
     */
    componentWillMount(){
        this.socket = io(SERVER_LOCATION);

        this.socket.on('connection established', (defaultUsername) => {
            console.log("Connexion établie avec le serveur en tant que " + defaultUsername);

            this.setState({
                user: {
                    name: defaultUsername,
                    sdp: {}
                },
                connectionEstablished: true
            });
        });

        /**
         * Action si le peer change de nom d'utilisateur
         */
        this.socket.on('username set', (previousName, newName) => {
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

        /**
         * Action si le peer quitte le salon
         */
        this.socket.on('peer left', () => {
            this.setState({
                peer: {}
            });
        });

        /**
         * Action si le peer rejoint un salon
         */
        this.socket.on('offer recieved', (sdp, username) => {
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
 * Transforme un composant en SignalChannelContext.Consumer
 * @param {*} Component Le composant qui utilisera ce contexte
 * @return le composant après ajout du contenu contexte dans la liste de ses props
 */
export const withSignalChannel = Component => props => (
    <SignalChannelContext.Consumer>
        {signalChannel => <Component {...props} {...signalChannel} />}
    </SignalChannelContext.Consumer>
);

export default SignalChannelProvider;
