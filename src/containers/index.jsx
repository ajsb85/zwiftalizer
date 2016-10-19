/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import {Provider} from 'react-redux'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import configureStore from '../stores/configureStore'

var _ = require('underscore')
import React from 'react'
import ReactDOM from 'react-dom'

var ReactGA = require('react-ga')
ReactGA.initialize('UA-2833327-13')

import App from './app'
import Home from './home'
import {Accessorize} from './accessorize'
import Benchmarks from './benchmarks'

function logPageView() {
  ReactGA.set({page: window.location.pathname})
  ReactGA.pageview(window.location.pathname)
}

function run() {

  let store = configureStore()

  ReactDOM.render(
    <Provider store={store}>
    <div>
      <Router onUpdate={logPageView} history={browserHistory}>
        <Route path='/' component={App}>
          <IndexRoute component={Home}/>
          <Route path='accessorize' component={Accessorize}/>
          <Route path='benchmarks' component={Benchmarks}/>
        </Route>
      </Router>
    </div>
  </Provider>, document.getElementById('app'))
}

// roughly equivalent to jQuery's document ready
const loadedStates = ['complete', 'loaded', 'interactive']

if (_.contains(loadedStates, document.readyState) && document.body) {
  run()
} else {
  window.addEventListener('DOMContentLoaded', run, false)
}
