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
      <div className={styles.filters}>
        <div className="container">
          <div className="row">            
              <h2>Filter by</h2>            
          </div>
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
                    value="-1"
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
                  />
                  <label htmlFor="platform3">iOS</label>
                </div>
                <div>
                  <input
                    id="platform4"
                    name="platformFilter"
                    type="radio"
                    className={styles.withfont}
                    value="Aliens"
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
                    value="-1"
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
                  />
                  <label htmlFor="resolution4">750</label>
                </div>
                <div>
                  <input
                    id="resolution5"
                    name="resolutionFilter"
                    type="radio"
                    className={styles.withfont}
                    value="720"
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
                    value="-1"
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
                  />
                  <label htmlFor="profile4">Basic</label>
                </div>
              </div>
            </div> 
            <div className="col-xs-12 col-sm-2">
              <h3>CPU Brand</h3>
              <div className={styles.formContainer}>
                <div>
                  <input
                    id="cpu0"
                    name="cpuFilter"
                    type="radio"
                    className={styles.withfont}
                    value="-1"
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
                  />
                  <label htmlFor="cpu3">ARM</label>
                </div>                
              </div>
            </div>          
            <div className="col-xs-12 col-sm-2">
              <h3>GPU Brand</h3>
              <div className={styles.formContainer}>
                <div>
                  <input
                    id="gpu0"
                    name="gpuFilter"
                    type="radio"
                    className={styles.withfont}
                    value="-1"
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
                  />
                  <label htmlFor="gpu1">Nvidia</label>
                </div>
                <div>
                  <input
                    id="gpu2"
                    name="gpuFilter"
                    type="radio"
                    className={styles.withfont}
                    value="amd"
                  />
                  <label htmlFor="gpu2">AMD</label>
                </div>
                <div>
                  <input
                    id="gpu3"
                    name="gpuFilter"
                    type="radio"
                    className={styles.withfont}
                    value="apple"
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
                    value="0"
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
                  />
                  <label htmlFor="fps1">&ge; 60</label>
                </div>
                 <div>
                  <input
                    id="fps2"
                    name="fpsFilter"
                    type="radio"
                    className={styles.withfont}
                    value="45"
                  />
                  <label htmlFor="fps2">&ge; 45</label>
                </div>
                <div>
                  <input
                    id="fps3"
                    name="fpsFilter"
                    type="radio"
                    className={styles.withfont}
                    value="30"
                  />
                  <label htmlFor="fps3">&ge; 30</label>
                </div>
                <div>
                  <input
                    id="fps4"
                    name="fpsFilter"
                    type="radio"
                    className={styles.withfont}
                    value="15"
                  />
                  <label htmlFor="fps4">&ge; 15</label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-5 col-xs-2">
              <div className={styles.toggleFiltersHandle}>
                <i className="fa fa-align-justify" aria-hidden="true"></i>
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
      <div className={styles.benchmarksOuter}>        
        {this.renderFilters()}
        <div className={styles.benchmarksContainer}>
          <div className="container">
            <div className={editorialStyles.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxLast}>
                  <div className={editorialStyles.editorialBoxHeading}>
                    Zwift System Benchmarks
                  </div>
                  <div className={editorialStyles.editorialBoxContent}>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xs-12">
                          <div className={styles.systemsCount}>
                            {totalRecords}
                          </div>
                          <div className={styles.systemsCountSubheading}>
                            Systems (with 7+ logs)
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
