import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Home/Home'
import Conference from './Conference/Conference'
import Error from './Error/Error'


class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/conference" component={Conference} />
                <Route render={(props) => <Error code="404" />} />
            </Switch>
        )
    }
}

export default Routes;
