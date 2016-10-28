/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Dropzone from 'react-dropzone'
import {readFile, reset} from '../../actions/parse'
import structure from '../../styles/structure.css'
import styles from './styles.css'

import {setPreferences} from '../../actions/preferences'

import {About} from '../modals/about.jsx'

class Reader extends React.Component {

  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }

  handleCheckboxChange(e) {
    const {dispatch} = this.props
    dispatch(setPreferences({share: e.target.checked}))
  }

  render() {

    const {isLoading, isLoaded, share} = this.props

    const dropBoxStyle = isLoaded
      ? {
        height: '7rem'
      }
      : {
        height: '50rem'
      }

    const dropBoxInnerStyle = isLoaded
      ? {
        height: '6rem'
      }
      : {
        height: '14rem'
      }

    const instructionsDiv = isLoading
      ? null
      : <div>
        <div className={styles.headingIcon}>
          <i className="fa fa-download"></i>
        </div>
        <div className={styles.heading}>Drop Log.txt file or browse</div>
        <div className={styles.subHeading}>(Log.txt is in %USER%\Documents\Zwift\Logs)</div>
      </div>

    const spinnerDiv = isLoading
      ? <div className={styles.spinner}></div>
      : null

    const messageDiv = isLoading
      ? <div className={styles.messageContainer}>
          Reading file ...
        </div>
      : null

    const shareStatus = share
      ? 'checked'
      : ''

    return (
      <div className={styles.root}>

        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">

              <div className="alert alert-warning" role="alert">

                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12 col-md-2">
                      <form>
                        <div className="form-group">
                          <div className={styles.checkboxWrapper}>
                            <div className={styles.checkbox}>
                              <input id="shareCheckbox" type="checkbox" onChange={this.handleCheckboxChange} checked={shareStatus}/>
                              <label htmlFor="shareCheckbox"></label>
                            </div>
                          </div>
                        </div>
                      </form>

                    </div>
                    <div className="col-sm-12 col-md-10">
                      <div className={styles.consentWrapper}>
                        <h2 className={styles.checkboxLabel}>
                          <span className={styles.checkboxLabelStrong}>I agree</span>&nbsp;to my system summary being included in the benchmarks database.
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <Dropzone onDrop={this.onDrop} multiple={false} accept="text/plain" className={styles.default} activeClassName={styles.active} rejectClassName={styles.reject} style={dropBoxStyle}>
                <div className={styles.dropboxInner} style={dropBoxInnerStyle}>
                  {instructionsDiv}
                  {spinnerDiv}
                  {messageDiv}
                </div>
              </Dropzone>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onDrop(files) {
    const {dispatch, isLoaded, share} = this.props

    if (isLoaded) {
      dispatch(reset())
    }

    //@todo, raise warning if the file does not appear to be a log file (dropping the launcher log is a common error) delayed so that the state can update the loading message
    setTimeout(() => {
      dispatch(readFile(files[0], share))
    }, 250)
  }

}

function mapStateToProps(state) {
  const {reader, preferences} = state
  return {
    ...reader,
    ...preferences
  }
}

Reader.propTypes = {
  reader: PropTypes.object
}

export default connect(mapStateToProps)(Reader)
