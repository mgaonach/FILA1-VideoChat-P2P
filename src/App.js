import React from "react";
import "react-bootstrap";
import Routes from "./Routes/Routes"
import { BrowserRouter } from 'react-router-dom'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsernameForm: false
    };
  }

  render() {
    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  }
}

export default App;
