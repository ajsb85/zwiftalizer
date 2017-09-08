import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
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

  handleNewIssueClick(e) {
    e.stopPropagation();
    console.log('handleNewIssueClick');
  }

  render() {
    const { isLoading, isLoaded, isFailure, share } = this.props;

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
          height: '16rem'
        };

    let messageDiv = null;

    let instructionsDiv = null;

    if (!isLoading && !isFailure) {
      instructionsDiv = (
        <div>
          <div className={styles.headingIcon}>
            <i className="fa fa-download" />
          </div>
          <div className={styles.heading}>Drop Log.txt file or browse</div>
          <div className={styles.subHeading}>
            (Log.txt is in %USER%\Documents\Zwift\Logs)
          </div>
        </div>
      );
    }

    const spinnerDiv = isLoading ? <div className={styles.spinner} /> : null;

    if (isLoading) {
      messageDiv = (
        <div className={styles.messageContainer}>
          Reading file ...
        </div>
      );
    }

    if (isFailure) {
      messageDiv = (
        <div className={styles.errorContainer}>          
          Sorry, an error occurred reading the log file.<br/><br/>
          Please report this as a <a href="https://github.com/mhanney/zwiftalizer/issues/new" target="_blank" onClick={this.handleNewIssueClick}>new issue</a> and attach the log that failed.
        </div>
      );
    }

    const shareStatus = share ? 'checked' : '';
    
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
                    I agree to share my system specs &nbsp;<a href="" onClick={this.openDbUploadExplanationModal}><span className={styles.infoCircle}><i className="fa fa-question-circle" aria-hidden="true"/></span></a>
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
            </div>
          </div>
        </div>

        <Modal
          show={this.state.showDbUploadExplanationModal}
          onHide={this.closeDbUploadExplanationModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Data collection and privacy policy
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className={editorial.editorialBoxContentTransparent}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-12">
                    <h3>
                      What happens when the box is checked?
                    </h3>
                    <p>
                      With the 'I agree' box checked, your system specs get uploaded to the database in the background. This box must be checked BEFORE loading a log file. Checking it after loading a log file has no affect.
                    </p>

                    <h3>Why would I want to upload my specs?</h3>
                    <p>
                      Uploads contribute to the benchmarks and power sources reports that help the community make informed purchasing decisions.
                    </p>

                    <h3>Is my log file sent to a server?</h3>
                    <p>
                      No. I don't need them and I don't want the responsibility of securing PII (Personally Identifiable Information). All processing is done by JavaScript running in your web browser. The results are sent to a database over secure HTTPS.
                    </p>

                    <h3>Is the data anonymous?</h3>
                    <p>
                      Yes. PII is NOT used or stored in the database. Your IP address is used to do an approximate location lookup for grouping the power sources report by country. Your Zwift userid is NEVER read. The email address you use with Zwift is NEVER read. The Zwiftalizer will NEVER ask for your Zwift username or password.
                    </p>
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
                            Graphics Resolution - 2160, 1440, 1080, etc
                          </li>
                          <li>
                            Shadow Resolution - 2048, 1024, 512, etc
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
                          <li>IP Address</li>
                        </ul>
                      </div>
                    </div>
                    <p className={editorial.footnote}>
                      * The ANT+ device id is a unique number given to your Smart Trainer or Power meter by the device manufacturer. By storing this number in the database, your smart trainer or powermeter is counted only once in the power sources report regardless of how many times you use this tool.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={this.closeDbUploadExplanationModal}
            >
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
