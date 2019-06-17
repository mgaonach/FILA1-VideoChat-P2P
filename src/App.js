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
      initiateur: null,
      peer: null,
      streamLocal: null
    };
  }

  initAll() {
    this.initVideoLocale();
    let initiateur = new SimplePeer({
      initiator: true,
      stream: this.state.streamLocal,
      trickle: false
    });
    let peer = new SimplePeer({
      initiator: false,
      stream: this.state.streamLocal,
      trickle: false
    });
    initiateur.on("signal", function(data) {
      console.log("Signal !");
      /*
       * Le SDP du peer local est généré ici, soit quand on clique sur "GENERATE" (dans ce cas c'est un SDP de type offer),
       * sinon quand on rentre un SDP offer dans "FRIEND-ID" et que l'on clique sur "CONNECTION" (dans ce cas c'est un SDP de type answer)
       */
      document.querySelector("#offer").value = JSON.stringify(data);
      peer.signal(data);
    });

    peer.on("signal", function(data) {
      console.log("Signal !");
      /*
       * Le SDP du peer local est généré ici, soit quand on clique sur "GENERATE" (dans ce cas c'est un SDP de type offer),
       * sinon quand on rentre un SDP offer dans "FRIEND-ID" et que l'on clique sur "CONNECTION" (dans ce cas c'est un SDP de type answer)
       */
      document.querySelector("#offer").value = JSON.stringify(data);
      initiateur.signal(data);
    });
    peer.on("stream", function(stream) {
      let video = document.querySelector("#receiver-video");
      video.srcObject = stream;
      video.play();
    });
  }

  bindEvents(p) {
    console.log("BIND");
    p.on("error", function(err) {
      console.log("error", err);
    });

    // notifie le peerA quand le peerB envoie une donnée
    p.on("signal", function(data) {
      console.log("Signal !");
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
      console.log("Stream !");
      let video = document.querySelector("#receiver-video");
      video.srcObject = stream;
      video.play();
    });

    // chat
    p.on("data", function(data) {
      console.log("data !");
      let chatBox = document.getElementById("messagesBox");
      let node = document.createElement("li");
      node.textContent = data.toString();
      chatBox.appendChild(node);
    });
  }

  initVideoLocale() {
    navigator.getUserMedia(
      {
        video: true,
        audio: true
      },
      function(stream) {
        let emitterVideo = document.querySelector("#emitter-video");
        emitterVideo.srcObject = stream;
        emitterVideo.play();
      }.bind(this),
      function() {}
    );
  }

  initInitiator() {
    console.log("Je suis initiateur !");
    let initiateur = new SimplePeer({
      initiator: true,
      stream: this.state.streamLocal,
      trickle: false
    });
    let peer = this.state.peer;
    //this.bindEvents(initiateur);
    initiateur.on("signal", function(data) {
      console.log("Signal !");
      /*
       * Le SDP du peer local est généré ici, soit quand on clique sur "GENERATE" (dans ce cas c'est un SDP de type offer),
       * sinon quand on rentre un SDP offer dans "FRIEND-ID" et que l'on clique sur "CONNECTION" (dans ce cas c'est un SDP de type answer)
       */
      document.querySelector("#offer").value = JSON.stringify(data);
      peer.signal(data);
    });
    this.setState({
      initiateur: initiateur
    });
  }

  initPeer() {
    console.log("Je suis un peer !");
    let peer = new SimplePeer({
      initiator: false,
      stream: this.state.streamLocal,
      trickle: false
    });

    //this.bindEvents(peer);
    peer
      .on("signal", function(data) {
        console.log("Signal !");
        /*
         * Le SDP du peer local est généré ici, soit quand on clique sur "GENERATE" (dans ce cas c'est un SDP de type offer),
         * sinon quand on rentre un SDP offer dans "FRIEND-ID" et que l'on clique sur "CONNECTION" (dans ce cas c'est un SDP de type answer)
         */
        document.querySelector("#offer").value = JSON.stringify(data);
        this.state.initiator.signal(data);
      })
      .bind(this);
    this.setState({
      peer: peer
    });
  }

  join(isInitiator) {
    this.initAll();
    // initialise la video locale
    //this.initVideoLocale();
    // initialise le peer
    /**
     *  il faut obligatoirement un initiateur et les autres peer
     *  pour cela, dans l'url, l'initiateur ajours #1
     **/

    /*
    if (isInitiator) {
      this.initInitiator();
    } else {
      this.initPeer();
    }
    */
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

        <div className="row">
          <button id="create" onClick={() => this.join(true)}>
            Create Conference !
          </button>
          <button id="join" onClick={() => this.join(false)}>
            Join !
          </button>
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label for="offer">MY-ID:</label>
            <textarea id="offer" className="form-control" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
