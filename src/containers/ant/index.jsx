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
  }

  closeUnknownPowerSourceModal() {
    // this.setState({ unknownPowermeterModel: false });
    const { dispatch } = this.props;
    dispatch(closeUnknownPowermeterModelModal());
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
              Unknown Power Source Model Name
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className={editorial.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxLast}>
                  <div className={editorial.editorialBoxHeading}>
                    What's the model name of your power meter?
                  </div>
                  <div className={editorial.editorialBoxContent}>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xs-12">
                          Hello World
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={this.closeUnknownPowerSourceModal}
            >
              Close
            </Button>
          </Modal.Footer>
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
