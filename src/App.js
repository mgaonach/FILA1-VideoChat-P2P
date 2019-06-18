import React from "react";
import "./App.css";
import "webrtc-adapter";
import "react-bootstrap";
import VideoConference from "./VideoConference";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <VideoConference />
      </div>
    );
  }
}

export default App;
