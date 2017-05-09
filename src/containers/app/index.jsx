/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { loadDemo, reset } from '../../actions/parse.js';

import structure from '../../styles/structure.css';
import styles from './styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleDemoClick = this.handleDemoClick.bind(this);
    this.handleGithubClick = this.handleGithubClick.bind(this);
    this.handleTwitterClick = this.handleTwitterClick.bind(this);
  }

  handleDemoClick(e) {
    e.preventDefault();

    const { dispatch, isLoaded } = this.props;

    if (isLoaded) {
      dispatch(reset());
    }

    // load home route and allow to render
    setTimeout(
      () => {
        this.props.router.push('/');
      },
      250
    );

    setTimeout(
      () => {
        dispatch(loadDemo());
      },
      250
    );
  }

  handleTwitterClick(e) {
    e.preventDefault();
    window.location.href = 'https://twitter.com/zwiftalizer';
  }

  handleGithubClick(e) {
    e.preventDefault();
    window.location.href = 'https://github.com/mhanney/zwiftalizer';
  }

  render() {

    const d = new Date();
    const year = d.getFullYear();

    return (
      <div>
        <div className={styles.stickyHeader}>
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-3">
                <div className={styles.brand}>
                  <span className={styles.signal}>
                    <i className="fa fa-line-chart" aria-hidden="true" />
                  </span>&nbsp;<Link to="/">Zwiftalizer 1.1</Link>
                </div>
              </div>

              <div className="col-sm-12 col-md-2">
                <div className={styles.navItem}>
                  <span className={styles.signal}>
                    <i className="fa fa-play" aria-hidden="true" />
                  </span>&nbsp;
                  <a onClick={this.handleDemoClick}>
                    Demo
                  </a>
                </div>
              </div>

              <div className="col-sm-12 col-md-2">
                <div className={styles.navItem}>
                  <span className={styles.signal}>
                    <i className="fa fa-align-left" aria-hidden="true" />
                  </span>&nbsp;
                  <Link to="/benchmarks">Benchmarks</Link>
                </div>
              </div>

              <div className="col-sm-12 col-md-3">
                <div className={styles.navItem}>
                  <span className={styles.signal}>
                    <i className="fa fa-bolt" aria-hidden="true" />
                  </span>&nbsp;
                  <Link to="/powersources">Power Sources</Link>
                </div>
              </div>

              <div className="col-sm-12 col-md-2">
                <div className={styles.navPills}>
                  <a onClick={this.handleTwitterClick}>
                    <i className="fa fa-twitter-square" />
                  </a>&nbsp;
                  <Link to="/support">
                    <i className="fa fa-paypal" />
                  </Link>&nbsp;
                  <a onClick={this.handleGithubClick}>
                    <i className="fa fa-github" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.stickySubHeader}>
         <div className="container">
            <div className="row">
              <p>zwiftalizer.com is a free open source project neither affiliated with nor endorsed by <a href="http://zwift.com" target="_blank">Zwift Inc</a>.</p>
            </div>   
          </div>
        </div>
        <div className={styles.appBody}>
          {this.props.children}
        </div>
        <div className={styles.footer}>
         <div className="container">
            <div className="row">
              <p>&copy; {year} Mike Hanney | <a href="https://github.com/mhanney/zwiftalizer/blob/master/LICENSE.md" target="_blank">License</a> | Follow <a href="https://twitter.com/zwiftalizer" target="_blank">@zwiftalizer</a> on Twitter for project news.</p>
            </div>   
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reader } = state;
  return {
    ...reader
  };
}

App.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var RoutedApp = withRouter(App);

export default connect(mapStateToProps)(RoutedApp);
