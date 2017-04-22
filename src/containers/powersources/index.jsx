import { load } from '../../actions/powerSources';
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
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

    var regionEntries = data.regions &&
      data.regions.map(
        function(region, i) {
          return <Region data={region} key={region.countryCode} />;
        },
        this
      );

    return (
      <div className="container">

        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>
                Proportion of Smart Trainers and Powermeters
              </div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-offset-1 col-xs-10">
                      <h3>Caveats</h3>
                      <ul>
                        <li>Only devices paired using ANT+ are included.</li>
                        <li>Sampling started on May 1st 2017.</li>
                        <li>A power source is identified by its unique ANT+ ID, manufacturer ID, and model ID.</li>
                        <li>A power source is counted only once regardless of how many times its owner uses this tool.</li>
                        <li>Country is identified by the IP address of the user of this tool.</li>
                      </ul>                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {regionEntries}
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
