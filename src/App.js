import React from 'react'
import 'react-bootstrap'
import { BrowserRouter, Link } from 'react-router-dom'

import { withSignalChannel } from './SignalChannel/SignalChannelProvider'

import Routes from './Routes/Routes'
import UsernameForm from './UsernameForm/UsernameForm'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameFormVisible: false
    };
  }

  showUsernameForm(){
    this.setState({ usernameFormVisible: true });
  }

  hideUsernameForm(){
    this.setState({ usernameFormVisible: false });
  }

  toggleUsernameForm = (e) => {
    e.preventDefault();

    if ( this.state.usernameFormVisible ) {
      this.hideUsernameForm();
    } else {
      this.showUsernameForm();
    }
  }

  render() {
    return (
      <BrowserRouter>
          { this.state.usernameFormVisible ? <UsernameForm></UsernameForm> : ''}

          <Link to="/conference" onClick={ this.toggleUsernameForm }>Changer le nom d'utilisateur</Link>
          <Routes />
        </BrowserRouter>
    );
  }
}

export default withSignalChannel(App);

