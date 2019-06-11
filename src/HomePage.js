import React from "react";
import "./App.css";
import "webrtc-adapter";
import "react-bootstrap";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Conference from "./Conference";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <section class="content-section" id="channel">
            <div class="container">
              <div class="content-section-heading text-center">
                <h3 class="text-secondary mb-0">PUBLIC</h3>
                <h2 class="mb-5">Channel list</h2>
              </div>
              <div class="row no-gutters">
                <div class="col-lg-6">
                  <a class="portfolio-item" href="#">
                    <span class="caption">
                      <span class="caption-content">
                        <h2>Channel 1</h2>
                        <p class="mb-0">Comment !</p>
                      </span>
                    </span>
                    <img class="img-fluid" src="img/channel.jpg" alt="" />
                  </a>
                </div>
                <div class="col-lg-6">
                  <Link
                    class="portfolio-item"
                    to="/conference"
                    component={Conference}
                  >
                    <span class="caption">
                      <span class="caption-content">
                        <h2>Channel 2</h2>
                        <p class="mb-0">Comment !</p>
                      </span>
                    </span>
                    <img class="img-fluid" src="img/channel.jpg" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Route path="/conference" component={Conference} />
        </div>
      </Router>
    );
  }
}

export default App;
