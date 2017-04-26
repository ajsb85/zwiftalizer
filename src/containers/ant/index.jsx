/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import structure from '../../styles/structure.css';
import { Chart } from './chart.jsx';
import editorial from '../../styles/editorial.css';
import { closeUnknownPowermeterModelModal } from '../../actions/parse.js';

class Ant extends React.Component {
  constructor(props) {
    super(props);
    this.closeUnknownPowerSourceModal = this.closeUnknownPowerSourceModal.bind(
      this
    );
    this.submitPowerSourceForm = this.submitPowerSourceForm.bind(this);
  }

  closeUnknownPowerSourceModal() {
    // this.setState({ unknownPowermeterModel: false });
    const { dispatch } = this.props;
    dispatch(closeUnknownPowermeterModelModal());
  }

  submitPowerSourceForm() {
    console.log('submit form');
  }

  render() {
    const { isLoaded } = this.props;

    return isLoaded ? this.renderDevices() : null;
  }

  renderDevices() {
    const { devices, searches, showUnknownPowermeterModelModal } = this.props;

    const markup = devices && devices.length
      ? <Chart devices={devices} searches={searches} />
      : <div className="row">
          <div className="col-sm-12">
            <h3 className={structure.sectionSubHeading}>No devices found</h3>
          </div>
        </div>;

    return (
      <div className="container">
        {markup}
        <Modal
          show={showUnknownPowermeterModelModal}
          onHide={this.closeUnknownPowerSourceModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              What's the model name of your power meter?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-offset-1 col-xs-10">            
                    <div className="form-group">
                      <label htmlFor="manufacturerReadOnly">Manufacturer</label>
                      <input id="manufacturerReadOnly" type="text" placeholder="Quarq" className="form-control" readOnly="readonly" disabled="disabled"></input>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-offset-1 col-xs-10">            
                    <div className="form-group">
                      <label htmlFor="model">Model</label>
                      <input id="model" type="text" className="form-control"></input>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-offset-1 col-xs-10">            
                    <div className="form-group pull-right">
                      <Button
                        bsStyle="primary"
                        onClick={this.submitPowerSourceForm}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>      
            </form>             
          </Modal.Body>
          
        </Modal>
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
