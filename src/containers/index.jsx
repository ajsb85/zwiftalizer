// polyfill for IE11
import 'babel-polyfill';

import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  IndexRoute,
  Route,
  Switch
} from 'react-router-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory';

import configureStore from '../stores/configureStore';

var _ = require('underscore');

import React from 'react';

import ReactDOM from 'react-dom';

import App from './app';

import Home from './home';

import { Support } from './support';

import Benchmarks from './benchmarks';

import PowerSources from './powersources';

function run() {  
  let store = configureStore();

  const history = createBrowserHistory();

  ReactDOM.render(
    <Provider store={store}>
      <div>
        <Router history={history}>        
          <App>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/demo" component={Home} />
              <Route exact path="/support" component={Support} />
              <Route exact path="/benchmarks" component={Benchmarks} />
              <Route exact path="/powersources" component={PowerSources} />
            </Switch>
          </App>          
        </Router>
      </div>
    </Provider>,
    document.getElementById('app')
  );
}

// roughly equivalent to jQuery's document ready
const loadedStates = ['complete', 'loaded', 'interactive'];

if (_.contains(loadedStates, document.readyState) && document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
