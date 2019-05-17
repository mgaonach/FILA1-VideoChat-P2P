import React from "react";
import "./App.css";
import "webrtc-adapter";

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
    if (navigator === undefined || navigator.mediaDevices === undefined) {
      if (process.env.NODE_ENV === "test") {
        console.info("navigator.mediaDevices is not implemented in test env");
      } else {
        console.error("navigator.mediaDevices is not implemented");
        alert(
          "Your browser does not support this website. Try with an other one."
        );
      }
    } else {
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        ref.current.srcObject = stream;
      });
    }
    return ref;
  }

  initVideo() {}

  render() {
    return <video ref={this.state.videoRef} autoPlay muted />;
  }
}

export default App;
