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
                Smart Trainer and Powermeter distribution by region
              </div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-offset-1 col-xs-10">
                      <p>
                        Count of Smart Trainers and Powermeters, identified by unique ANT+ ID, grouped by make, model and geographical region.
                      </p>
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
