import React from "react";
import logo from "./logo.svg";
import "./App.css";
import adapter from "webrtc-adapter";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.initVideo();
  }

  initVideo() {
    let video = (
      <video
        ref={video => {
          this.video = video;
        }}
        autoPlay
        muted
      />
    );
    this.state = {
      video: video
    };

    navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then(stream => {
        this.video.srcObject = stream;
      });
  }

  render() {
    return this.state.video;
  }
}

export default App;
