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
import { readFile, reset } from '../../actions/parse';
import structure from '../../styles/structure.css';
import styles from './styles.css';

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

    return (
      <div className={styles.root}>

        <div className="container">
          <div className="row">
            <div className="col-xs-12">

              <div className="alert alert-warning" role="alert">

                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-1">
                      <form>
                        <div className="form-group">
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
                        </div>
                      </form>

                    </div>
                    <div className="col-xs-12 col-sm-11">
                      <div className={styles.consentWrapper}>
                        <h2 className={styles.checkboxLabel}>
                          <span className={styles.checkboxLabelStrong}>
                            I agree
                          </span>
                          &nbsp;to my system summary being uploaded to the database.&nbsp;
                          <a
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
                        <p>
                          Uploading your summary data is entirely optional.&nbsp;                          
                        </p>
                      </div>
                    </div>
                  </div>
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
              What data is stored in the database?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-12">
                 
                  <h4>
                    By checking the box, you consent to the following data being stored
                  </h4>

                  <ul>
                    <li>Platform - e.g. PC, Mac, iOS</li>
                    <li>CPU Vendor - e.g. Intel, AMD, ARM</li>
                    <li>CPU Details - e.g. Pentium G3258 @ 3.20GHz</li>
                    <li>GPU Vendor - e.g. Nvidia, AMD, Intel, ARM</li>
                    <li>GPU Details - e.g. GeForce GTX 970/PCIe/SSE2</li>
                    <li>OpenGl Major Version - e.g. 3.1.0</li>
                    <li>RAM - e.g. 8 GB</li>
                    <li>Graphics Resolution - e.g. 2160, 1080, 720</li>
                    <li>
                      Graphics Shadow Resolution - e.g. 2048, 2014, 512
                    </li>
                    <li>Graphics Profile - e.g. Ultra, High, Medium, Basic</li>
                    <li>Maximum FPS</li>
                    <li>Average FPS</li>
                    <li>Minimum FPS</li>
                    <li>FPS Standard Deviation</li>
                    <li>Number of FPS samples</li>
                    <li>Smart Trainer Manufacturer Id, if available</li>  
                    <li>Smart Trainer Manufacturer Name, if available</li>  
                    <li>Smart Trainer Model Id, if available</li>  
                    <li>Smart Trainer Model Name, if available</li>  
                    <li>Smart Trainer ANT+ device id, if available <sup>*</sup></li>  
                    <li>Powermeter Manufacturer Id, if available</li>  
                    <li>Powermeter Manufacturer Name, if available</li>  
                    <li>Powermeter Model Id, if available</li>  
                    <li>Powermeter Model Name, if available</li>  
                    <li>Powermeter ANT+ device id, if available <sup>*</sup></li>  
                    <li>Your IP Address - used only to report power source usage by country</li>                      
                  </ul>

                  <p>* - The ANT+ device id is a unique number given to your Smart Trainer or Powermeter by the device manufacturer. By storing this number, each power source is counted once only in the usage report.
                  </p>
                  
                  <h4>
                    Your Personally Identifiable Information (PII) is <strong>never</strong> used.
                  </h4>

                  <ul>                 
                    <li>
                      Your Zwift userid is <strong>never</strong> used or stored in the database.
                    </li>
                    <li>
                      The email address you use with Zwift is <strong>never</strong> used or stored in the database.
                    </li>                    
                    <li>
                      The Zwiftalizer will <strong>never</strong> ask for your Zwift username or password.
                    </li>                    
                  </ul>


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
