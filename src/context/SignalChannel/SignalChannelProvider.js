import React, { createContext, Component } from 'react';
import io from 'socket.io-client';
import config from '../../config.json';
const SERVER_LOCATION = 'http://' + config['signal-channel'].host + ':' + config['signal-channel'].port + '/'

export const SignalChannelContext = createContext({
    user: {
        name: "",
        sdp: null
    },
    peer: {
        name: "",
        sdp: null
    },
    room: "",
    connectionEstablished: false,
    initiator: false,
    receiverCallback : () => {},
    setReceiverCallback : () => {},
    sendOffer: () => { },
    sendANswer: () => { },
    setSdp: () => { },
    joinRoom: () => { },
    leaveRoom: () => { },
    setUsername: () => { },
    waitForSignal: () => { }
});

class SignalChannelProvider extends Component {
    socket = null;

    state = {
        user: {
            name: "",
            sdp: null
        },
        peer: {
            name: "",
            sdp: null
        },
        room: "",
        connectionEstablished: false,
        initiator: false,
        receiverCallback : () => {},
        setReceiverCallback : (callback) => {
            this.setState({receiverCallback: callback});
        },
        sendOffer: (offer) => {
            return new Promise((resolve, reject) => {
                if (offer == null) {
                    reject("Bad parameter");
                }

                this.socket.emit('send offer', offer, (response) => {
                    if (response.error != null) {
                        alert('no offer, sorry');
                        reject();
                    } else {
                        this.setState(state => {
                            return {
                                user: Object.assign({}, state.user, {
                                    sdp: offer
                                })
                            };
                        });
                        resolve();
                    }
                });
            });
        },
        sendAnswer: (answer) => {
            return new Promise((resolve, reject) => {
                if (answer == null) {
                    reject("Bad parameter");
                }

                this.socket.emit('send answer', answer, (response) => {
                    if (response.error != null) {
                        reject();
                    } else {
                        this.setState(state => {
                            return {
                                user: Object.assign({}, state.user, {
                                    sdp: answer
                                })
                            };
                        });
                        resolve();
                    }
                });
            });
        },
        /**
         * Allows to set the local user's Session Description Protocol (SDP).
         * It will be sent to peers to make communication possible
         * @param sdp the 
         */
        setSdp: (sdp) => {
            return new Promise((resolve, reject) => {
                if (sdp == null) {
                    reject("Bad parameter");
                }

                this.socket.emit('set sdp', sdp, (response) => {
                    if (response.error != null) {
                        reject();
                    } else {
                        this.setState(state => {
                            return {
                                user: Object.assign({}, state.user, {
                                    sdp: sdp
                                })
                            }
                        });
                        resolve();
                    }
                });
            });
        },

        /**
         * Allows to request for a username change
         * @param username The new username
         */
        setUsername: (username) => {
            return new Promise((resolve, reject) => {
                if (username == null || username === "") {
                    reject("Bad parameter");
                } else {
                    this.socket.emit('set username', username, (response) => {
                        this.setState(state => {
                            return {
                                user: Object.assign({}, state.user, {
                                    name: username
                                })
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
                if (room == null || room === "") {
                    reject("Bad parameter");
                } else {
                    this.state.waitForSignal();
                    this.socket.emit('join room', room, (response) => {
                        this.setState({
                            room: room,
                            connectionEstablished: true,
                            initiator: response.initiator
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
        },
        /**
         * Permet d'indiquer que l'application en attente du signal channel
         */
        waitForSignal: () => {
            this.setState({
                connectionEstablished: false
            });
        }
    }

    /**
     * Permet de définir les réactions aux messages reçus depuis le serveur
     */
    componentDidMount() {
        this.socket = io(SERVER_LOCATION);

        this.socket.on('connection established', (defaultUsername) => {
            console.log("Connexion établie avec le serveur en tant que " + defaultUsername);

            this.setState({
                user: {
                    name: defaultUsername,
                    sdp: null
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
                            name: newName,
                            sdp: null
                        }
                    };
                } else {
                    return {
                        peer: Object.assign({}, state.peer, {
                            name: newName,
                        })
                    };
                }
            });
        });

        /**
         * Action si le peer quitte le salon
         */
        this.socket.on('peer left', () => {
            this.setState({
                peer: {
                    username: '',
                    sdp: null
                }
            });
        });

        /**
         * Action si le peer rejoint un salon
         */
        this.socket.on('offer received', (offer, username) => {
            this.setState({
                peer: {
                    name: username,
                    sdp: offer
                }
            });
        })

        /**
         * Action si le peer rejoint un salon
         */
        this.socket.on('answer received', (answer, username) => {
            this.setState({
                peer: {
                    name: username,
                    sdp: answer
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
