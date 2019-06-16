import React from "react";
import "./App.css";
import "webrtc-adapter";
import SwitchBtn from "./SwitchBtn";
import "react-bootstrap";
import SimplePeer from "simple-peer";

class App extends React.Component {
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

  initLocalMedia() {
    navigator.getUserMedia(
      {
        video: true,
        audio: true
      },
      function(stream) {
        let p = new SimplePeer({
          initiator: true,
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
        <div className="row">
          <div className="col">
            <video id="emitter-video" />
          </div>
          <div className="col">
            <video id="receiver-video" />
          </div>
        </div>
        <div className="row justify-content-center">
          <SwitchBtn
            name="p2p"
            value={false}
            turnOn={this.hideVideo.bind(this)}
            turnOff={this.hideVideo.bind(this)}
            imgOn={require("./img/callon.png")}
            imgOff={require("./img/calloff.png")}
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
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label for="offer">MY-ID:</label>
            <textarea id="offer" className="form-control" />
            <button
              id="start"
              className="btn btn-primary"
              onClick={this.initLocalMedia.bind(this)}
            >
              GENERATE
            </button>

            <form id="incoming" onSubmit={this.initConnection.bind(this)}>
              <label for="form">FRIEND-ID:</label>
              <textarea id="form" className="form-control" />
              <p>
                <button type="submit" className="btn btn-primary">
                  CONNECTION
                </button>
              </p>
            </form>
          </div>
          <div className="col-8">
            <div className=" form-group">
              <form id="messagesForm" onSubmit={this.sendMessage.bind(this)}>
                <label for="message">MESSAGE:</label>
                <textarea id="message" className="form-control" />
                <button
                  id="sendMessage"
                  className="btn btn-primary"
                  type="submit"
                >
                  SEND
                </button>
              </form>
              <div>
                <ul id="messagesBox" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <p>
            Instructions: pour demarrer une session vidéo, suivre les
            instructions suivantes: // pour faciliter le tout, ouvrez des
            fenêtre de votre navigateur
          </p>
          <p>
            1- Cliquer sur générer pour générer votre ID et initialiser la
            connexion.
          </p>
          <p>
            2- Copier votre ID et donner le à votre peer pour qu'il l'insère
            dans "FRIENDID" plus qu'il clique sur "CONNEXION"
          </p>
          <p>
            3- L'ID de votre peer va être généré à ce moment là, il doit vous
            envoyer son ID pour que vous l'insérez dans "FRIENDID" puis cliquez
            sur "CONNEXION" et le tour est joué !
          </p>
        </div>
      </div>
    );
  }
}

export default App;
