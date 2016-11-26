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
import {getPerformanceScore} from '../../actions/benchmarks'
import Badge from '../badge'
import structure from '../../styles/structure.css'
import images from '../../styles/images.css'
import styles from './styles.css'
import editorial from '../../styles/editorial.css'
import {colors} from '../../styles/colors'

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

  getFpsOpinion(fps) {

    if (fps <= 15) {
      return 'very low'
    } else if (fps <= 20) {
      return 'low'
    } else if (fps <= 30) {
      return 'reasonable'
    } else if (fps <= 45) {
      return 'good'
    } else if (fps < 60) {
      return 'very good'
    } else {
      return 'excellent'
    }
  }

  getProfileOpinion(profileId) {

    switch (profileId) {

      case(0):
        return 'Basic, which is the lowest'

      case(1):
        return 'Medium, which is one level above the lowest'

      case(2):
        return 'High, which is one level below the highest'

      case(3):
        return 'Ultra, which is the highest'

      default:
        return 'at an unknown'
    }
  }

  renderSystemSpecs() {

    const {
      platform,
      cpuVendor,
      cpuDetails,
      ram,
      specs,
      currentSystem
    } = this.props;

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
          cpuClass = images.mac
          break

        default:
          cpuClass = null
          break
      }
    }

    var profileComment = ''

    if (!_.isUndefined(currentSystem.profileId)) {
      profileComment += 'Your graphics profile (realism) is ' + this.getProfileOpinion(currentSystem.profileId) + ' level. The levels are Basic, Medium, High, Ultra. '
      profileComment += 'The Medium and High profiles use higher resolution image maps for increased realism. '
      profileComment += 'The Ultra profile adds even further realism by using higher resolution models, and nicer lighting and shadows. '
      profileComment += 'Graphics profile is automatically set by the game engine, according to the capabilities of your graphics processing unit, and cannot be set manually. '
      profileComment += 'Integrated Intel and AMD graphics are limited to the Basic profile. '
      profileComment += 'A low end discrete GPU, such as the Nvidia GeForce GT 650 or AMD Radeon R7 360 Series, is needed to get the Medium profile. '
      profileComment += 'A mid level discrete GPU, such as the Nvidia GeForce GTX 750 Ti or AMD Radeon R9 200, is needed to get the High profile. '
      profileComment += 'A high end discrete GPU, such as the Nvidia GeForce GTX 960 or AMD Radeon RX 480, is needed to get the Ultra profile. '

    }

    var performanceScore = getPerformanceScore(currentSystem.resolution, currentSystem.profileId)

    var minFpsComment = ''
    var avgFpsComment = ''
    var maxFpsComment = ''

    if (!_.isUndefined(currentSystem.specs.minFps)) {
      minFpsComment = 'Your minimum frame rate is ' + this.getFpsOpinion(currentSystem.specs.minFps) + '. '
    }

    if (!_.isUndefined(currentSystem.specs.avgFps)) {
      avgFpsComment = 'Your average frame rate is ' + this.getFpsOpinion(currentSystem.specs.avgFps) + '. '
    }

    if (!_.isUndefined(currentSystem.specs.maxFps)) {
      maxFpsComment = 'Your maximum frame rate is ' + this.getFpsOpinion(currentSystem.specs.maxFps) + '. '
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
        <div className="row">
          <div className="col-xs-12">
            <div className={structure.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxFirstLast}>
                  <div className={structure.boxHeadingLast}>Summary</div>
                  <div className={editorial.editorialBoxContent}>
                    <span className={styles.opinion}>This system is a &nbsp;</span><Badge data={performanceScore}/>&nbsp;
                    <p>{minFpsComment}{avgFpsComment}{maxFpsComment}</p>
                    <p>{profileComment}</p>
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
  const {reader, system, graphics, benchmarks} = state
  return {
    ...reader,
    ...system,
    ...graphics,
    ...benchmarks
  }
}

System.propTypes = {
  //reader: PropTypes.object,
  system: PropTypes.object
}

export default connect(mapStateToProps)(System)
