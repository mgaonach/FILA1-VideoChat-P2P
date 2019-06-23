import React, { Component } from "react"
import { Card, Row, Col } from 'react-bootstrap'

import { withSignalChannel } from '../../SignalChannelProvider'
import { withRouter } from 'react-router-dom';

import "webrtc-adapter";
import SimplePeer from "simple-peer";

import Chat from './Chat/Chat'

import './Conference.css'

class Conference extends Component {
    state = {
        peer: null,
        stream: null,
        showVideos: false,
        messages: [
        ]
    }

    componentDidMount() {
        if (this.props.room == null || this.props.room === '') { // Quitter la conférence si l'utilisateur n'a pas de room associée
            this.props.history.push('/');
        } else {
            this.setState({
                showVideos: true
            });
        }
    }

    clearMessages = () => {
        this.setState({
            messages: []
        });
    }

    /**
     * Destruction des éléments avant que le composant soit retiré du DOM
     */
    componentWillUnmount() {
        // On ferme les flux de médias et la connexion
        this.closeConnection();

        this.props.leaveRoom();
        this.clearMessages();
    }

    bindEvents(p) {
        /**
         * Affichage des erreurs dans la console javascript
         */
        p.on("error", function (err) {
            console.log("error", err);
        });

        /**
         * Créé l'offre ou la réponse, en fonction du signal reçu
         */
        p.on("signal", function (data) {
            /*
             * Le SDP du peer local est généré ici, soit quand on clique sur "GENERATE" (dans ce cas c'est un SDP de type offer),
             * sinon quand on rentre un SDP offer dans "FRIEND-ID" et que l'on clique sur "CONNECTION" (dans ce cas c'est un SDP de type answer)
             */
            document.querySelector("#offer").value = JSON.stringify(data);
        });

        /**
         * Réception du flux vidéo distant
         */
        p.on("stream", function (stream) {
            let video = document.querySelector("#receiver-video");
            video.srcObject = stream;
            video.play();
        });

        /**
         * Réception d'un message de chat
         */
        p.on("data", (data) => {
            this.addChatMessage(data.toString(), true);
        });

        /**
         * Réaction à la fermeture de connexion par le peer
         */
        p.on("close", () => {
            this.closeConnection();
        })
    }

    /**
     * Initiatilse le flux vidéo en local
     */
    initLocalMedia(isInitiator) {
        navigator.mediaDevices.getUserMedia(
            {
                video: true,
                audio: true
            })
            .then(stream => {
                let p = new SimplePeer({
                    initiator: isInitiator,
                    stream: stream,
                    trickle: false
                });

                this.setState({
                    peer: p,
                    stream: stream
                });

                this.bindEvents(this.state.peer);
                let emitterVideo = document.querySelector("#emitter-video");
                emitterVideo.srcObject = stream;
                emitterVideo.play();
            })
            .catch(() => {

            });
    }

    /**
     * Créé la connexion
     * @param {*} event 
     */
    initConnection(event) {
        event.preventDefault();
        if (this.state.peer == null) {
            // eslint-disable-next-line
            this.state.peer = new SimplePeer({
                initiator: false,
                trickle: false
            });
            this.bindEvents(this.state.peer);
        }

        this.state.peer.signal(JSON.parse(document.getElementById("form").value));
    }

    /**
     * Permet de fermer la connexion P2P et de couper les flux vidéos locaux
     */
    closeConnection = () => {
        if (this.state.peer != null) {
            if (this.state.stream != null) {
                this.state.stream.getVideoTracks()[0].stop();
                this.state.stream.getAudioTracks()[0].stop();
            }

            this.state.peer.destroy();
        }
    }

    /**
     * Envoi d'un message au peer
     */
    sendMessage = (message) => {
        this.addChatMessage(message); // On ajoute le message au bloc de chat local en tant que message de l'utilisateur
        if (this.state.peer != null) {
            try {
                this.state.peer.send(message);
            } catch (e) {

            }
        }
    }

    /**
     * Ajoute un message au bloc de chat
     * @param {*} text 
     * @param {*} peer 
     */
    addChatMessage(text, peer = false) {
        this.setState(state => {
            const messages = state.messages;
            messages.push({
                text: text,
                peer: peer
            });

            return {
                messages: messages
            };
        });
    }

    render() {
        const todoStyle = { padding: 0, height: '640px' }
        return (
            <Card className="screen">
                <Row>
                    <Col xs={9} style={todoStyle}>
                        {this.state.showVideos ? (
                            <div className="videos">
                                <video ref={this.peerVideoRef} id="receiver-video" width="100%" className="peerVideo"></video>
                                <video ref={this.userVideoRef} id="emitter-video" className="userVideo"></video>

                                <div className="devControls">
                                    <button id="start" onClick={() => this.initLocalMedia(true)}>Créer</button><br />
                                    <input type="text" id="offer" /><br />

                                    <button id="start" onClick={() => this.initLocalMedia(false)}>Rejoindre</button>
                                    <form id="incoming" onSubmit={this.initConnection.bind(this)}>
                                        <input type="text" id="form" /><br />
                                        <button type="submit">Démarrer</button>
                                    </form>
                                </div>

                                <form id="messagesForm_test" onSubmit={this.sendMessage.bind(this)}>
                                    <label htmlFor="message">MESSAGE:</label>
                                    <input id="message" type="text" />
                                    <button id="sendMessage" type="submit">SEND</button>
                                </form>
                            </div>
                        ) : ''}
                    </Col>
                    <Col style={todoStyle}>
                        <Chat messages={this.state.messages} sendMessage={this.sendMessage} />
                    </Col>
                </Row>
            </Card>
        );
    }
}

Conference = withRouter(Conference);
Conference = withSignalChannel(Conference);

export default Conference;

