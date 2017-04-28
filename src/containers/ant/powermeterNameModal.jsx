import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import structure from '../../styles/structure.css';
import { Chart } from './chart.jsx';
import editorial from '../../styles/editorial.css';
import { closeUnknownPowermeterModelModal } from '../../actions/parse.js';

class PowermeterNameModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      powerMeterName: ''
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  closeModal() {
    // this.setState({ unknownPowermeterModel: false });
    const { dispatch } = this.props;
    dispatch(closeUnknownPowermeterModelModal());
  }

  handleChange(e) {
    console.log(e.target.value);
    this.setState({ powerMeterName: e.target.value });
  }

  handleSubmit(e) {
    //prevent the default form submit behavior
    e.preventDefault();

    const powerMeterName = this.state.powerMeterName.trim();

    console.log(powerMeterName);

    if (!powerMeterName) {
      return;
    }

    
  }

  render() {
    const { showUnknownPowermeterModelModal } = this.props;

    return (
      <Modal show={showUnknownPowermeterModelModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            What's the model name of your power meter?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">
                  <div className="form-group">
                    <label htmlFor="manufacturerReadOnly">Manufacturer</label>
                    <input
                      id="manufacturerReadOnly"
                      type="text"
                      placeholder="Quarq"
                      className="form-control"
                      readOnly="readonly"
                      disabled="disabled"
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
                      placeholder="Model Name"
                      className="form-control"
                      onChange={this.handleChange}
                      value={this.state.powerMeterName}
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
