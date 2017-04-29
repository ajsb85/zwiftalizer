var _ = require('underscore');
import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import structure from '../../styles/structure.css';
import editorial from '../../styles/editorial.css';
import {
  closeUnknownPowermeterModelModal,
  postAntDevice,
  setAntDevices
} from '../../actions/parse.js';

import { POWER_METER_DEVICE } from '../../parser/constants';

class PowermeterNameModal extends React.Component {
  constructor(props) {
    super(props);

    const { devices } = this.props;

    const powerDevice = _.find(devices, device => {
      return device.type === POWER_METER_DEVICE;
    });

    this.state = {      
      manufacturerName: powerDevice ? powerDevice.manufacturer : '',
      modelName: powerDevice ? powerDevice.model : '',
      powerDevice: powerDevice
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleManufacturerNameChange = this.handleManufacturerNameChange.bind(this);
    this.handleModelNameChange = this.handleModelNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  closeModal() {
    // this.setState({ unknownPowermeterModel: false });
    const { dispatch } = this.props;
    dispatch(closeUnknownPowermeterModelModal());
  }

  handleManufacturerNameChange(e) {
    console.log(e.target.value);
    this.setState({ manufacturerName: e.target.value });
  }

  handleModelNameChange(e) {
    console.log(e.target.value);
    this.setState({ modelName: e.target.value });
  }

  handleSubmit(e) {
    //prevent the default form submit behavior
    e.preventDefault();

    const { dispatch, devices } = this.props;

    const manufacturerName = this.state.manufacturerName.trim();

    const modelName = this.state.modelName.trim();

    if (!manufacturerName || !modelName) {
      return;
    }
    if (!this.state.powerDevice) {
      return;
    }

    this.state.powerDevice.manufacturer = manufacturerName;

    this.state.powerDevice.model = modelName;

    // This posts the device details to AWS Lambda which get emailed to the maintainer
    // of the zwitalizer-antplus-devices device lookups.     
    dispatch(postAntDevice(this.state.powerDevice));

    // this will update the charts UI with the values the user entered
    dispatch(setAntDevices(devices));

    // delayed to allow for rendering before closing the modal
    // (so that the device name is already there when the modal closes, no flicker)
    setTimeout(
      () => {
        dispatch(closeUnknownPowermeterModelModal());
      },
      200
    );
  }

  render() {
    const { showUnknownPowermeterModelModal } = this.props;

    return (
      <Modal show={showUnknownPowermeterModelModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            What's the make and model of your power meter?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">
                  <div className="form-group">
                    <label htmlFor="manufacturerName">Make</label>
                    <input
                      id="manufacturerName"
                      type="text"
                      placeholder="Example: PowerTap, Quarq, Favero, etc"
                      className="form-control"
                      onChange={this.handleManufacturerNameChange}
                      value={this.state.manufacturerName}                     
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">
                  <div className="form-group">
                    <label htmlFor="model">Model</label>
                    <input
                      id="model"
                      type="text"
                      maxLength="64"
                      placeholder="Example: G3, DZero, BePro, etc"
                      className="form-control"
                      onChange={this.handleModelNameChange}
                      value={this.state.modelName}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">
                  <div className="form-group pull-right">
                    <Button bsStyle="primary" type="submit">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { ant } = state;
  return {
    ...ant
  };
}

PowermeterNameModal.propTypes = {
  ant: PropTypes.object
};

export default connect(mapStateToProps)(PowermeterNameModal);
