import React from "react";
import "webrtc-adapter";
import SwitchBtn from "./SwitchBtn";
import "react-bootstrap";
import SimplePeer from "simple-peer";
import { withSignalChannel } from "./SignalChannel/SignalChannelProvider";

class VideoConference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peer: null,
      stream: null,
      streamScreen: null
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
    p.on("data", function(data) {
      let chatBox = document.getElementById("messagesBox");
      let node = document.createElement("li");
      node.textContent = data.toString();
      chatBox.appendChild(node);
    });
  }

  initLocalMedia(isInitiator) {
    console.log("init video");
    navigator.getUserMedia(
      {
        video: true,
        audio: true
      },
      function(stream) {
        let p = new SimplePeer({
          initiator: isInitiator,
          stream: stream,
          trickle: false,
          config: { iceServers: [{ urls: ["stun://localhost:2019"] }] }
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

  initSharingScreen() {
    this.hideVideo.bind(this);
    navigator.getUserMedia(
      {
        video: {
          mediaSource: "screen",
          frameRate: { max: "10" }
        },
        audio: true
      },
      function(stream) {
        this.state.peer.streamScreen = stream;
        this.setState({
          streamScreen: stream
        });
        this.bindEvents(this.state.peer);
        let emitterVideo = document.querySelector("#emitter-video");
        emitterVideo.srcObject = stream;
        emitterVideo.play();
      }.bind(this),
      function() {}
    );
  }

  hideSharingScreen() {
    this.state.stream.getTracks().forEach(function(track) {
      track.stop();
    });
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
    console.log(this.state.stream.getVideoTracks()[0]);
    if (this.state.stream != null) {
      if (this.state.stream.getVideoTracks()[0].kind == "video") {
        this.state.stream.getVideoTracks()[0].enabled = !this.state.stream.getVideoTracks()[0]
          .enabled;
      } else if (this.state.stream.getVideoTracks()[0].kind == "screen") {
        this.state.stream.getVideoTracks().forEach(function(track) {
          track.stop();
        });
        this.initSharingScreen.bind(this);
      }
    }
  }

  sendMessage(event) {
    event.preventDefault();
    if (this.state.peer == null) {
      console.log("NULL");
      // eslint-disable-next-line
      this.state.peer = new SimplePeer({
        initiator: false,
        trickle: false
      });
      this.bindEvents(this.state.peer);
    }
    let message = document.getElementById("message").value;
    this.state.peer.send(message);
  }

  render() {
    return (
      <div className="container">
        <video id="emitter-video" />

        <video id="receiver-video" />

        <SwitchBtn
          name="p2p"
          value={false}
          turnOn={this.hideVideo.bind(this)}
          turnOff={this.hideVideo.bind(this)}
          imgOn={require("./img/callon.png")}
          imgOff={require("./img/calloff.png")}
        />
        <SwitchBtn
          name="screen"
          turnOn={this.hideSharingScreen.bind(this)}
          turnOff={this.initSharingScreen.bind(this)}
          imgOn={require("./img/screensharing.png")}
          imgOff={require("./img/screensharing.png")}
        />
        <SwitchBtn
          name="video"
          turnOn={this.hideVideo.bind(this)}
          turnOff={this.hideVideo.bind(this)}
          imgOn={require("./img/webcamoff.png")}
          imgOff={require("./img/webcamon.png")}
        />

        <SwitchBtn
          name="audio"
          turnOn={this.muteUnmute.bind(this)}
          turnOff={this.muteUnmute.bind(this)}
          imgOn={require("./img/microoff.png")}
          imgOff={require("./img/microoff.png")}
        />

        <button
          id="start"
          className="btn btn-warning"
          onClick={() => this.initLocalMedia(true)}
        >
          Create conference
        </button>

        <button
          id="start"
          className="btn btn-warning"
          onClick={() => this.initLocalMedia(false)}
        >
          Join
        </button>

        <label for="offer">MY-ID:</label>
        <textarea id="offer" className="form-control" />

        <form id="incoming" onSubmit={this.initConnection.bind(this)}>
          <label for="form">FRIEND-ID:</label>
          <textarea id="form" className="form-control" />
          <p>
            <button type="submit" className="btn btn-primary">
              CONNECTION
            </button>
          </p>
        </form>

        <form id="messagesForm" onSubmit={this.sendMessage.bind(this)}>
          <label for="message">MESSAGE:</label>
          <textarea id="message" className="form-control" />
          <button id="sendMessage" className="btn btn-primary" type="submit">
            SEND
          </button>
        </form>
        <ul id="messagesBox" />
      </div>
    );
  }
}

//export default withSignalChannel(VideoConference);
export default VideoConference;
