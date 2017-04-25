import { load } from '../../actions/powerSources';
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
const R = require('ramda');
import Region from './region.jsx';
import structure from '../../styles/structure.css';
import editorial from '../../styles/editorial.css';

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

    let regionNodes = [];

    const worldwideCode = '00';

    if (data.regions) {
      const worldwide = R.find(R.propEq('countryCode', worldwideCode))(data.regions);

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

    return (
      <div className="container">

        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>
                Proportion of Power Sources
              </div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-offset-1 col-xs-10">
                      <h3>Caveats</h3>
                      <ul>
                        <li>Only devices paired using ANT+ are included.</li>
                        <li>Sampling started on May 1st 2017.</li>
                        <li>
                          A power source is identified by its unique manufacturer ID, model ID and device ID compound key.
                        </li>
                        <li>
                          A power source is never counted more than once regardless of how many times it is seen by this tool.
                        </li>
                        <li>
                          Country is identified by the IP address of the user that examined a log using this tool.
                        </li>
                        <li>
                          Personal identifiable information is never used.
                        </li>
                        <li>
                          CycleOps PowerBeam, PowerSync, Phantom 3, Phantom 5, PowertTap Pro+ and PowertTap SL+ are grouped together as 'Wireless' PowertTap power meters (Id not available).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {regionNodes}
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
