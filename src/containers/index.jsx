/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
// polyfill for IE11
import 'babel-polyfill'
import {Provider} from 'react-redux'

import { BrowserRouter, IndexRoute, Route, Switch } from 'react-router-dom'

import createBrowserHistory from 'history/lib/createBrowserHistory'

import configureStore from '../stores/configureStore'

var _ = require('underscore')

import React from 'react'

import ReactDOM from 'react-dom'

var ReactGA = require('react-ga')

ReactGA.initialize('UA-2833327-13')

import App from './app'

import Home from './home'

import {Support} from './support'

import Benchmarks from './benchmarks'

import PowerSources from './powersources'

function logPageView() {
  ReactGA.set({page: window.location.pathname})
  ReactGA.pageview(window.location.pathname)
}

function run() {

  const newHistory = createBrowserHistory();

  let store = configureStore()

  ReactDOM.render(
    <Provider store={store}>
    <div>
      <BrowserRouter onUpdate={logPageView} history={newHistory}>
        <App>
          <Switch>
            <Route exact path='/' component={App}/>          
            <Route path='support' component={Support}/>
            <Route path='benchmarks' component={Benchmarks}/>
            <Route path='powersources' component={PowerSources}/>
          </Switch>
        </App>        
      </BrowserRouter>
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
