import React from 'react'
import { Alert } from 'react-bootstrap'
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

        <Link to="/conference" onClick={ this.toggleSettingsModal }>Changer le nom d'utilisateur</Link>
        <Routes />

        { this.renderNotification() }
      </BrowserRouter>
    );
  }
}

export default withNotification(withSignalChannel(App));

