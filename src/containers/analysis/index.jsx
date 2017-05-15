/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
var _ = require('underscore');
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
    const { currentSystem, devices, searches, searchesTimestampsRounded } = this.props;

    let antPlusAnalysis = null

    let antPlusRecommendations = null;

    const countSearchesTimestamps = searchesTimestampsRounded && searchesTimestampsRounded.length;

    // const countSearches = searches && searches.size();

    if (countSearchesTimestamps) {            
       antPlusAnalysis = this.getAntSearchesOpinion(countSearchesTimestamps);

       if (countSearchesTimestamps > 1) {
         antPlusRecommendations = this.getAntPlusSignalRecommendations();
       }
    }

    var profileComment = '';

    if (!_.isUndefined(currentSystem.profileId)) {
      profileComment += 'Your graphics profile (level of realism and detail) is ' +
        this.getProfileOpinion(currentSystem.profileId) +
        ' level. The levels are Basic, Medium, High and Ultra. ';
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
      resolutionComment += 'The levels are 576 standard definition (SD), 750 iOS (iPhone 7), 720 high definition (HD), 1080 full high definition (FHD), ';
      resolutionComment += '1440 wide quad high definition (WQHD - 4 times as many pixels as 720 HD), ';
      resolutionComment += '2160 ultra high definition (4K - 4 times as many pixels as 1080 FHD). ';
      resolutionComment += 'You can change the graphics resolution to whatever you want. ';
      resolutionComment += 'However, a high end discrete GPU, such as the Nvidia GeForce GTX 1050, GTX 960 or AMD Radeon RX 480, is necessary to unlock the 1440 and 2160 (4K) resolution options. ';
    }

    return (
      <div className="container">
       <div className="row">
          <div className="col-xs-12 col-sm-offset-1 col-sm-10">
            <h3>
              DISCLAIMER
            </h3>
            <p>
              The opinions expressed below are the those of one member of the Zwift community and do not represent the opinions of Zwift Inc in any way.
            </p>
          </div>
        </div>        
        
        <div className="row">
          <div className="col-xs-12">
            <div className={structure.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxFirstLast}>
                  <div className={structure.boxHeadingLast}>
                    Graphics Analysis
                  </div>
                  <div className={editorial.editorialBoxContent}>
                    <div className="container">
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

        <div className="row">
          <div className="col-xs-12">
            <div className={structure.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxFirstLast}>
                  <div className={structure.boxHeadingLast}>
                    ANT+ Analysis
                  </div>
                  <div className={editorial.editorialBoxContent}>
                    <div className="container">
                      <div className="row">
                        <div className="col-xs-12 col-sm-offset-1 col-sm-10">                              
                            {antPlusAnalysis}                          
                            {antPlusRecommendations}                          
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
    );
  }

  getAntSearchesOpinion(n) {
    if (n === 1) {
      return <div className="alert alert-success"><p><strong>Perfect!</strong> There was only one search for your ANT+ devices which means there were no dropouts after you started riding. It does not get any better than that.</p></div>
    } else if (n <= 3) {
      return <div className="alert alert-info"><p><strong>Pretty good.</strong> Your ANT+ devices were searched for just a couple of times. Probably nothing to worry about but you should zoom in on the ANT+ charts to check for dropouts in one or more device signals anyway.</p></div>
    } else if (n <= 5) {
      return <div className="alert alert-warning"><p><strong>Ah.</strong> Your ANT+ devices were searched for between three and five times. You should probably try to improve your signal and you might also want to zoom in on the ANT+ charts to check for dropouts in one or more device signals.</p></div>
    } else if (n <= 10) {
      return <div className="alert alert-warning"><p><strong>Hmm.</strong> Your ANT+ devices were searched for between five and ten times. That might indicate your signal needs improving.</p></div>
    } else if (n <= 20) {
      return <div className="alert alert-danger"><p><strong>Oh dear.</strong> Your ANT+ devices were searched for between ten and twenty times. Your signal almost certainly needs improving.</p></div>
    } else {
      return <div className="alert alert-danger"><p><strong>Yikes!</strong> Your signal is up and down like a fiddlers elbow. Your signal definitely needs improving.</p></div>
    }
  }

  getAntPlusSignalRecommendations() {
    return (

      <div>
        <h3>ANT+ Recommendations</h3>

        <h3>Read this before getting a USB extension cable!</h3>
        <p>ANT+ works up to 30 meters. Moving the dongle closer to the devices is often completely unnecessary and could even make things worse because over a passive cable the dongle will lose some voltage.</p>

        <h3>1. Check your batteries & push everything in</h3>
        <p>Let's check the easy things first. Are your batteries fresh in your devices? Change them anyway if you don't know. Is the dongle firmly pushed in? Check again.</p>

        <h3>2. Stop Garmin ANT Agent / Garmin Connect</h3>
        <p>Check for Garmin ANT Agent in the system tray. Stop it if it is running so that it does not try to read the dongle at the same time as Zwift.</p>

        <h3>3. Check your WiFi router channel</h3>
        <p>This is a very common cause of drop outs. If you have a 2.4 GHz WiFi router, check that its channel is not set to auto or channel 10. 
        ANT+ works on the same frequency as channel 10 (2457MHz) and while the wireless transport has mechanisms built in to avoid conflicts, many routers are not up to spec and can still cause interference. 
        This is still an issue even if the computer you use for Zwift has a hard wired network connection because other devices nearby that use WiFi - your phone, or someone watching Netflix on a Roku next door, could fill the airwaves with interference.
        </p>
        
        <h3>4. Get a 5GHz WiFi Router</h3>
        <p>If changing the channel on your 2.4 GHz WiFi router didn't help, then buy a 5GHz router because it operates on a completely different set of frequencies from ANT+.</p>
        
        <h3>5. Use a different USB port</h3>
        <p>Some USB ports run at lower voltages than others, particularly in laptops where power saving is often enabled when running on batteries. Setting your computer's power management to 'high performance' will give the USB ports maximum power. It might improve your graphics performance too. Always set power management to 'high performance' for gaming and if you are using a laptop, always plug it in.</p>

        <h3>6. Don't sweat on your dongle</h3>
        <p>OK, so you're using an extension cable. If your dongle is on the floor, or anywhere else where sweat falls, put it in a plastic bag with an elastic band around it. Sweat kills electronics.</p>
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
  const { reader, system, graphics, benchmarks, ant } = state;
  return {
    ...reader,
    ...system,
    ...graphics,
    ...benchmarks,
    ...ant
  };
}

Analysis.propTypes = {
  //reader: PropTypes.object,
  system: PropTypes.object,
  ant: PropTypes.object,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var RoutedAnalysis = withRouter(Analysis);

export default connect(mapStateToProps)(RoutedAnalysis);
