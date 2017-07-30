var moment = require('moment');
import { load } from '../../actions/powerSources';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const R = require('ramda');
import Region from './region.jsx';
import structure from '../../styles/structure.css';
import editorial from '../../styles/editorial.css';
import styles from './styles.css';

class PowerSources extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;

    setTimeout(
      () => {
        dispatch(load());
      },
      100
    );
  }

  render() {
    const { isLoaded } = this.props;

    return isLoaded ? this.renderPowersources() : null;
  }

  renderPowersources() {
    const {
      data,
      dateLastUpdate
    } = this.props;

    let powermetersTotal = 0;

    let smartTrainersTotal = 0;

    let regionNodes = [];

    const worldwideCode = '00';

    if (data.regions) {
      const worldwide = R.find(R.propEq('countryCode', worldwideCode))(data.regions);

      if (worldwide.powermeters) {
        powermetersTotal = worldwide.powermeters.total;
      }

      if (worldwide.smartTrainers) {
        smartTrainersTotal = worldwide.smartTrainers.total;
      }

      if (worldwide) {
        regionNodes.push(<Region data={worldwide} key={worldwide.countryCode} />);
      }

      data.regions.map(
        function(region, i) {
          if (region.countryCode !== worldwideCode) {
            regionNodes.push(<Region data={region} key={region.countryCode} />);
          }
        },
        this
      );
    }

    const totalDevices = powermetersTotal + smartTrainersTotal;

    const dateLastUpdateHuman = moment(dateLastUpdate).format();

    return (
      <div className="container">        
        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>
                Smart trainers and power meters usage
              </div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className={styles.systemsCount}>
                        {totalDevices}
                      </div>                      
                    </div>
                    <div className={styles.systemsCountSubheading}>
                      Distinct ANT+ devices logged
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
        {regionNodes}
        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>
                Caveats
              </div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-offset-1 col-xs-10">                      
                      <ul>
                        <li>Only devices paired using ANT+ are included.</li>                        
                        <li>
                          A power source is identified by its unique manufacturer ID, model ID and device ID combined key.
                        </li>
                        <li>
                          A power source is never counted more than once regardless of how many times it is seen by this tool.
                        </li>
                        <li>
                          Country is identified by the IP address of the user who uploaded a log using this tool.
                        </li>
                        <li>
                          Personal identifiable information is never used.
                        </li>
                        <li>
                          CycleOps PowerBeam, PowerSync, Phantom 3, Phantom 5, PowertTap Pro+, PowertTap SLC+ and PowertTap SL+ are grouped together as 'Wireless' PowertTap power meters.
                        </li>
                        <li>
                          Since people use this tool to inspect ANT+ signal issues, it could be argued that the most popular power sources listed here are actually the most problematic.
                        </li>
                        <li>Sampling started May 15th 2017.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { powerSources } = state;
  return {
    ...powerSources
  };
}

PowerSources.propTypes = {
  powerSources: PropTypes.object
};

export default connect(mapStateToProps)(PowerSources);
