import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import App from './App';

import SignalChannelProvider from './context/SignalChannel/SignalChannelProvider'

ReactDOM.render(<SignalChannelProvider><App /></SignalChannelProvider>, document.getElementById('root'));

