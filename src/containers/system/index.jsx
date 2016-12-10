/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
var _ = require('underscore');
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import structure from '../../styles/structure.css'
import images from '../../styles/images.css'

class System extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {isLoaded} = this.props

    return isLoaded
      ? this.renderSystemSpecs()
      : null
  }

  renderSystemSpecs() {

    const {platform, cpuVendor, cpuDetails, ram} = this.props;

    console.log(cpuDetails)

    let platformClass,
      cpuClass = null

    if (platform) {

      switch (platform.toLowerCase()) {
        case('pc'):
          platformClass = images.pc
          break

        case('mac'):
          platformClass = images.mac
          break

        default:
          platformClass = null
          break
      }
    }

    if (cpuVendor) {
      switch (cpuVendor.toLowerCase()) {
        case('amd'):
          cpuClass = images.amd
          break

        case('intel'):
          cpuClass = images.intel
          break

        case('apple'):
        case('arm'):
        case('arm64'):
          cpuClass = images.mac
          break

        default:
          cpuClass = null
          break
      }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className={structure.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxFirst}>
                  <div className={structure.boxHeading}>Platform</div>
                  <div className={structure.boxContent}>
                    <div className={platformClass} data-label={platformClass}></div>
                  </div>
                </div>
                <div className={structure.box}>
                  <div className={structure.boxHeading}>CPU</div>
                  <div className={structure.boxContent}>
                    <div className={cpuClass} data-label={cpuVendor}></div>
                  </div>
                </div>
                <div className={structure.box}>
                  <div className={structure.boxHeading}>MODEL</div>
                  <div className={structure.boxContent}>
                    <div className={structure.boxValue}>
                      <div className={structure.boxValueBig}>
                        {cpuDetails}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={structure.boxLast}>
                  <div className={structure.boxHeadingLast}>RAM</div>
                  <div className={structure.boxContent}>
                    <div className={structure.boxValue}>
                      <div className={structure.boxValueBig}>
                        {ram}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps(state) {
  const {reader, system} = state
  return {
    ...reader,
    ...system
  }
}

System.propTypes = {
  //reader: PropTypes.object,
  system: PropTypes.object
}

export default connect(mapStateToProps)(System)
