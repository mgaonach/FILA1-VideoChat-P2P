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

        this.sp = null; // SimplePeer
    }

    bindEvents(p) {
        p.on('signal', data => {
            this.props.setSdp(data);
        });

        p.on('stream', stream => {
            alert('stream on');
            const peerVideo = this.peerVideoRef.current
            peerVideo.srcObject = stream;
            peerVideo.play();
        });
    }

    componentWillUnmount(){
        this.props.clearOfferListeners();
    }

    /**
     * On active la caméra et le micro dès le chargement du composant
     */
    componentDidMount(){
        this.props.addOfferListener(this.offerDidArrive);
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => {
            this.sp = new SimplePeer({
                initiator: true,
                stream: stream,
                trickle: false
            });

            this.bindEvents(this.sp);

            const userVideo = this.userVideoRef.current
            userVideo.srcObject = stream;
            userVideo.play();
        })
        .catch(err => {
            alert(err);
        });
    }

    offerDidArrive = (offer) => {
        if (offer != null) {
            
            this.sp.signal(offer);
        }
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
