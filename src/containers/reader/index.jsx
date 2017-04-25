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
import Dropzone from 'react-dropzone';
import Confetti from 'react-dom-confetti';
import { readFile, reset } from '../../actions/parse';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import editorial from '../../styles/editorial.css';

import { setPreferences } from '../../actions/preferences';

class Reader extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.openDbUploadExplanationModal = this.openDbUploadExplanationModal.bind(
      this
    );
    this.closeDbUploadExplanationModal = this.closeDbUploadExplanationModal.bind(
      this
    );
   
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.state = {
      showDbUploadExplanationModal: false      
    };
  }

  handleCheckboxChange(e) {
    const { dispatch } = this.props;
    dispatch(setPreferences({ share: e.target.checked }));
  }

  openDbUploadExplanationModal(e) {
    e.preventDefault();
    this.setState({ showDbUploadExplanationModal: true });
  }

  closeDbUploadExplanationModal() {
    this.setState({ showDbUploadExplanationModal: false });
  }

  render() {
    const { isLoading, isLoaded, share } = this.props;

    const dropBoxStyle = isLoaded
      ? {
          height: '7rem'
        }
      : {
          height: '50rem'
        };

    const dropBoxInnerStyle = isLoaded
      ? {
          height: '6rem'
        }
      : {
          height: '14rem'
        };

    const instructionsDiv = isLoading
      ? null
      : <div>
          <div className={styles.headingIcon}>
            <i className="fa fa-download" />
          </div>
          <div className={styles.heading}>Drop Log.txt file or browse</div>
          <div className={styles.subHeading}>
            (Log.txt is in %USER%\Documents\Zwift\Logs)
          </div>
        </div>;

    const spinnerDiv = isLoading ? <div className={styles.spinner} /> : null;

    const messageDiv = isLoading
      ? <div className={styles.messageContainer}>
          Reading file ...
        </div>
      : null;

    const shareStatus = share ? 'checked' : '';

    const showConfetti = isLoaded && share;

    const confettiConfig = {
      angle: 90,
      spread: 90,
      startVelocity: 26,
      elementCount: 76,
      decay: 0.95
    };

    return (
      <div className={styles.root}>
        <div className="container">
          <div className="row">
            <div className="hidden-xs col-sm-12">
              <div className="center-block">
                <div className="text-center">
                  <div className={styles.checkboxWrapper}>
                    <div className={styles.checkbox}>
                      <input
                        id="shareCheckbox"
                        type="checkbox"
                        onChange={this.handleCheckboxChange}
                        checked={shareStatus}
                      />
                      <label htmlFor="shareCheckbox" />
                    </div>
                  </div>
                  <h2 className={styles.checkboxLabel}>                    
                    Include my results in the database &nbsp;<a
                      href=""
                      onClick={this.openDbUploadExplanationModal}
                    >
                      <span className={styles.infoCircle}>
                        <i
                          className="fa fa-question-circle"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <Dropzone
                onDrop={this.onDrop}
                multiple={false}
                accept="text/plain"
                className={styles.default}
                activeClassName={styles.active}
                rejectClassName={styles.reject}
                style={dropBoxStyle}
              >
                <div className={styles.dropboxInner} style={dropBoxInnerStyle}>
                  {instructionsDiv}
                  {spinnerDiv}
                  {messageDiv}
                </div>
              </Dropzone>
              <div className={styles.confettiContainer}>
                <Confetti active={showConfetti} config={confettiConfig} />
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={this.state.showDbUploadExplanationModal}
          onHide={this.closeDbUploadExplanationModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Data Collection and Privacy Policy
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className={editorial.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxLast}>
                  <div className={editorial.editorialBoxHeading}>
                    What happens when the box is checked?
                  </div>
                  <div className={editorial.editorialBoxContent}>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xs-12">

                          <p>
                            Check the box if you want to upload the

                            <strong>results</strong>

                            of reading your log file to the database.
                          </p>

                          <p>
                            <strong>Why would I do that?</strong> <br />
                            Uploads

                            <strong>create reports</strong>

                            to help the community make informed purchasing decisions.
                          </p>

                          <p>
                            <strong>Do you keep my full log?</strong> <br />
                            <strong>No. Never. Absolutely not.</strong>

                            It isn't necessary and I don't want the responsibility of securing personally identifiable information (plausible deniability).
                          </p>

                          <p>
                            <strong>Is the data anonymous?</strong> <br />
                            <strong>Yes.</strong>

                            Personally Identifiable Information (PII) is

                            <strong>NOT</strong>

                            used or stored in the database.
                          </p>

                          <ul>
                            <li>
                              Your Zwift userid is

                              <strong>NEVER</strong>

                              read or stored.
                            </li>
                            <li>
                              The email address you use with Zwift is

                              <strong>NEVER</strong>

                              read or stored.
                            </li>
                            <li>
                              Your IP address is used to do an approximate location lookup for grouping the power sources report by country.
                            </li>
                            <li>
                              The Zwiftalizer will

                              <strong>NEVER</strong>

                              ask for your Zwift username or password.
                            </li>
                          </ul>

                          <p>
                            The following data is uploaded:
                          </p>

                          <div className="row">
                            <div className="col-xs-12 col-sm-6">
                              <ul>
                                <li>Platform - PC, Mac or iOS</li>
                                <li>CPU Vendor - Intel, AMD or ARM</li>
                                <li>
                                  CPU Details - e.g. Core i5 4690K @ 3.5GHz
                                </li>
                                <li>
                                  GPU Vendor - e.g. Nvidia, AMD, Intel, ARM
                                </li>
                                <li>
                                  GPU Details - e.g. GeForce GTX 970/PCIe/SSE2
                                </li>
                                <li>OpenGl Major Version - e.g. 3.1.0</li>
                                <li>RAM - e.g. 8 GB</li>
                                <li>
                                  Graphics Resolution - 2160, 1080, 720 or 576
                                </li>
                                <li>
                                  Shadow Resolution - 2048, 1024 or 512
                                </li>
                                <li>
                                  Graphics Profile - Ultra, High, Medium or Basic
                                </li>
                                <li>Maximum FPS</li>
                                <li>Average FPS</li>
                                <li>Minimum FPS</li>
                              </ul>
                            </div>
                            <div className="col-xs-12 col-sm-6">
                              <ul>
                                <li>FPS Standard Deviation</li>
                                <li>Number of FPS samples</li>
                                <li>If available: </li>
                                <li>Smart Trainer ANT+ Manufacturer Id</li>
                                <li>Smart Trainer ANT+ Manufacturer Name</li>
                                <li>Smart Trainer ANT+ Model Id</li>
                                <li>Smart Trainer ANT+ Model Name</li>
                                <li>
                                  Smart Trainer ANT+ device id <sup>*</sup>
                                </li>
                                <li>Powermeter ANT+ Manufacturer Id</li>
                                <li>Powermeter ANT+ Manufacturer Name</li>
                                <li>Powermeter ANT+ Model Id</li>
                                <li>Powermeter ANT+ Model Name</li>
                                <li>Powermeter ANT+ device id <sup>*</sup></li>
                                <li>
                                  Your IP Address - used only to report power source usage by country
                                </li>
                              </ul>
                            </div>
                          </div>
                          <p>
                            * The ANT+ device id is a unique number given to your Smart Trainer or Powermeter by the device manufacturer. By storing this number in the database, your smart trainer and/or powermeter is counted only once in the power sources report regardless of how many times you use this tool.
                          </p>

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
              onClick={this.closeDbUploadExplanationModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>       
      </div>
    );
  }

  onDrop(files) {
    const { dispatch, isLoaded, share } = this.props;

    if (isLoaded) {
      dispatch(reset());
    }

    //@todo, raise warning if the file does not appear to be a log file (dropping the launcher log is a common error) delayed so that the state can update the loading message
    setTimeout(
      () => {
        dispatch(readFile(files[0], share));
      },
      250
    );
  }
}

function mapStateToProps(state) {
  const { reader, preferences } = state;
  return {
    ...reader,
    ...preferences
  };
}

Reader.propTypes = {
  reader: PropTypes.object
};

export default connect(mapStateToProps)(Reader);
