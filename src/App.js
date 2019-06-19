import React from 'react'
import { Card, Row, Navbar, Container, Alert } from 'react-bootstrap'
import { BrowserRouter, Link } from 'react-router-dom'

import { withSignalChannel } from './SignalChannel/SignalChannelProvider'
import { withNotification } from './Notification/NotificationProvider'

import Routes from './Routes/Routes'
import SettingsModal from './SettingsModal/SettingsModal'

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

  renderNotification(){
    const message = this.props.notificationMessage;
    if ( message == null || message === '' ) {
      return "";
    }
    return (
    <Alert className="notification fade show" variant={this.props.notificationVariant}>
      { message }
    </Alert>
    );
  }

  /**
   * Génère le contenu principal de la page
   */
  renderContent(){
    return (
      <Card className="app">
        <Row style={{margin: '0', height: '100%'}}>
          <Routes />
        </Row>
      </Card>
    );
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
          { this.props.connectionEstablished ? this.renderContent() : (
            <i className="spin	fa fa-spinner" spin style={{color: '#eee', fontSize: '1.5em', position: 'fixed', left: '50%', top: '50%'}}></i>
          ) }
            </Container>
        </div>  

        { this.renderNotification() }
      </BrowserRouter>
    );
  }
}

export default withNotification(withSignalChannel(App));

