var moment = require('moment');
const R = require('ramda');
const _ = require('underscore');
const { tokenize } = require('./searchTermTokenizer.js');
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { load, openProfilePanel } from '../../actions/benchmarks';
import whereResults from '../../filters/whereResults';
import Resolution from './resolution.jsx';
import structure from '../../styles/structure.css';
import editorialStyles from '../../styles/editorial.css';
import styles from './styles.css';

const ALL = 'All';

class Benchmarks extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;

    this.state = {
      platformFilter: ALL,
      resolutionFilter: ALL,
      profileFilter: ALL,
      cpuFilter: ALL,
      gpuFilter: ALL,
      minFpsFilter: ALL,
      showFiltersPanel: false,
      searchTerms: []
    };

    this.handlePlatformFilterChange = this.handlePlatformFilterChange.bind(
      this
    );
    this.handleResolutionFilterChange = this.handleResolutionFilterChange.bind(
      this
    );
    this.handleProfileFilterChange = this.handleProfileFilterChange.bind(this);
    this.handleCpuFilterChange = this.handleCpuFilterChange.bind(this);
    this.handleGpuFilterChange = this.handleGpuFilterChange.bind(this);
    this.handleMinFpsFilterChange = this.handleMinFpsFilterChange.bind(this);
    this.findMySystemClicked = this.findMySystemClicked.bind(this);
    this.toggleFiltersPanelClicked = this.toggleFiltersPanelClicked.bind(this);
    this.handleSearchInputKeyPress = this.handleSearchInputKeyPress.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);

    setTimeout(() => {
      dispatch(load());
    }, 100);
  }

  handlePlatformFilterChange(e) {
    this.setState({ platformFilter: e.target.value });
  }

  handleResolutionFilterChange(e) {
    this.setState({ resolutionFilter: e.target.value });
  }

  handleProfileFilterChange(e) {
    this.setState({ profileFilter: e.target.value });
  }

  handleCpuFilterChange(e) {
    this.setState({ cpuFilter: e.target.value });
  }

  handleGpuFilterChange(e) {
    this.setState({ gpuFilter: e.target.value });
  }

  handleMinFpsFilterChange(e) {
    this.setState({ minFpsFilter: e.target.value });
  }

  findMySystemClicked(e) {
    e.preventDefault();

    const { currentSystem, resolutions, dispatch } = this.props;

    if (!currentSystem) {
      return;
    }

    // force open the panel that contains the current system before scrolling incase the user closed it
    dispatch(openProfilePanel(currentSystem.panelKey));

    setTimeout(() => {
      const anchorToScrollTo = document.getElementById('current');
      if (anchorToScrollTo) {
        anchorToScrollTo.scrollIntoView(true /* align top */);
        window.scrollBy(0, -300); // scroll 300 px because of sticky header
      }
    }, 200);
  }

  handleSearchInputKeyPress(target) {
    if (target.keyCode === 13) {
      this.handleSearchClick();
    }
  }

  handleSearchClick(e) {
    if (e) {
      e.preventDefault();
    }
    const input = document.getElementById('searchTermsInput');
    if (!input.value) {
      this.setState({ searchTerms: [] });
    }
    const vals = tokenize(input.value);
    this.setState({ searchTerms: vals });

    if (window.heap) {
      window.heap.track('Search', { terms: vals.join(',') });
    }

    // setTimeout(() => {
    //   console.log(this.state.searchTerms);
    // }, 200);
  }

  toggleFiltersPanelClicked(e) {
    e.preventDefault();
    this.setState({ showFiltersPanel: !this.state.showFiltersPanel });
  }

  render() {
    const { isLoaded } = this.props;

    return isLoaded ? this.renderBenchmarks() : null;
  }

  renderFilters() {
    const filterPanelStyle = this.state.showFiltersPanel
      ? {
          top: '9.5rem'
        }
      : {
          top: '-11.5rem'
        };

    return (
      <div className="hidden-xs hidden-sm">
        <div className={styles.filters} style={filterPanelStyle}>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-2">
                <h3>Platform</h3>
                <div className={styles.formContainer}>
                  <div>
                    <input
                      id="platform0"
                      name="platformFilter"
                      type="radio"
                      className={styles.withfont}
                      value={ALL}
                      checked={this.state.platformFilter === ALL}
                      onChange={this.handlePlatformFilterChange}
                    />
                    <label htmlFor="platform0">All</label>
                  </div>
                  <div>
                    <input
                      id="platform1"
                      name="platformFilter"
                      type="radio"
                      className={styles.withfont}
                      value="PC"
                      checked={this.state.platformFilter === 'PC'}
                      onChange={this.handlePlatformFilterChange}
                    />
                    <label htmlFor="platform1">PC</label>
                  </div>
                  <div>
                    <input
                      id="platform2"
                      name="platformFilter"
                      type="radio"
                      className={styles.withfont}
                      value="Mac"
                      checked={this.state.platformFilter === 'Mac'}
                      onChange={this.handlePlatformFilterChange}
                    />
                    <label htmlFor="platform2">Mac</label>
                  </div>
                  <div>
                    <input
                      id="platform3"
                      name="platformFilter"
                      type="radio"
                      className={styles.withfont}
                      value="iOS"
                      checked={this.state.platformFilter === 'iOS'}
                      onChange={this.handlePlatformFilterChange}
                    />
                    <label htmlFor="platform3">iOS</label>
                  </div>
                  <div>
                    <input
                      id="platform4"
                      name="platformFilter"
                      type="radio"
                      className={styles.withfont}
                      value="Alienware"
                      checked={this.state.platformFilter === 'Alienware'}
                      onChange={this.handlePlatformFilterChange}
                    />
                    <label htmlFor="platform4">Alienware</label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-2">
                <h3>Resolution</h3>
                <div className={styles.formContainer}>
                  <div>
                    <input
                      id="resolution0"
                      name="resolutionFilter"
                      type="radio"
                      className={styles.withfont}
                      value={ALL}
                      checked={this.state.resolutionFilter === ALL}
                      onChange={this.handleResolutionFilterChange}
                    />
                    <label htmlFor="resolution0">All</label>
                  </div>
                  <div>
                    <input
                      id="resolution1"
                      name="resolutionFilter"
                      type="radio"
                      className={styles.withfont}
                      value="2160"
                      checked={this.state.resolutionFilter === '2160'}
                      onChange={this.handleResolutionFilterChange}
                    />
                    <label htmlFor="resolution1">2160 (4K)</label>
                  </div>
                  <div>
                    <input
                      id="resolution2"
                      name="resolutionFilter"
                      type="radio"
                      className={styles.withfont}
                      value="1440"
                      checked={this.state.resolutionFilter === '1440'}
                      onChange={this.handleResolutionFilterChange}
                    />
                    <label htmlFor="resolution2">1440 (WQHD)</label>
                  </div>
                  <div>
                    <input
                      id="resolution3"
                      name="resolutionFilter"
                      type="radio"
                      className={styles.withfont}
                      value="1080"
                      checked={this.state.resolutionFilter === '1080'}
                      onChange={this.handleResolutionFilterChange}
                    />
                    <label htmlFor="resolution3">1080 (FHD)</label>
                  </div>
                  <div>
                    <input
                      id="resolution4"
                      name="resolutionFilter"
                      type="radio"
                      className={styles.withfont}
                      value="750"
                      checked={this.state.resolutionFilter === '750'}
                      onChange={this.handleResolutionFilterChange}
                    />
                    <label htmlFor="resolution4">750 (iPhone 7)</label>
                  </div>
                  <div>
                    <input
                      id="resolution5"
                      name="resolutionFilter"
                      type="radio"
                      className={styles.withfont}
                      value="720"
                      checked={this.state.resolutionFilter === '720'}
                      onChange={this.handleResolutionFilterChange}
                    />
                    <label htmlFor="resolution5">720 (HD)</label>
                  </div>
                  <div>
                    <input
                      id="resolution6"
                      name="resolutionFilter"
                      type="radio"
                      className={styles.withfont}
                      value="576"
                      checked={this.state.resolutionFilter === '576'}
                      onChange={this.handleResolutionFilterChange}
                    />
                    <label htmlFor="resolution6">576 (SD)</label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-2">
                <h3>Profile</h3>
                <div className={styles.formContainer}>
                  <div>
                    <input
                      id="profile0"
                      name="profileFilter"
                      type="radio"
                      className={styles.withfont}
                      value={ALL}
                      checked={this.state.profileFilter === ALL}
                      onChange={this.handleProfileFilterChange}
                    />
                    <label htmlFor="profile0">All</label>
                  </div>
                  <div>
                    <input
                      id="profile1"
                      name="profileFilter"
                      type="radio"
                      className={styles.withfont}
                      value="3"
                      checked={this.state.profileFilter === '3'}
                      onChange={this.handleProfileFilterChange}
                    />
                    <label htmlFor="profile1">Ultra</label>
                  </div>
                  <div>
                    <input
                      id="profile2"
                      name="profileFilter"
                      type="radio"
                      className={styles.withfont}
                      value="2"
                      checked={this.state.profileFilter === '2'}
                      onChange={this.handleProfileFilterChange}
                    />
                    <label htmlFor="profile2">High</label>
                  </div>
                  <div>
                    <input
                      id="profile3"
                      name="profileFilter"
                      type="radio"
                      className={styles.withfont}
                      value="1"
                      checked={this.state.profileFilter === '1'}
                      onChange={this.handleProfileFilterChange}
                    />
                    <label htmlFor="profile3">Medium</label>
                  </div>
                  <div>
                    <input
                      id="profile4"
                      name="profileFilter"
                      type="radio"
                      className={styles.withfont}
                      value="0"
                      checked={this.state.profileFilter === '0'}
                      onChange={this.handleProfileFilterChange}
                    />
                    <label htmlFor="profile4">Basic</label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-2">
                <h3>CPU Make</h3>
                <div className={styles.formContainer}>
                  <div>
                    <input
                      id="cpu0"
                      name="cpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value={ALL}
                      checked={this.state.cpuFilter === ALL}
                      onChange={this.handleCpuFilterChange}
                    />
                    <label htmlFor="cpu0">All</label>
                  </div>
                  <div>
                    <input
                      id="cpu1"
                      name="cpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value="intel"
                      checked={this.state.cpuFilter === 'intel'}
                      onChange={this.handleCpuFilterChange}
                    />
                    <label htmlFor="cpu1">Intel</label>
                  </div>
                  <div>
                    <input
                      id="cpu2"
                      name="cpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value="amd"
                      checked={this.state.cpuFilter === 'amd'}
                      onChange={this.handleCpuFilterChange}
                    />
                    <label htmlFor="cpu2">AMD</label>
                  </div>
                  <div>
                    <input
                      id="cpu3"
                      name="cpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value="arm64"
                      checked={this.state.cpuFilter === 'arm64'}
                      onChange={this.handleCpuFilterChange}
                    />
                    <label htmlFor="cpu3">ARM</label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-2">
                <h3>GPU Make</h3>
                <div className={styles.formContainer}>
                  <div>
                    <input
                      id="gpu0"
                      name="gpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value={ALL}
                      checked={this.state.gpuFilter === ALL}
                      onChange={this.handleGpuFilterChange}
                    />
                    <label htmlFor="gpu0">All</label>
                  </div>
                  <div>
                    <input
                      id="gpu1"
                      name="gpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value="nvidia"
                      checked={this.state.gpuFilter === 'nvidia'}
                      onChange={this.handleGpuFilterChange}
                    />
                    <label htmlFor="gpu1">Nvidia</label>
                  </div>
                  <div>
                    <input
                      id="gpu2"
                      name="gpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value="ati"
                      checked={this.state.gpuFilter === 'ati'}
                      onChange={this.handleGpuFilterChange}
                    />
                    <label htmlFor="gpu2">AMD/ATI</label>
                  </div>
                  <div>
                    <input
                      id="gpu3"
                      name="gpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value="apple"
                      checked={this.state.gpuFilter === 'apple'}
                      onChange={this.handleGpuFilterChange}
                    />
                    <label htmlFor="gpu3">Apple</label>
                  </div>
                  <div>
                    <input
                      id="gpu4"
                      name="gpuFilter"
                      type="radio"
                      className={styles.withfont}
                      value="intel"
                      checked={this.state.gpuFilter === 'intel'}
                      onChange={this.handleGpuFilterChange}
                    />
                    <label htmlFor="gpu4">Intel</label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-2">
                <h3>Min fps</h3>
                <div className={styles.formContainer}>
                  <div>
                    <input
                      id="fps0"
                      name="fpsFilter"
                      type="radio"
                      className={styles.withfont}
                      value={ALL}
                      checked={this.state.minFpsFilter === ALL}
                      onChange={this.handleMinFpsFilterChange}
                    />
                    <label htmlFor="fps0">All</label>
                  </div>
                  <div>
                    <input
                      id="fps1"
                      name="fpsFilter"
                      type="radio"
                      className={styles.withfont}
                      value="60"
                      checked={this.state.minFpsFilter === '60'}
                      onChange={this.handleMinFpsFilterChange}
                    />
                    <label htmlFor="fps1">≥ 60</label>
                  </div>
                  <div>
                    <input
                      id="fps2"
                      name="fpsFilter"
                      type="radio"
                      className={styles.withfont}
                      value="45"
                      checked={this.state.minFpsFilter === '45'}
                      onChange={this.handleMinFpsFilterChange}
                    />
                    <label htmlFor="fps2">≥ 45</label>
                  </div>
                  <div>
                    <input
                      id="fps3"
                      name="fpsFilter"
                      type="radio"
                      className={styles.withfont}
                      value="30"
                      checked={this.state.minFpsFilter === '30'}
                      onChange={this.handleMinFpsFilterChange}
                    />
                    <label htmlFor="fps3">≥ 30</label>
                  </div>
                  <div>
                    <input
                      id="fps4"
                      name="fpsFilter"
                      type="radio"
                      className={styles.withfont}
                      value="15"
                      checked={this.state.minFpsFilter === '15'}
                      onChange={this.handleMinFpsFilterChange}
                    />
                    <label htmlFor="fps4">≥ 15</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-offset-5 col-xs-2">
                <div
                  className={styles.toggleFiltersHandle}
                  onClick={this.toggleFiltersPanelClicked}
                >
                  <p>FILTERS</p>
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
      <button
        type="button"
        style={{ width: '12rem' }}
        className="btn btn-primary btn-md"
        onClick={this.findMySystemClicked}
      >
        Find mine
      </button>
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

    let resolutionEntries;
    let filtered;
    let predicate = {};

    // Search and Filters interact (NOT mutually exclusive)
    if (this.state.searchTerms) {
      if (this.state.searchTerms.length === 1) {
        predicate.terms = R.contains(this.state.searchTerms[0]);
      } else {
        const innerPredicates = [];

        this.state.searchTerms.map(term => {
          innerPredicates.push(R.contains(term));
        });

        // terms are ANDed
        // predicate.terms = R.allPass(innerPredicates);

        // terms are ORed
        predicate.terms = R.anyPass(innerPredicates);
      }
    }

    if (this.state.platformFilter !== ALL) {
      predicate.platform = R.equals(this.state.platformFilter);
    }

    if (this.state.resolutionFilter !== ALL) {
      predicate.resolution = R.equals(
        parseInt(this.state.resolutionFilter, 10)
      );
    }

    if (this.state.profileFilter !== ALL) {
      predicate.profileId = R.equals(parseInt(this.state.profileFilter, 10));
    }

    if (this.state.cpuFilter !== ALL) {
      predicate.cpuVendor = R.equals(this.state.cpuFilter);
    }

    if (this.state.gpuFilter !== ALL) {
      predicate.gpuVendor = R.equals(this.state.gpuFilter);
    }

    if (this.state.minFpsFilter !== ALL) {
      predicate.minFps = R.gte(R.__, parseInt(this.state.minFpsFilter, 10));
    }

    if (Object.keys(predicate).length) {
      const filteredResolutions = whereResults(predicate, this.props);
      if (filteredResolutions && filteredResolutions.resolutions) {
        filtered = filteredResolutions.resolutions;
      }
    } else {
      filtered = resolutions;
    }

    if (filtered) {
      // If find my system clicked && currentSystem exists,
      // the panel to which the current system belongs might not
      // exist because it has been removed by filtering.
      // Create the resolution and empty profiles collection
      // so that the current system has somewhere to go.
      if (currentSystem) {
        const existingResolutionNode = _.findWhere(filtered, {
          resolution: currentSystem.resolution
        });

        if (!existingResolutionNode) {
          const resolution = {
            resolution: currentSystem.resolution,
            profiles: [{ profileId: currentSystem.profileId, results: [] }]
          };

          // the Resolution component will
          // add the current system to this resolution node
          filtered.push(resolution);

          // sort again because we added the missing resolution to the end of the array
          filtered = _.sortBy(filtered, f => {
            return f.resolution;
          }).reverse();
        } else {
          // do we have the resolution panel, but not the profile?

          if (!existingResolutionNode.profiles) {
            existingResolutionNode.profiles = [];
          }

          const existingProfileNode = _.findWhere(
            existingResolutionNode.profiles,
            {
              profileId: currentSystem.profileId
            }
          );

          if (!existingProfileNode) {
            existingResolutionNode.profiles.push({
              profileId: currentSystem.profileId,
              results: []
            });
          }
        }
      }

      resolutionEntries = filtered.map(function(resolution, i) {
        const data = Object.assign({}, resolution, {
          totalRecords,
          expanded,
          currentSystem
        });

        return <Resolution data={data} key={data.resolution} />;
      }, this);
    }

    const dateLastUpdateHuman = moment(dateLastUpdate).format();

    return (
      <div className={styles.benchmarksWrapper}>
        {this.renderFilters()}
        <div>
          <div className="container">
            <div className={editorialStyles.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxLast}>
                  <div className={editorialStyles.editorialBoxHeading}>
                    System Benchmarks
                  </div>
                  <div className={editorialStyles.editorialBoxContent}>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xs-12">
                          <div className={styles.systemsCount}>
                            {totalRecords}
                          </div>
                          <div className={styles.systemsCountSubheading}>
                            Systems with 5+ logs where min FPS >= 10)
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12">
                          <div className={styles.lastUpdateTime}>
                            Last Updated: {dateLastUpdateHuman}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={editorialStyles.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxLast}>
                  <div className={editorialStyles.editorialBoxContent}>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xs-12 col-sm-8">
                          <input
                            id="searchTermsInput"
                            type="text"
                            maxLength="128"
                            placeholder="Example: laptop"
                            className="form-control"
                            onKeyUp={this.handleSearchInputKeyPress}
                          />
                          <span
                            id="searchTermsInputHelp"
                            className={styles.searchFormHelp}
                          >
                            Multile search words are ORed. Filters always apply.
                          </span>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                          <button
                            type="button"
                            className="btn btn-primary btn-md"
                            style={{ width: '12rem' }}
                            onClick={this.handleSearchClick}
                          >
                            Search
                          </button>&nbsp;{this.renderFindMySystemControls(
                            currentSystem
                          )}
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
