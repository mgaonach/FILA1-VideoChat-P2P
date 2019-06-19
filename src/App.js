import React from 'react'
import 'react-bootstrap'
import { BrowserRouter, Link } from 'react-router-dom'

import { withSignalChannel } from './SignalChannel/SignalChannelProvider'

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

  render() {
    return (
      <BrowserRouter>
        { this.state.settingsModalVisible ? <SettingsModal show={this.state.settingsModalVisible} onHide={this.hideSettingsModal}></SettingsModal> : ''}

        <Link to="/conference" onClick={ this.toggleSettingsModal }>Changer le nom d'utilisateur</Link>
        <Routes />
      </BrowserRouter>
    );
  }
}

export default withSignalChannel(App);

