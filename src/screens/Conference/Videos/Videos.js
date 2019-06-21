import React, { Component } from "react";

import "webrtc-adapter";
import { withSignalChannel } from '../../../context/SignalChannel/SignalChannelProvider';
import SimplePeer from "simple-peer";

import './Videos.css';

class Videos extends Component {
    constructor(props) {
        super(props);
        this.state = {
          peer: null,
          stream: null
        };
      }
    
      bindEvents(p) {
        p.on("error", function(err) {
          console.log("error", err);
        });
    
        // notifie le peerA quand le peerB envoie une donnée
        p.on("signal", function(data) {
          /*
           * Le SDP du peer local est généré ici, soit quand on clique sur "GENERATE" (dans ce cas c'est un SDP de type offer),
           * sinon quand on rentre un SDP offer dans "FRIEND-ID" et que l'on clique sur "CONNECTION" (dans ce cas c'est un SDP de type answer)
           */
          document.querySelector("#offer").value = JSON.stringify(data);
        });
    
        p.on("connect", () => {
          console.log("CONNECT");
          p.send("whatever" + Math.random());
        });
    
        // audio/video
        p.on("stream", function(stream) {
          let video = document.querySelector("#receiver-video");
          video.srcObject = stream;
          video.play();
        });
    
        // chat
        p.on("data", (data) => {
            this.props.addChatMessage(data.toString(), true);
        });
      }
    
      initLocalMedia(isInitiator) {
        navigator.getUserMedia(
          {
            video: true,
            audio: true
          },
          function(stream) {
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
          }.bind(this),
          function() {}
        );
      }
    
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
    
      muteUnmute() {
        if (this.state.stream != null)
          this.state.stream.getAudioTracks()[0].enabled = !this.state.stream.getAudioTracks()[0]
            .enabled;
      }
    
      hideVideo() {
        if (this.state.stream != null)
          this.state.stream.getVideoTracks()[0].enabled = !this.state.stream.getVideoTracks()[0]
            .enabled;
      }
    
      sendMessage(event) {
        event.preventDefault();
        let message = document.getElementById("message").value;
        this.props.addChatMessage(message);
        
        if (this.state.peer == null) {
          /*console.log("NULL");
          // eslint-disable-next-line
          this.state.peer = new SimplePeer({
            initiator: false,
            trickle: false
          });
          this.bindEvents(this.state.peer);*/
        } else {
            try{
                this.state.peer.send(message);
            } catch (e){
    
            }
        }
      }

    render() {
        return (
            <div className="videos">
                <video ref={this.peerVideoRef} id="receiver-video" width="100%" className="peerVideo"></video>
                <video ref={this.userVideoRef} id="emitter-video" className="userVideo"></video>

                <div className="devControls">
                    <button id="start" onClick={() => this.initLocalMedia(true)}>Créer</button><br />
                    <input type="text" id="offer" /><br />

                    <button id="start" onClick={() => this.initLocalMedia(false)}>Rejoindre</button>
                    <form id="incoming" onSubmit={this.initConnection.bind(this)}>
                    <input type="text" id="form"/><br />
                    <button type="submit">Démarrer</button>
                    </form>
                </div>

                <form id="messagesForm_test" onSubmit={this.sendMessage.bind(this)}>
                    <label for="message">MESSAGE:</label>
                    <input id="message" type="text" />
                    <button id="sendMessage" type="submit">SEND</button>
                </form>
            </div>
        );
    }
}

Videos = withSignalChannel(Videos);

export default Videos;

