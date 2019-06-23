import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import { BrowserRouter, Link } from 'react-router-dom'

import { withSignalChannel } from './SignalChannelProvider'

import Routes from './Routes'
import SettingsModal from './SettingsModal'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsModalVisible: false
    };
  }

  showSettingsModal = () => {
    this.setState({ settingsModalVisible: true });
  }

  hideSettingsModal = () => {
    this.setState({ settingsModalVisible: false });
  }

  toggleSettingsModal = (e) => {
    e.preventDefault();

    if ( this.state.settingsModalVisible ) {
      this.hideSettingsModal();
    } else {
      this.showSettingsModal();
    }
  }

  render() {

    return (
      <BrowserRouter>
        { this.state.settingsModalVisible ? <SettingsModal show={this.state.settingsModalVisible} onHide={this.hideSettingsModal}></SettingsModal> : ''}
          <Navbar className="main-header" variant="dark">
            <Navbar.Brand>
              <Link to="/" className="brand">
                <i className="fa fa-video-camera"></i>&nbsp;
                VideoChat
              </Link>
            </Navbar.Brand>

            <Navbar.Text className="ml-auto settings-button-container">
              <i className="fa fa-cog settings-button" onClick={ this.toggleSettingsModal }></i>
            </Navbar.Text>
          </Navbar>

          <div className="wrapper">
            <Container>
          { this.props.connectionEstablished ? <Routes /> : (
            <i className="spin	fa fa-spinner" spin="true" style={{color: '#eee', fontSize: '1.5em', position: 'fixed', left: '50%', top: '50%'}}></i>
          ) }
            </Container>
        </div>  

      </BrowserRouter>
    );
  }
}

export default withSignalChannel(App);

