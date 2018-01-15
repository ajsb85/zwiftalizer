import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import { loadDemo, reset } from '../../actions/parse.js';

import structure from '../../styles/structure.css';

import styles from './styles.css';

const ReactGA = require('react-ga');

ReactGA.initialize('UA-2833327-13');

class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  sendPageView(location) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }

  constructor(props) {
    super(props);
    this.handleDemoClick = this.handleDemoClick.bind(this);
  }

  componentDidMount() {
    this.sendPageView(this.context.router.history.location);
    this.context.router.history.listen(this.sendPageView);
  }

  handleDemoClick(e) {
    e.preventDefault();

    const { dispatch, isLoaded } = this.props;

    if (isLoaded) {
      dispatch(reset());
    }

    // load demo route (home) and allow to render before loading demo data
    setTimeout(() => {
      this.props.history.push({
        pathname: '/demo'
      });
    }, 100);

    setTimeout(() => {
      dispatch(loadDemo());
    }, 100);
  }

  render() {
    const d = new Date();
    const year = d.getFullYear();

    return (
      <div>
        <div className={styles.stickyHeader}>
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-2">
                <div className={styles.brand}>
                  <Link to="/">Zwiftalizer</Link>
                </div>
              </div>
              <div className="col-sm-12 col-md-2">
                <div className={styles.navItem}>
                  <span className={styles.signal}>
                    <i className="fa fa-home" aria-hidden="true" />
                  </span>&nbsp;<Link to="/">Home</Link>
                </div>
              </div>
              <div className="col-sm-12 col-md-2">
                <div className={styles.navItem}>
                  <span className={styles.signal}>
                    <i className="fa fa-play" aria-hidden="true" />
                  </span>&nbsp;
                  <a onClick={this.handleDemoClick}>Demo</a>
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

              <div className="col-sm-12 col-md-2">
                <div className={styles.navItem}>
                  <span className={styles.signal}>
                    <i className="fa fa-question" aria-hidden="true" />
                  </span>&nbsp;
                  <Link to="/help">Help</Link>
                </div>
              </div>

              {/* <div className="col-sm-12 col-md-2">
                <div className={styles.navItem}>
                  <span className={styles.signal}>
                    <i className="fa fa-bolt" aria-hidden="true" />
                  </span>&nbsp;
                  <Link to="/powersources">Power</Link>
                </div>
              </div> */}

              <div className="col-sm-12 col-md-2">
                <div className={styles.navPills}>
                  <a href="https://twitter.com/zwiftalizer" target="_blank">
                    <i className="fa fa-twitter" />
                  </a>&nbsp;
                  <Link to="/support">
                    <i className="fa fa-paypal" />
                  </Link>&nbsp;
                  <a
                    href="https://github.com/mhanney/zwiftalizer"
                    target="_blank"
                  >
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
              <p>
                Zwiftalizer is an open source, community supported project
                neither endorsed by nor affiliated with&nbsp;<a
                  href="http://zwift.com"
                  target="_blank"
                >
                  Zwift Inc
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.appBody}>{this.props.children}</div>
        <div className={styles.footer}>
          <div className="container">
            <div className="row">
              <p>
                By Mike Hanney&nbsp;|&nbsp;<a
                  href="https://github.com/mhanney/zwiftalizer/blob/master/LICENSE.md"
                  target="_blank"
                >
                  License
                </a>&nbsp;|&nbsp;Follow&nbsp;<a
                  href="https://twitter.com/zwiftalizer"
                  target="_blank"
                >
                  &nbsp;@zwiftalizer
                </a>&nbsp;<a
                  href="https://twitter.com/zwiftalizer"
                  target="_blank"
                >
                  <i className="fa fa-twitter" />
                </a>&nbsp;|&nbsp;Version 1.4.5
              </p>
            </div>
            <div className="row">
              <p />
            </div>
            <div className="row">
              <p>
                <a
                  href="https://heapanalytics.com/?utm_source=badge"
                  rel="nofollow"
                >
                  <img
                    style={{ width: '108px', height: '41px' }}
                    src="//heapanalytics.com/img/badgeLight.png"
                    alt="Heap | Mobile and Web Analytics"
                  />
                </a>
              </p>
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

export default withRouter(connect(mapStateToProps)(App));
