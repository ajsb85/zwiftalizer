var _ = require('underscore');
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  load,
  getPerformanceScore,
  openProfilePanel
} from '../../actions/benchmarks';
import shopping from '../../styles/shopping.css';
//import Badge from '../badge';
import structure from '../../styles/structure.css';
import images from '../../styles/images.css';
import editorial from '../../styles/editorial.css';

import { renderBuyLink } from '../../buylinks/index.js';

class Analysis extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isLoaded } = this.props;
    return isLoaded ? this.renderAnalysis() : null;
  }

  renderUltraGpuBuyLinks() {
    const gpusToLink = [
      'Nvidia Geforce GTX 1050 Ti',
      'Nvidia Geforce GTX 1060',
      'Nvidia Geforce GTX 1070',
      'Nvidia Geforce GTX 1080',
      'AMD Radeon RX 480'
    ];

    const buyLinks = gpusToLink.map(function(gpu, i) {
      const links = renderBuyLink(gpu);
      return (
        <div className={shopping.shoplinksContainer} key={i}>
          <span className={shopping.shoplinksEditorialLabel}>{gpu}&nbsp;</span>
          <ul className={shopping.shoplinks}>{links}</ul>
        </div>
      );
    }, this);

    return (
      <div>
        <h3>1440 (Ultra) and 4K capable GPUs</h3>
        {buyLinks}
        <p>
          The GTX 960, GTX 970, and GTX 980 are also capable of 1440 Ultra and
          4K but are no longer manufactured.
        </p>
      </div>
    );
  }

  render1440UltraLaptopBuyLinks() {
    const systemsToLink = [
      'Alienware 4K Gaming Laptop GTX 970M',
      'MSI VR Ready Laptop GeForce GTX 1060',
      'MSI Gaming Laptop GeForce GTX 1050',
      'Asus Gaming Laptop GeForce GTX 1060',
      'Asus Gaming Laptop GeForce GTX 1050'
    ];

    const buyLinks = systemsToLink.map(function(system, i) {
      const links = renderBuyLink(system);

      return (
        <div className={shopping.shoplinksContainer} key={i}>
          <span className={shopping.shoplinksEditorialLabel}>
            {system}&nbsp;
          </span>
          <ul className={shopping.shoplinks}>{links}</ul>
        </div>
      );
    }, this);

    return (
      <div>
        <h3>1440 (Ultra) capable laptops</h3>
        {buyLinks}
        <p />
      </div>
    );
  }

  renderAlienwareAlpha1080BuyLinks() {
    const ssytemsToLink = ['Alienware Alpha ASM100'];

    const buyLinks = ssytemsToLink.map(function(system, i) {
      const links = renderBuyLink(system);

      return (
        <div className={shopping.shoplinksContainer} key={i}>
          <span className={shopping.shoplinksEditorialLabel}>
            {system}&nbsp;
          </span>
          <ul className={shopping.shoplinks}>{links}</ul>
        </div>
      );
    }, this);

    return (
      <div>
        <h3>1080 HD compact gaming PC</h3>
        {buyLinks}
        <p />
      </div>
    );
  }

  renderAlienwareAlpha4KBuyLinks() {
    const ssytemsToLink = ['Alienware Alpha R2 NVidia GeForce GTX 960'];

    const buyLinks = ssytemsToLink.map(function(system, i) {
      const links = renderBuyLink(system);

      return (
        <div className={shopping.shoplinksContainer} key={i}>
          <span className={shopping.shoplinksEditorialLabel}>
            {system}&nbsp;
          </span>
          <ul className={shopping.shoplinks}>{links}</ul>
        </div>
      );
    }, this);

    return (
      <div>
        <h3>1440 (Ultra) and 4K capable compact gaming PC</h3>
        {buyLinks}
        <p />
      </div>
    );
  }

  renderAnalysis() {
    const { currentSystem, devices } = this.props;

    var profileComment = '';

    if (!_.isUndefined(currentSystem.profileId)) {
      profileComment +=
        'Your graphics profile (level of realism and detail) is ' +
        this.getProfileOpinion(currentSystem.profileId) +
        ' level. The levels are Basic, Medium, High and Ultra. ';
      profileComment += 'Integrated GPUs use the Basic profile. ';
      profileComment +=
        'The Medium and High profiles use higher quality effects for increased realism. ';
      profileComment +=
        'The Ultra profile gives the highest level of realism by using more sophisticated lighting, shadows, nicer reflections on the water, and additional polygons. ';
      profileComment +=
        'Graphics profile is automatically set by the game engine according to the capabilities of your graphics processing unit (GPU). You can not set it yourself. ';
      profileComment +=
        'You do not necessarily need to be running the Ultra or 4K resolutions to get the Ultra profile. An Nvidia GTX 1050 or 960 will get the Ultra profile at High (1080) resolution. ';
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

    if (!_.isUndefined(currentSystem.specs.minFps)) {
      minFpsComment = `Minimum frame rate is ${this.getFpsOpinion(
        currentSystem.specs.minFps
      )}. `;
    }

    if (!_.isUndefined(currentSystem.specs.avgFps)) {
      avgFpsComment = `Average frame rate is ${this.getFpsOpinion(
        currentSystem.specs.avgFps
      )}. `;
    }

    if (!_.isUndefined(currentSystem.specs.maxFps)) {
      maxFpsComment = `Maximum frame rate is ${this.getFpsOpinion(
        currentSystem.specs.maxFps
      )}. `;
    }

    if (currentSystem.specs.avgFps <= 15 && currentSystem.resolution > 576) {
      additionalFpsComment =
        'Lower your resolution to 576 to increase your average frame rate. ';
    } else if (
      currentSystem.specs.avgFps <= 30 &&
      currentSystem.resolution > 750 &&
      currentSystem.resolution < 1440
    ) {
      additionalFpsComment =
        'Lower your resolution to 720 to increase your average frame rate. ';
    } else if (
      currentSystem.specs.avgFps <= 30 &&
      currentSystem.resolution > 1080 &&
      currentSystem.resolution < 1440
    ) {
      additionalFpsComment =
        'Lower your resolution to 1080 to increase your average frame rate. ';
    } else if (
      currentSystem.specs.avgFps <= 45 &&
      currentSystem.resolution > 1080
    ) {
      additionalFpsComment =
        'Lower your resolution to 1080 to increase your average frame rate. ';
    }

    var resolutionComment = '';

    let ultraGpuBuyLinks = null;

    let ultraLaptopBuyLinks = null;

    let alienWare4KBuyLinks = null;

    let alienWare1080BuyLinks = null;

    if (!_.isUndefined(currentSystem.resolution)) {
      resolutionComment += `Your resolution (picture frame size measured in the number of pixels in the vertical axis) is ${this.getResolutionOpinion(
        currentSystem.resolution
      )}. `;
      resolutionComment +=
        'The levels are 576 (standard definition - SD), 720 (high definition - HD), High (1080 - full high definition - FHD), ';
      resolutionComment +=
        'Ultra (1440 - wide quad high definition - WQHD - 4x as many pixels as 720 HD), ';
      resolutionComment +=
        'and 4K (2160 - ultra high definition - 4x as many pixels as 1080 FHD). ';
      resolutionComment +=
        'You can change the graphics resolution to whatever you want. However, a high end discrete GPU is necessary to unlock the Ultra and 4K resolution options.';

      ultraGpuBuyLinks = this.renderUltraGpuBuyLinks();

      ultraLaptopBuyLinks = this.render1440UltraLaptopBuyLinks();

      alienWare4KBuyLinks = this.renderAlienwareAlpha4KBuyLinks();

      alienWare1080BuyLinks = this.renderAlienwareAlpha1080BuyLinks();
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
                          <p className={editorial.alertBox}>
                            {minFpsComment}
                            {avgFpsComment}
                            {maxFpsComment}
                            {additionalFpsComment}
                          </p>
                        </div>
                        <h3>Graphics profile</h3>
                        <p>{profileComment}</p>
                        <h3>Graphics resolution</h3>
                        <p>{resolutionComment}</p>
                        {ultraGpuBuyLinks}
                        {ultraLaptopBuyLinks}
                        {alienWare4KBuyLinks}
                        {alienWare1080BuyLinks}
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
