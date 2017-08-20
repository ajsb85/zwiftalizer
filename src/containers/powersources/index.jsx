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

    setTimeout(() => {
      dispatch(load());
    }, 100);
  }

  render() {
    const { isLoaded } = this.props;

    return isLoaded ? this.renderPowersources() : null;
  }

  renderPowersources() {
    const { data, dateLastUpdate } = this.props;

    const minSampleSize = 25;

    let powermetersTotal = 0;

    let smartTrainersTotal = 0;

    let regionNodes = [];

    const worldwideCode = '00';

    if (data.regions) {
      const worldwide = R.find(R.propEq('countryCode', worldwideCode))(
        data.regions
      );

      if (worldwide.powermeters) {
        powermetersTotal = worldwide.powermeters.total;
      }

      if (worldwide.smartTrainers) {
        smartTrainersTotal = worldwide.smartTrainers.total;
      }

      if (worldwide) {
        regionNodes.push(
          <Region data={worldwide} key={worldwide.countryCode} />
        );
      }

      data.regions.map(function(region, i) {
        if (
          region.countryCode !== worldwideCode &&
          ((region.powermeters &&
            region.powermeters.total &&
            region.powermeters.total >= minSampleSize) ||
            (region.smartTrainers &&
              region.smartTrainers.total &&
              region.smartTrainers.total >= minSampleSize))
        ) {
          regionNodes.push(<Region data={region} key={region.countryCode} />);
        }
      }, this);
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
                    <div className={styles.systemsCountSubheading}>
                      Devices by country available where devices sample size >= {minSampleSize}
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
              <div className={editorial.editorialBoxHeading}>Caveats</div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-offset-1 col-xs-10">
                      <ul>
                        <li>Only devices paired using ANT+ are included.</li>
                        <li>
                          A power source is identified by its unique
                          manufacturer ID, model ID and device ID combined key.
                        </li>
                        <li>
                          A power source is never counted more than once
                          regardless of how many times it is seen by this tool.
                        </li>
                        <li>
                          Country is identified by the IP address of the user
                          who uploaded a log using this tool.
                        </li>
                        <li>
                          Personal identifiable information is never used.
                        </li>
                        <li>
                          The following Saris devices are grouped together as
                          'Wireless' PowertTap power meters: PowerTap SLC+,
                          PowerTap SL+, PowerTap Pro+, PowerTap Elite+, and
                          PowerTap 2.4+ hub based power meters; PowerBeam Pro
                          and PowerSync trainers; 400 Pro, 300 Pro, 200 Pro, 100
                          Pro, Phantom 3 and Phantom 5 Indoor Cycles.
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
