import React, { Component } from "react";

import { withSignalChannel } from '../../../context/SignalChannel/SignalChannelProvider';
import SimplePeer from "simple-peer";

import { Row, Col } from 'react-bootstrap';
import './Videos.css';

class Videos extends Component {
    constructor() {
        super();

        this.userVideoRef = React.createRef();
        this.peerVideoRef = React.createRef();

        this.state = {
            peer: null,
            stream: null
        }
    }

    componentDidMount() {
        this.props.setReceiverCallback(this.initConnection);

        if ( this.props.initiator ) {
            this.initLocalMedia();
        }
    }

    bindEvents(p) {
        p.on("error", (err) => {
            console.log("error", err);
        });

        // notifie le peerA quand le peerB envoie une donnée
        p.on("signal", (data) => {
            /*
             * Le SDP du peer local est généré ici, soit quand on clique sur "GENERATE" (dans ce cas c'est un SDP de type offer),
             * sinon quand on rentre un SDP offer dans "FRIEND-ID" et que l'on clique sur "CONNECTION" (dans ce cas c'est un SDP de type answer)
             */
            if ( this.props.initiator ) {
                this.props.sendOffer(data);
            } else {
                this.props.sendAnswer(data);
            }
        });

        p.on("connect", () => {
          console.log("CONNECT");
          p.send("whatever" + Math.random());
        });

        // audio/video
        p.on("stream", (stream) => {
            const peerVideo = this.peerVideoRef.current
            peerVideo.srcObject = stream;
            peerVideo.play();
        });

        /*// chat
        p.on("data", function(data) {
          let chatBox = document.getElementById("messagesBox");
          let node = document.createElement("li");
          node.textContent = data.toString();
          chatBox.appendChild(node);
        });*/

        if ( !this.props.initiator ) {
            p.signal(this.props.peer.sdp);
        }
    }

    initLocalMedia(i = true) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                let p = new SimplePeer({
                    initiator: i && this.props.initiator,
                    stream: stream,
                    trickle: false
                });

                this.setState({
                    peer: p,
                    stream: stream
                });

                this.bindEvents(p);

                /*this.setState({
                    stream: stream,
                    localPeer: p
                });*/

                const userVideo = this.userVideoRef.current
                userVideo.srcObject = stream;
                userVideo.play();
            })
            .catch(err => {
                alert(err);
            });
    }

    initConnection = () => {
         this.initLocalMedia();
    }

    initConnection = () => {
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

    render() {
        return (
            <div className="videos">
                <video ref={this.peerVideoRef} width="100%" className="peerVideo"></video>

                <video ref={this.userVideoRef} className="userVideo"></video>
            </div>
        );
    }
}

Videos = withSignalChannel(Videos);

export default Videos;
