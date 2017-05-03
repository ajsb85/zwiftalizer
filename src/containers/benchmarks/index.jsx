var moment = require('moment');
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { load, openProfilePanel } from '../../actions/benchmarks';
import Resolution from './resolution.jsx';
import structure from '../../styles/structure.css';
import editorialStyles from '../../styles/editorial.css';
import styles from './styles.css';

class Benchmarks extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;

    this.findMySystemClicked = this.findMySystemClicked.bind(this);

    setTimeout(
      () => {
        dispatch(load());
      },
      100
    );
  }

  findMySystemClicked(e) {
    e.preventDefault();

    const { currentSystem, dispatch } = this.props;

    if (!currentSystem) {
      return;
    }

    // force open the panel that contains the current system before scrolling incase the user closed it
    dispatch(openProfilePanel(currentSystem.panelKey));

    setTimeout(
      () => {
        const anchorToScrollTo = document.getElementById('current');
        anchorToScrollTo &&
          anchorToScrollTo.scrollIntoView(true /* align top */);
      },
      200
    );
  }

  render() {
    const { isLoaded } = this.props;

    return isLoaded ? this.renderBenchmarks() : null;
  }

  renderFilters() {
    return (
      <div className={styles.stickyFilters}>
        <div className="container">
          <div className="row">            
              <h2>Filter where</h2>            
          </div>
          <div className="row">          
            <div className="col-xs-12 col-sm-3">
              <h3>min fps</h3>
              <div className={styles.formContainer}>
                <div>
                  <input
                    id="fps0"
                    name="fpsFilter"
                    type="radio"
                    className={styles.withfont}
                    value="0"
                  />
                  <label htmlFor="fps0">&gt; 0</label>
                </div>
                <div>
                  <input
                    id="fps1"
                    name="fpsFilter"
                    type="radio"
                    className={styles.withfont}
                    value="1"
                  />
                  <label htmlFor="fps1">&gt; 15</label>
                </div>
                <div>
                  <input
                    id="fps2"
                    name="fpsFilter"
                    type="radio"
                    className={styles.withfont}
                    value="2"
                  />
                  <label htmlFor="fps2">&gt; 30</label>
                </div>
                <div>
                  <input
                    id="fps3"
                    name="fpsFilter"
                    type="radio"
                    className={styles.withfont}
                    value="3"
                  />
                  <label htmlFor="fps3">&gt; 60</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderFindMySystemControls() {
    const { currentSystem } = this.props;

    if (!currentSystem) {
      return null;
    }

    return (
      <div className={styles.rightAlignControls}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={this.findMySystemClicked}
        >
          Find my system
        </button>
      </div>
    );
  }

  renderBenchmarks() {
    const {
      resolutions,
      dateLastUpdate,
      totalRecords,
      expanded,
      currentSystem
    } = this.props;

    var resolutionEntries = resolutions &&
      resolutions.map(
        function(resolution, i) {
          const data = Object.assign({}, resolution, {
            totalRecords,
            expanded,
            currentSystem
          });

          return <Resolution data={data} key={data.resolution} />;
        },
        this
      );

    const dateLastUpdateHuman = moment(dateLastUpdate).format();

    return (
      <div>
        {this.renderFilters()}
        <div className="container">
          <div className={editorialStyles.boxesWrapOuter}>
            <div className={structure.boxesWrapInner}>
              <div className={structure.boxLast}>
                <div className={editorialStyles.editorialBoxHeading}>
                  Zwift System Benchmarks (Community Generated)
                </div>
                <div className={editorialStyles.editorialBoxContent}>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-xs-12">
                        <div className={styles.systemsCount}>
                          {totalRecords}
                        </div>
                        <div className={styles.systemsCountSubheading}>
                          Total Systems
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12 col-sm-6">
                        <div className={styles.lastUpdateTime}>
                          Last Updated: {dateLastUpdateHuman}
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-6">
                        {this.renderFindMySystemControls(currentSystem)}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          {resolutionEntries}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { benchmarks } = state;
  return {
    ...benchmarks
  };
}

Benchmarks.propTypes = {
  benchmarks: PropTypes.object
};

export default connect(mapStateToProps)(Benchmarks);
