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
    }

    /**
     * Réagir aux événements SimplePeer
     */
    bindEvents(p){
        p.on('error', err => alert(err))
        p.on('signal', data => {
            this.props.setSdp(data);
        })
    }

    componentWillMount(){
        this.startPeer(true);
    }

    /**
     * @param {*} initiator 
     */
    startPeer(isInitiator){
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => {
                let p = new SimplePeer({
                    initiator: isInitiator,
                    stream: stream,
                    trickle: false
                }); 
                
                this.bindEvents(p);
                
                this.setState({
                    peer: p,
                    stream: stream
                });


                const userVideo = this.userVideoRef.current
                userVideo.srcObject = stream;
                userVideo.play();
            })
            .catch(err => {
                alert(err);
            });
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
