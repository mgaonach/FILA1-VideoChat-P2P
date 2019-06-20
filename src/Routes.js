import React, { Component } from 'react';

import { Route, Switch, withRouter, Link } from 'react-router-dom';

import Home from './screens/Lobby/Lobby';
import Conference from './screens/Conference/Conference';
import Error from './screens/Error/Error';

import { TransitionGroup, CSSTransition } from "react-transition-group";

class Routes extends Component {
    state = {
        in: false
    }

    render() {
        return (
            <React.Fragment>
                <TransitionGroup>
                    <CSSTransition classNames={'fade'} key={this.props.location.key} timeout={{enter: 300, exit: 0}}>
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/conference" component={Conference} />
                            <Route render={(props) => <Error code="404" />} />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </React.Fragment>
        )
    }
}

Routes = withRouter(Routes);

export default Routes;
