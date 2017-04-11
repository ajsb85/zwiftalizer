import { load } from '../../actions/powerSources';
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import structure from '../../styles/structure.css'
import editorial from '../../styles/editorial.css'

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
    return (
      <div className="container">
        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>Smart Trainer and Powermeter Usage</div>
              <div className={editorial.editorialBoxContent}>
                <div className="container">
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      <h3>Smart Trainer and Powermeter Usage</h3>
                      <p></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
