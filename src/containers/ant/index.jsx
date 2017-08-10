/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import structure from '../../styles/structure.css';
import { Chart } from './chart.jsx';
import editorial from '../../styles/editorial.css';
import PowerMeterNameModal from './powerMeterNameModal.jsx';
import SmartTrainerNameModal from './smartTrainerNameModal.jsx';

class Ant extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('Ant::render');
    console.log(this.props);

    const { isLoaded } = this.props;

    return isLoaded ? this.renderDevices() : null;
  }

  renderDevices() {
    const { devices, searches } = this.props;

    const markup = devices && devices.length
      ? <Chart devices={devices} searches={searches} />
      : <div className="row" style={{height:"30rem"}}>
          <div className="col-sm-12">
            <h3 className={structure.sectionSubHeading}>No devices found</h3>
          </div>
        </div>;

    return (
      <div className="container">
        {markup}       
        <PowerMeterNameModal/> 
        <SmartTrainerNameModal/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reader, ant } = state;
  return {
    ...reader,
    ...ant
  };
}

Ant.propTypes = {
  reader: PropTypes.object,
  ant: PropTypes.object
};

export default connect(mapStateToProps)(Ant);
