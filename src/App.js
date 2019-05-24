import React from "react";
import "./App.css";
import "webrtc-adapter";
import VideoFromStream from "./VideoFromStream";
import SwitchBtn from "./SwitchBtn";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: new MediaStream(),
      distStream: new MediaStream(),
      localPeer: null,
      distPeer: null
    };
    this.videoOn();
  }

  get constraints() {
    return {
      video: true
    };
  }

  addVideoTracks(src, dest) {
    src.getVideoTracks().forEach(track => {
      dest.addTrack(track);
    });
    return dest;
  }

  videoOn() {
    if (navigator === undefined || navigator.mediaDevices === undefined) {
      if (process.env.NODE_ENV === "test") {
        console.info("navigator.mediaDevices is not implemented in test env");
      } else {
        console.error("navigator.mediaDevices is not implemented");
      }
    } else {
      navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
        this.setState({
          localStream: this.addVideoTracks(stream, this.state.localStream)
        });
      });
    }
  }

  videoOff() {
    this.state.localStream.getVideoTracks().forEach(track => {
      track.stop();
    });
  }

  connectP2P() {
    let localPeer = new RTCPeerConnection();
    let distPeer = new RTCPeerConnection();

    this.setState({
      localPeer: localPeer,
      distPeer: distPeer
    });

    localPeer.onicecandidate = e => {
      distPeer.addIceCandidate(e.candidate);
    };

    distPeer.onicecandidate = e => {
      localPeer.addIceCandidate(e.candidate);
    };

    distPeer.onaddstream = e => {
      this.setState({
        distStream: this.addVideoTracks(e.stream, this.state.distStream)
      });
    };

    localPeer.addStream(this.state.localStream);

    localPeer
      .createOffer({
        offerToReceiveVideo: 1
      })
      .then(desc => {
        localPeer.setLocalDescription(desc);
        distPeer.setRemoteDescription(desc);
        distPeer.createAnswer().then(desc => {
          localPeer.setRemoteDescription(desc);
          distPeer.setLocalDescription(desc);
        });
      });
  }

  disconectP2P() {
    this.state.localPeer.close();
    this.state.distPeer.close();
    this.setState({
      localPeer: null,
      distPeer: null
    });
  }

  render() {
    return (
      <div>
        <div>
          <VideoFromStream stream={this.state.localStream} />
          <VideoFromStream stream={this.state.distStream} />
        </div>
        <SwitchBtn
          name="p2p"
          value={false}
          turnOn={this.connectP2P.bind(this)}
          turnOff={this.disconectP2P.bind(this)}
        />
        <SwitchBtn
          name="video"
          turnOn={this.videoOn.bind(this)}
          turnOff={this.videoOff.bind(this)}
        />
      </div>
    );
  }
}

export default App;
