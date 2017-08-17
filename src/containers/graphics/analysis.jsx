/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
var _ = require('underscore');
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  load,
  getPerformanceScore,
  openProfilePanel
} from '../../actions/benchmarks';
import Badge from '../badge';
import structure from '../../styles/structure.css';
import images from '../../styles/images.css';
import editorial from '../../styles/editorial.css';

class Analysis extends React.Component {
  constructor(props) {
    super(props);    
  }

  render() {
    const { isLoaded } = this.props;
    return isLoaded ? this.renderAnalysis() : null;
  }

  renderAnalysis() {
    const { currentSystem, devices } = this.props;

    var profileComment = '';

    if (!_.isUndefined(currentSystem.profileId)) {
      profileComment += 'Your graphics profile (level of realism and detail) is ' + this.getProfileOpinion(currentSystem.profileId) + ' level. The levels are Basic, Medium, High and Ultra. ';
      profileComment += 'Integrated GPUs use the Basic profile. ';
      profileComment += 'The Medium and High profiles use higher quality effects for increased realism. ';
      profileComment += 'The Ultra profile gives the highest level of realism by using more sophisticated lighting, shadows and additional polygons. ';
      profileComment += 'Graphics profile is automatically set by the game engine according to the capabilities of your graphics processing unit. You can not set it yourself. ';      
    }

    var performanceScore = getPerformanceScore(
      currentSystem.resolution,
      currentSystem.profileId
    );

    var mutation = performanceScore.value === 8 ? 'n' : '';

    var fpsAlertClass = this.getFpsClass(currentSystem.specs.avgFps);

    var avgFpsComment = '';
    var minFpsComment = '';
    var maxFpsComment = '';
    var additionalFpsComment = '';

    if (!_.isUndefined(currentSystem.specs.avgFps)) {
      avgFpsComment = 'Your average frame rate is ' +
        this.getFpsOpinion(currentSystem.specs.avgFps) +
        ', ';
    }

    if (!_.isUndefined(currentSystem.specs.minFps)) {
      minFpsComment = 'your minimum frame rate is ' +
        this.getFpsOpinion(currentSystem.specs.minFps) +
        ', ';
    }

    if (!_.isUndefined(currentSystem.specs.maxFps)) {
      maxFpsComment = 'and your maximum frame rate is ' +
        this.getFpsOpinion(currentSystem.specs.maxFps) +
        '. ';
    }

    if (currentSystem.specs.avgFps <= 15 && currentSystem.resolution > 576) {
      additionalFpsComment = 'Lower your resolution to 576 to increase your average frame rate. ';
    } else if (
      currentSystem.specs.avgFps <= 30 &&
      currentSystem.resolution > 750 &&
      currentSystem.resolution < 1440
    ) {
      additionalFpsComment = 'Lower your resolution to 720 to increase your average frame rate. ';
    } else if (
      currentSystem.specs.avgFps <= 30 &&
      currentSystem.resolution > 1080 &&
      currentSystem.resolution < 1440
    ) {
      additionalFpsComment = 'Lower your resolution to 1080 to increase your average frame rate. ';
    } else if (
      currentSystem.specs.avgFps <= 45 && currentSystem.resolution > 1080
    ) {
      additionalFpsComment = 'Lower your resolution to 1080 to increase your average frame rate. ';
    }

    var resolutionComment = '';

    if (!_.isUndefined(currentSystem.resolution)) {
      resolutionComment += 'Your resolution (picture frame size measured in the number of pixels in the vertical axis) is ' +
        this.getResolutionOpinion(currentSystem.resolution) +
        '. ';
      resolutionComment += 'The levels are 576 standard definition (SD), 720 high definition (HD), 1080 full high definition (FHD), ';
      resolutionComment += '1440 wide quad high definition (WQHD - 4 times as many pixels as 720 HD), ';
      resolutionComment += '2160 ultra high definition (4K - 4 times as many pixels as 1080 FHD). ';
      resolutionComment += 'You can change the graphics resolution to whatever you want. ';
      resolutionComment += 'However, a high end discrete GPU, such as the Nvidia GeForce GTX 1050, GTX 960 or AMD Radeon RX 480, is necessary to unlock the 1440 and 2160 (4K) resolution options. ';
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className={structure.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxFirstLast}>
                  <div className={structure.boxHeadingLast}>
                    Graphics Analysis
                  </div>
                  <div className={editorial.editorialBoxContent}>                    
                    <div className="row">
                      <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      <div className={fpsAlertClass}>                          
                          <p>
                            {avgFpsComment}
                            {minFpsComment}
                            {maxFpsComment}
                            {additionalFpsComment}
                          </p>
                        </div>
                        <h3>Graphics profile</h3>
                        <p>{profileComment}</p>
                        <h3>Graphics resolution</h3>
                        <p>{resolutionComment}</p>                          
                      </div>
                    </div>                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>
    );
  }

  getFpsOpinion(fps) {
    if (fps <= 15) {
      return 'low';
    } else if (fps <= 20) {
      return 'ok';
    } else if (fps <= 30) {
      return 'average';
    } else if (fps <= 45) {
      return 'good';
    } else if (fps < 60) {
      return 'very good';
    } else {
      return 'excellent';
    }
  }

  getFpsClass(fps) {
    if (fps <= 20) {
      return 'alert alert-danger';
    } else if (fps <= 30) {
      return 'alert alert-warning';
    } else if (fps <= 45) {
      return 'alert alert-info';
    } else {
      return 'alert alert-success';    
    }
  }
   
  getProfileOpinion(profileId) {
    switch (profileId) {
      case 0:
        return 'Basic, which is the lowest';

      case 1:
        return 'Medium, which is one level above the lowest';

      case 2:
        return 'High, which is one level below the highest';

      case 3:
        return 'Ultra, which is the highest';

      default:
        return 'at an unknown';
    }
  }

  getResolutionOpinion(resolution) {
    switch (resolution) {
      case 576:
        return '576 standard definition (SD), which is the same as a 1980s television. This is the lowest setting';

      case 720:
        return '720 high definition (HD), which is the same as a 1990s HD television. This is one level above the lowest setting';

      case 750:
        return '750 high definition (HD) iOS (iPhone 7)';

      case 1080:
        return '1080 full high definition (FHD), which is the same as full HD television. This is the middle setting';

      case 1440:
        return '1440 wide quad high definition (WQHD), which 4 times as many pixels as 720 HD, which is one level below the highest setting';

      case 2160:
        return '2160 ultra high definition (4K), 4 times as many pixels as 1080 FHD, which is the highest setting';

      default:
        return 'at an unknown';
    }
  }
}

function mapStateToProps(state) {
  const { reader, system, graphics, benchmarks } = state;
  return {
    ...reader,
    ...system,
    ...graphics,
    ...benchmarks    
  };
}

Analysis.propTypes = {  
  system: PropTypes.object,
  ant: PropTypes.object
};

export default connect(mapStateToProps)(Analysis);