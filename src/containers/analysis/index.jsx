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
import {withRouter} from 'react-router'
import {load, getPerformanceScore, openProfilePanel} from '../../actions/benchmarks'
import Badge from '../badge'
import structure from '../../styles/structure.css'
import images from '../../styles/images.css'
import editorial from '../../styles/editorial.css'

class Analysis extends React.Component {

  constructor(props) {
    super(props)
    this.seeInBenchMarksClicked = this.seeInBenchMarksClicked.bind(this)
  }

  seeInBenchMarksClicked(e) {

    e.preventDefault()

    const {currentSystem, dispatch} = this.props

    if (!currentSystem) {
      return;
    }

    // force open the panel that contains the current system before scrolling incase the user closed it (this just sets up the preference for opening the panel after the bench marks
    // loads)
    dispatch(openProfilePanel(currentSystem.panelKey))

    var callback = () => {

      // route to the benchmarks page
      this.props.router.push('/benchmarks')

      // scroll to the current system, with enough delay to wait for the router redirect to benchmarks to complete rendering
      setTimeout(() => {
        const anchorToScrollTo = document.getElementById('current')
        anchorToScrollTo && anchorToScrollTo.scrollIntoView(true/* align top */)
      }, 500)

    }

    setTimeout(() => {
      dispatch(load(callback))
    }, 100)

  }

  render() {
    const {isLoaded} = this.props

    return isLoaded
      ? this.renderAnalysis()
      : null
  }

  renderAnalysis() {

    const {currentSystem} = this.props;

    var profileComment = ''

    if (!_.isUndefined(currentSystem.profileId)) {
      profileComment += 'Your graphics profile (realism) is ' + this.getProfileOpinion(currentSystem.profileId) + ' level. The levels are Basic, Medium, High and Ultra. '
      profileComment += 'Integrated GPUs use the Basic profile. '
      profileComment += 'The Medium and High profiles use higher quality textures (skin, clothing, road surface, building, etc) for increased realism. '
      profileComment += 'The Ultra profile adds further realism by using more detailed models, and nicer lighting and shadows. '
      profileComment += 'Graphics profile is automatically set by the game engine according to the capabilities of your graphics processing unit. You can not set it yourself. '
      profileComment += 'A low end discrete GPU, such as the Nvidia GeForce GT 650 or AMD Radeon R7 360 Series, is necessary to get the Medium profile. '
      profileComment += 'A mid level discrete GPU, such as the Nvidia GeForce GTX 750 Ti or AMD Radeon R9 200, is necessary to get the High profile. '
      profileComment += 'A high end discrete GPU, such as the Nvidia GeForce GTX 960 or AMD Radeon RX 480, is necessary to get the Ultra profile. '

    }

    var performanceScore = getPerformanceScore(currentSystem.resolution, currentSystem.profileId)

    var mutation = performanceScore.value === 8
      ? 'n'
      : ''

    var avgFpsComment = ''
    var minFpsComment = ''
    var maxFpsComment = ''
    var additionalFpsComment = ''

    if (!_.isUndefined(currentSystem.specs.avgFps)) {
      avgFpsComment = 'Your average frame rate is ' + this.getFpsOpinion(currentSystem.specs.avgFps) + ', '
    }

    if (!_.isUndefined(currentSystem.specs.minFps)) {
      minFpsComment = 'your minimum frame rate is ' + this.getFpsOpinion(currentSystem.specs.minFps) + ', '
    }

    if (!_.isUndefined(currentSystem.specs.maxFps)) {
      maxFpsComment = 'and your maximum frame rate is ' + this.getFpsOpinion(currentSystem.specs.maxFps) + '. '
    }

    if (currentSystem.specs.avgFps <= 15 && currentSystem.resolution > 576) {
      additionalFpsComment = 'Lower your resolution to 576 to increase your average frame rate. '
    } else if (currentSystem.specs.avgFps <= 30 && currentSystem.resolution > 720 && currentSystem.resolution < 1440) {
      additionalFpsComment = 'Lower your resolution to 720 to increase your average frame rate. '
    } else if (currentSystem.specs.avgFps <= 30 && currentSystem.resolution > 1080 && currentSystem.resolution < 1440) {
      additionalFpsComment = 'Lower your resolution to 1080 to increase your average frame rate. '
    } else if (currentSystem.specs.avgFps <= 45 && currentSystem.resolution > 1080) {
      additionalFpsComment = 'Lower your resolution to 1080 to increase your average frame rate. '
    }

    var resolutionComment = ''

    if (!_.isUndefined(currentSystem.resolution)) {
      resolutionComment += 'Your resolution (picture frame size measured in the number of pixels in the vertical axis) is ' + this.getResolutionOpinion(currentSystem.resolution)
      resolutionComment += 'The levels are 576 standard definition (SD), 720 high definition (HD), 1080 full high definition (FHD), '
      resolutionComment += '1440 wide quad high definition (WQHD - 4 times as many pixels as 720 HD), '
      resolutionComment += '2160 ultra high definition (4K - 4 times as many pixels as 1080 FHD). '
      resolutionComment += 'Unlike graphics profile, you can change the graphics resolution to whatever you want. '
      resolutionComment += 'However, a high end discrete GPU, such as the Nvidia GeForce GTX 960 or AMD Radeon RX 480, is necessary to get the 1440 and 2160 (4K) resolution options. '
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className={structure.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxFirstLast}>
                  <div className={structure.boxHeadingLast}>Graphics Analysis</div>
                  <div className={editorial.editorialBoxContent}>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xs-12">
                          <h3>&nbsp;</h3>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12 col-sm-offset-1 col-sm-5">
                          <h3>
                            This system is a{mutation}&nbsp;<Badge data={performanceScore}/>
                          </h3>
                        </div>
                        <div className="col-xs-12 col-sm-5">
                          <div className="pull-right">
                            <button type="button" className="btn btn-primary" onClick={this.seeInBenchMarksClicked}>See standing in benchmarks</button>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                          <p>The score is based on your graphics profile and resolution. Frame rate is not considered in the score because it is very subjective (some people do not mind 15 FPS, others
                            demand a minimum of 60 FPS).</p>
                          <h3>Graphics profile</h3>
                          <p>{profileComment}</p>
                          <h3>Graphics resolution</h3>
                          <p>{resolutionComment}</p>
                          <h3>Frame rate</h3>
                          <p>{avgFpsComment}{minFpsComment}{maxFpsComment}{additionalFpsComment}</p>
                        </div>
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

  getResolutionOpinion(resolution) {

    switch (resolution) {

      case(576):
        return '576 standard definition (SD), which is the same as a 1980s television. This is the lowest setting. '

      case(720):
        return '720 high definition (HD), which is the same as a 1990s HD television. This is one level above the lowest setting. '

      case(1080):
        return '1080 full high definition (FHD), which is the same as full HD television. This is the middle setting. '

      case(1440):
        return '1440 wide quad high definition (WQHD), which 4 times as many pixels as 720 HD, which is one level below the highest setting. '

      case(2160):
        return '2160 ultra high definition (4K), 4 times as many pixels as 1080 FHD, which is the highest setting. '

      default:
        return 'at an unknown'
    }
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

Analysis.propTypes = {
  //reader: PropTypes.object,
  system: PropTypes.object,
  router: React.PropTypes.shape({push: React.PropTypes.func.isRequired}).isRequired
}

var RoutedAnalysis = withRouter(Analysis);

export default connect(mapStateToProps)(RoutedAnalysis)
