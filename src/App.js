import React from 'react'
import 'react-bootstrap'
import { BrowserRouter } from 'react-router-dom'

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

  toggleUsernameForm = () => {
    if ( this.state.usernameFormVisible ) {
      this.hideUsernameForm();
    } else {
      this.showUsernameForm();
    }
  }

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>

        { this.state.usernameFormVisible ? <UsernameForm></UsernameForm> : ''}

        <button onClick={ this.toggleUsernameForm }>Username</button>
      </React.Fragment>
    );
  }
}

export default withSignalChannel(App);

