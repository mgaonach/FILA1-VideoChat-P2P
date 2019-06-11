import React from "react";
import "./App.css";
import "webrtc-adapter";
import "react-bootstrap";
import { BrowserRouter, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import Conference from "./Conference";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  }
}

export default App;
