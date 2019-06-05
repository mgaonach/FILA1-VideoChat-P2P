import React from "react";
import "./App.css";
import "webrtc-adapter";
import VideoFromStream from "./VideoFromStream";
import SwitchBtn from "./SwitchBtn";
import {Container} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: new MediaStream(),
      distStream: new MediaStream(),
      localPeer: new RTCPeerConnection(),
      distPeer: new RTCPeerConnection(),
      localChannel: null,
      messages: "",
    };
    this.videoOn();
    this.audioOn();
    this.connectP2P();
  }

  get constraints() {
    return {
      video: true,
      audio:true
    };
  }

  addVideoTracks(src, dest) {
    src.getVideoTracks().forEach(track => {
      dest.addTrack(track);
    });
    return dest;
  }

  addAudioTracks(src, dest) {
    src.getAudioTracks().forEach(track => {
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

  audioOn() {
    if (navigator === undefined || navigator.mediaDevices === undefined) {
      if (process.env.NODE_ENV === "test") {
        console.info("navigator.mediaDevices is not implemented in test env");
      } else {
        console.error("navigator.mediaDevices is not implemented");
      }
    } else {
      navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
        this.setState({
          localStream: this.addAudioTracks(stream, this.state.localStream)
        });
        
      });
    }
  }

  audioOff() {
    this.state.localStream.getAudioTracks().forEach(track => {
      track.stop();
    });
  }

  videoOff() {
    this.state.localStream.getVideoTracks().forEach(track => {
      track.stop();
    });
  }

  connectP2P() {
    let localPeer = new RTCPeerConnection();
    let distPeer = new RTCPeerConnection();

    
    // creation candidats 
    localPeer.onicecandidate = e => {
      distPeer.addIceCandidate(e.candidate);
    };

    distPeer.onicecandidate = e => {
      localPeer.addIceCandidate(e.candidate);
    };

    // ajout des stream aux balises video
    distPeer.onaddstream = e => {
      this.setState({
        distStream: this.addVideoTracks(e.stream, this.state.distStream)
      });
    };

    localPeer.addStream(this.state.localStream);

    // creation offre
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

      this.setState({
        localPeer: localPeer,
        distPeer: distPeer
      });

     

    const dataChannelParams = {ordered: true};

    this.state.localChannel = this.state.localPeer.createDataChannel('messaging-channel', dataChannelParams);
    this.state.localChannel.binaryType = 'arraybuffer';
    this.state.localChannel.addEventListener('open', () => {
      console.log('Local channel open!');
    });

    this.state.localChannel.addEventListener('close', () => {
        console.log('Local channel closed!');
    });

      //this.createChannel();
  }

  createChannel(){
    console.log(this.localPeer)
    const dataChannelParams = {ordered: true};

    this.state.localChannel = this.localPeer.createDataChannel('messaging-channel', dataChannelParams);
    this.state.localChannel.binaryType = 'arraybuffer';
    this.state.localChannel.addEventListener('open', () => {
      console.log('Local channel open!');
    });

    this.state.localChannel.addEventListener('close', () => {
        console.log('Local channel closed!');
    });

    //this.state.localChannel.addEventListener('message', this._onLocalMessageReceived.bind(this));

    //this._remoteConnection.addEventListener('datachannel', this._onRemoteDataChannel.bind(this));

  }

  disconectP2P() {
    this.state.localPeer.close();
    this.state.distPeer.close();
    this.setState({
      localPeer: null,
      distPeer: null
    });
  }

  sendMessage(){
    const textarea = document.getElementById("messageInput");
    
    const value = textarea.value;
    if (value === '') {
      console.log('Not sending empty message!');
      return;
    }
    console.log('Sending remote message: ', value);
    //channel.send(value);
    //this.state.messages.push(value);

    
    this.state.messages+=  value + "\n" ;
    textarea.value = '';

    this.printMessage();
  }

  receiveMessage(){

  }

  printMessage(){
    console.log("send:"+this.state.messages)
    const messageBox = document.getElementById("messageBox");
    messageBox.value=this.state.messages;
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col xs md="5">
            <VideoFromStream stream={this.state.localStream} />
          </Col>
          <Col md="2"></Col>
          <Col xs md="5">
            <VideoFromStream stream={this.state.distStream} />
          </Col>
        </Row>  

        <Row className="justify-content-md-center">
          <SwitchBtn
            name="p2p"
            value={false}
            turnOn={this.connectP2P.bind(this)}
            turnOff={this.disconectP2P.bind(this)}
            img={require("./img/call.png")}
          />
          <SwitchBtn
            name="video"
            turnOn={this.videoOn.bind(this)}
            turnOff={this.videoOff.bind(this)}
            img={require("./img/webcam.png")}
          />
          <SwitchBtn
            name="audio"
            turnOn={this.audioOn.bind(this)}
            turnOff={this.audioOff.bind(this)}
            img={require("./img/micro.png")}
          />
        </Row>

        <Row className="justify-content-md-center">
          <label> Messages 
            <textarea  id="messageInput"  />
          </label>
          <input type="submit" value="Send" onClick={this.sendMessage.bind(this)}/>
        </Row>
        <Row className="justify-content-md-center">
          <div >
            <textarea  id="messageBox"  disabled />
          </div>
        </Row>
      </Container>
    );
  }
}

export default App;
