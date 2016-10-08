/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react'
import {Link, withRouter} from 'react-router'
import {connect} from 'react-redux'
import {loadDemo, reset} from '../../actions/parse.js'
// bootstrap.native is the bootstrap API without the jquery dependency
var bsn = require('bootstrap.native');
import structure from '../../styles/structure.css'
import styles from './styles.css'
import {About} from '../modals/about.jsx'
import {Support} from '../modals/support.jsx'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.handleDemoClick = this.handleDemoClick.bind(this)
    this.handleGithubClick = this.handleGithubClick.bind(this)
    this.handleTwitterClick = this.handleTwitterClick.bind(this)
    this.handleAboutClick = this.handleAboutClick.bind(this)
    this.handleSupportClick = this.handleSupportClick.bind(this)
  }

  handleDemoClick(e) {
    e.preventDefault()

    const {dispatch, isLoaded} = this.props

    if (isLoaded) {
      dispatch(reset())
    }

    // load home route and allow to render
    setTimeout(() => {
      this.props.router.push('/')
    }, 250)

    setTimeout(() => {
      dispatch(loadDemo())
    }, 250)

  }

  handleTwitterClick(e) {
    e.preventDefault()
    window.location.href = 'https://twitter.com/zwiftalizer'
  }

  handleAboutClick(e) {
    e.preventDefault()
    this.aboutModal.open();
  }

  handleSupportClick(e) {
    e.preventDefault()
    this.supportModal.open();
  }

  handleGithubClick(e) {
    e.preventDefault()
    window.location.href = 'https://github.com/mhanney/zwiftalizer'
  }

  componentDidMount() {
    // find modals and use bootstrap native to enable them, without depending on jquery
    this.aboutModal = new bsn.Modal(document.getElementById('aboutModal'));
    this.supportModal = new bsn.Modal(document.getElementById('supportModal'));
  }

  render() {
    return (

      <div>
        <div className={styles.ribbonWrapper}>
          <div className={styles.ribbon}>BETA</div>
        </div>
        <div className="container" style={{
          marginTop: '2rem'
        }}>
          <div className="row">
            <div className="col-xs-12 col-sm-3">
              <div className={styles.brand}>

                <span className={styles.signal}>
                  <i className="fa fa-line-chart" aria-hidden="true"></i>
                </span>&nbsp;<Link to="/">Zwiftalizer</Link>
              </div>
            </div>

            <div className="col-xs-12 col-sm-3">
              <div className={styles.navItem}>
                <i className="fa fa-amazon" aria-hidden="true">&nbsp;</i>
                <Link to="/accessorize">Accessorize</Link>
              </div>
            </div>

            <div className="col-xs-12 col-sm-3">
              <div className={styles.navItem}>
                <a onClick={this.handleDemoClick}>
                  Demo
                </a>
              </div>
            </div>

            <div className="col-xs-12 col-sm-3">
              <div className="pull-right">
                <div className={styles.navItem}>
                  <a onClick={this.handleAboutClick}>
                    <i className='fa fa-info-circle'></i>
                  </a>&nbsp;
                  <a onClick={this.handleTwitterClick}>
                    <i className='fa fa-twitter-square'></i>
                  </a>&nbsp;
                  <a onClick={this.handleSupportClick}>
                    <i className='fa fa-paypal'></i>
                  </a>&nbsp;
                  <a onClick={this.handleGithubClick}>
                    <i className='fa fa-github'></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {this.props.children}

          <About/>
          <Support/>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  const {reader} = state
  return {
    ...reader
  }
}

// PropTypes
App.propTypes = {
  router: React.PropTypes.shape({push: React.PropTypes.func.isRequired}).isRequired
}

var RoutedApp = withRouter(App);

export default connect(mapStateToProps)(RoutedApp)