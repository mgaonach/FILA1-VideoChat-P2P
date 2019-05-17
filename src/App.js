import React from "react";
import "./App.css";
import adapter from "webrtc-adapter";

const constraints = {
  video: true
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoRef: this.createVideoRef(constraints)
    };
  }

  createVideoRef(constraints) {
    let ref = React.createRef();
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.state.videoRef.current.srcObject = stream;
    });
    return ref;
  }

  initVideo() {}

  render() {
    return <video ref={this.state.videoRef} autoPlay muted />;
  }
}

export default App;
