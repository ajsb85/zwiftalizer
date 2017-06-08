var _ = require('underscore');
import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import structure from '../../styles/structure.css';
import editorial from '../../styles/editorial.css';
import {
  closeUnknownSmartTrainerModelModal,
  postAntDevice,
  setAntDevices
} from '../../actions/parse.js';

import { SMART_TRAINER_DEVICE } from '../../parser/constants';

class SmartTrainerNameModal extends React.Component {
  constructor(props) {
    super(props);

    const { devices } = this.props;

    const smartTrainerDevice = _.find(devices, device => {
      return device.type === SMART_TRAINER_DEVICE;
    });

    this.state = {
      manufacturerName: smartTrainerDevice
        ? smartTrainerDevice.manufacturer
        : '',
      modelName: smartTrainerDevice ? smartTrainerDevice.model : '',
      smartTrainerDevice: smartTrainerDevice,
      devices: devices,
      manufacturerHasError: false,
      modelHasError: false
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleManufacturerNameChange = this.handleManufacturerNameChange.bind(
      this
    );
    this.handleModelNameChange = this.handleModelNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  closeModal() {
    // this.setState({ unknownPowermeterModel: false });
    const { dispatch } = this.props;
    dispatch(closeUnknownSmartTrainerModelModal());
  }

  handleManufacturerNameChange(e) {
    const val = e.target.value.trim();
    this.setState({ manufacturerName: val });
    this.setState({
      manufacturerHasError: _.isNull(val) || _.isUndefined(val) || val === ''
    });
  }

  handleModelNameChange(e) {
    const val = e.target.value.trim();
    this.setState({ modelName: val });
    this.setState({
      modelHasError: _.isNull(val) || _.isUndefined(val) || val === ''
    });
  }

  handleSubmit(e) {
    //prevent the default form submit behavior
    e.preventDefault();

    // probably unreachable, except for in testing
    if (!this.state.smartTrainerDevice) {
      return;
    }

    const { dispatch } = this.props;

    if (!this.state.manufacturerName || !this.state.modelName) {
      return;
    }

    if (
      this.state.manufacturerName.toLowerCase() === 'unknown' ||
      this.state.modelName.toLowerCase() === 'unknown'
    ) {
      return;
    }

    this.state.smartTrainerDevice.manufacturer = this.state.manufacturerName;

    this.state.smartTrainerDevice.model = this.state.modelName;

    // This posts the device details to AWS Lambda which get emailed to the maintainer
    // of the zwitalizer-antplus-devices device lookups.
    dispatch(postAntDevice(this.state.smartTrainerDevice));

    // This will update the charts UI with the values the user entered.
    // Also, gives the current module's managed state.devices back to redux's
    // state.devices, because I'm not certain this.state.devices is
    // a value copy or reference to the state in redux
    dispatch(setAntDevices(this.state.devices));

    // delayed to allow for rendering before closing the modal
    // (so that the device name is already there when the modal closes, no flicker)
    setTimeout(
      () => {
        dispatch(closeUnknownSmartTrainerModelModal());
      },
      150
    );
  }

  render() {
    // probably unreachable, except for in testing
    if (!this.state.smartTrainerDevice) {
      return null;
    }

    const marginTopAndBottom = { marginTop: '2rem', marginBottom: '2rem' };

    const { showUnknownSmartTrainerModelModal } = this.props;

    let manufacturerFormGroupClassName = 'form-group has-feedback';

    let manufacturerNameTick = (
      <span
        className="glyphicon glyphicon-remove  form-control-feedback"
        aria-hidden="true"
      />
    );

    if (this.state.manufacturerHasError) {
      manufacturerFormGroupClassName += ' has-error';
    } else {
      manufacturerFormGroupClassName += ' has-success';
      manufacturerNameTick = (
        <span
          className="glyphicon glyphicon-ok form-control-feedback"
          aria-hidden="true"
        />
      );
    }

    let modelFormGroupClassName = 'form-group has-feedback';

    let modelNameTick = (
      <span
        className="glyphicon glyphicon-remove  form-control-feedback"
        aria-hidden="true"
      />
    );

    if (this.state.modelHasError) {
      modelFormGroupClassName += ' has-error';
    } else {
      modelFormGroupClassName += ' has-success';
      modelNameTick = (
        <span
          className="glyphicon glyphicon-ok form-control-feedback"
          aria-hidden="true"
        />
      );
    }

    return (
      <Modal
        show={showUnknownSmartTrainerModelModal}
        onHide={this.closeModal}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            What's the make and model of your smart trainer?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
            <div className="container-fluid">
              <div className="row" style={marginTopAndBottom}>
                <div className="col-xs-offset-1 col-xs-10">
                  <p>
                    We were unable to identify your smart trainer.
                  </p>
                  <p>
                    Can you help fix the Zwiftalizer by typing its name?
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">
                  <div className={manufacturerFormGroupClassName}>
                    <label htmlFor="manufacturerName">Make</label>
                    <input
                      id="manufacturerName"
                      type="text"
                      maxLength="64"
                      placeholder="Example: Tacx, Wahoo, Elite, CycleOps, etc"
                      className="form-control"
                      onChange={this.handleManufacturerNameChange}
                      value={this.state.manufacturerName}
                    />
                    {manufacturerNameTick}
                    <span id="manufacturerNameHelp" className="help-block">
                      The brand name of your smart trainer - Tacx, Wahoo, Elite, CycleOps, etc
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">
                  <div className={modelFormGroupClassName}>
                    <label htmlFor="model">Model</label>
                    <input
                      id="model"
                      type="text"
                      maxLength="64"
                      placeholder="Example: Neo, Kickr, Drivo, Hammer, etc"
                      className="form-control"
                      onChange={this.handleModelNameChange}
                      value={this.state.modelName}
                    />
                    {modelNameTick}
                    <span id="modelNameHelp" className="help-block">
                      The model name of your smart trainer - Neo, Kickr, Drivo, Hammer, etc
                    </span>
                  </div>
                </div>
              </div>
              <div className="row" style={marginTopAndBottom}>
                <div className="col-xs-offset-1 col-xs-10">
                  <div className="btn-group pull-right">
                    <Button bsStyle="primary" bsSize="lg" type="submit">
                      Submit
                    </Button>
                    <Button
                      bsStyle="default"
                      bsSize="lg"
                      type="button"
                      onClick={this.closeModal}
                    >
                      Cancel
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

SmartTrainerNameModal.propTypes = {
  ant: PropTypes.object
};

export default connect(mapStateToProps)(SmartTrainerNameModal);
