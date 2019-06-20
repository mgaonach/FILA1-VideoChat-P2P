import React, { Component } from "react";

import { withSignalChannel } from '../../../context/SignalChannel/SignalChannelProvider';
import SimplePeer from "simple-peer";

import { Row, Col } from 'react-bootstrap';
import './Videos.css';

class Videos extends Component {
    constructor() {
        super();

        this.userVideoRef = React.createRef();
        this.peerVideoRef = React.createRef();

        this.state = {
            localPeer: null,
            remotePeer: null,
            stream: null
        }
    }

    componentDidMount(){
        this.createLocalPeer();
        this.createRemotePeer();
    }

    createLocalPeer() {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => {
                let p = new SimplePeer({
                    initiator: true,
                    stream: stream,
                    trickle: false
                }); 
                console.log("local");
                console.log(stream);

                p.on('signal', data => {
                    this.props.setSdp(data);
                });

                this.setState({
                    stream: stream,
                    localPeer: p
                });

                /*const userVideo = this.userVideoRef.current
                userVideo.srcObject = stream;
                userVideo.play();*/
            })
            .catch(err => {
                alert(err);
            });
    }

    createRemotePeer() {
        setTimeout(() => {
            let p = new SimplePeer({
                initiator: false,
                trickle: false
            }); 

            p.on('error', err => {console.log('error', err)});
    
            p.on('stream', stream => {
                console.log("remote");
                console.log(stream);
                const peerVideo = this.peerVideoRef.current
                peerVideo.srcObject = stream;
                peerVideo.onloadedmetadata = function(e) {
                    peerVideo.play();
                  };
            });
    
            this.setState({
                remotePeer: p
            });
    
            p.signal(this.props.peer.sdp);
        }, 10000);
    }

    render() {
        return (
            <div className="videos">
                <Row>
                    <Col sm="6">
                        <h2>Réception</h2>
                        <video ref={this.peerVideoRef} width="100%" height="400px"></video>
                    </Col>
                    <Col sm="6">
                        <h2>Envoi</h2>
                        <video ref={this.userVideoRef} width="100%" height="400px"></video>
                    </Col>
                </Row>
            </div>
        );
    }
}

Videos = withSignalChannel(Videos);

export default Videos;
