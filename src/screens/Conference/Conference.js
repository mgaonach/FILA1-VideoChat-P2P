import React, { Component } from "react"
import { Card, Row, Col } from 'react-bootstrap'

import { withSignalChannel } from '../../context/SignalChannel/SignalChannelProvider'
import { withRouter } from 'react-router-dom';

//import VideoConference from '../../VideoConference'
import Videos from './Videos/Videos'
import Chat from './Chat/Chat'

class Conference extends Component {

    componentWillMount(){
        if ( this.props.room == null || this.props.room === '' ) {
            // TODO uncomment
            //this.props.history.push('/');
        }
    }

    render() {
        const todoStyle={padding: 0, height: '640px'}
        return (
            <Card className="screen">
                <Row>
                    <Col xs={9} style={todoStyle}>
                        <Videos />
                    </Col>
                    <Col style={todoStyle}>
                        <Chat />
                    </Col>
                </Row>
            </Card>
        );
    }
}

Conference = withRouter(Conference);
Conference = withSignalChannel(Conference);

export default Conference;

/* <VideoConference /> */