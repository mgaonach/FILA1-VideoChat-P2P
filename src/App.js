import React from 'react'
import { Navbar, Container, Alert } from 'react-bootstrap'
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

  render() {

    return (
      <BrowserRouter>
        { this.state.settingsModalVisible ? <SettingsModal show={this.state.settingsModalVisible} onHide={this.hideSettingsModal}></SettingsModal> : ''}

        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>
            <Link to="/" className="brand">VideoChat</Link>
          </Navbar.Brand>

          <Navbar.Text className="ml-auto settings-button-container">
            <i className="fa fa-cog settings-button" onClick={ this.toggleSettingsModal }></i>
          </Navbar.Text>
        </Navbar>

        <Container fluid={true}>
          <Routes />
        </Container>

        { this.renderNotification() }
      </BrowserRouter>
    );
  }
}

export default withNotification(withSignalChannel(App));

