var _ = require('underscore');
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import structure from '../../styles/structure.css';
import images from '../../styles/images.css';
import editorial from '../../styles/editorial.css';
import shopping from '../../styles/shopping.css';
import { renderBuyLink } from '../../buylinks/index.js';

class Analysis extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isLoaded, devices } = this.props;

    return isLoaded && devices && devices.length ? this.renderAnalysis() : null;
  }

  renderDeviceDropouts(device, i) {
    // because 1 search at the start is normal
    if (!device.dropouts || device.dropouts.length === 1) {
      return null;
    }

    const key = device.deviceId + device.channel;

    let label = `Channel ${device.channel} Device ${device.deviceId} ${device.manufacturer} ${device.model}`
      .replace(/\s(\s)+/, ' ')
      .trim();

    let dropoutTimes = device.dropouts.slice(1).join(', ');

    return (
      <div key={key}>
        <h4>{label}</h4>
        <p>{dropoutTimes}</p>
      </div>
    );
  }

  renderDevicesDropouts() {
    const { devices } = this.props;

    let devicesArray = _.isArray(devices) ? devices : [devices];

    const deviceDropoutsMarkup = devicesArray.map((device, i) => {
      return this.renderDeviceDropouts(device, i);
    });

    let any = false;

    _.each(deviceDropoutsMarkup, d => {
      if (d) {
        any = true;
        return;
      }
    });

    if (!any) {
      return null;
    }

    return (
      <div>
        <h3>ANT+ weak signal times</h3>
        {deviceDropoutsMarkup}
      </div>
    );
  }

  renderAntDongleBuyLinks() {
    const productsToLink = ['Suunto Movestick Mini', 'Garmin USB ANT Stick'];

    const buyLinks = productsToLink.map(function(product, i) {
      const links = renderBuyLink(product);

      return (
        <div className={shopping.shoplinksContainer} key={i}>
          <span className={shopping.shoplinksEditorialLabel}>
            {product}&nbsp;
          </span>
          <ul className={shopping.shoplinks}>{links}</ul>
        </div>
      );
    }, this);

    return (
      <div>
        <h3>Recommended ANT+ Dongles</h3>
        {buyLinks}
        <p />
      </div>
    );
  }

  renderAntAccessoriesLinks() {
    const productsToLink = [
      'Rankie USB Extension Cable 3 Feet USB 2.0 R1330',
      'AmazonBasics USB 2.0 Extension Cable 3.3 Feet'
    ];

    const buyLinks = productsToLink.map(function(product, i) {
      const links = renderBuyLink(product);

      return (
        <div className={shopping.shoplinksContainer} key={i}>
          <span className={shopping.shoplinksEditorialLabel}>
            {product}&nbsp;
          </span>
          <ul className={shopping.shoplinks}>{links}</ul>
        </div>
      );
    }, this);

    return (
      <div>
        <h3>Recommended USB 2.0 Extension Cables</h3>
        {buyLinks}
        <p />
      </div>
    );
  }

  renderAnalysis() {
    const { devices, searches, searchesTimestampsRounded } = this.props;

    let antPlusAnalysis = null;

    let antPlusRecommendations = null;

    let antPlusDongleBuyLinks = null;

    let antPlusAccessoriesBuyLinks = null;

    const countSearchesTimestamps =
      searchesTimestampsRounded && searchesTimestampsRounded.length;

    if (countSearchesTimestamps) {
      antPlusAnalysis = this.getAntSearchesOpinion(countSearchesTimestamps);

      if (countSearchesTimestamps > 1) {
        antPlusRecommendations = this.getAntPlusSignalRecommendations();
        antPlusDongleBuyLinks = this.renderAntDongleBuyLinks();
        antPlusAccessoriesBuyLinks = this.renderAntAccessoriesLinks();
      }
    }

    const deviceDropoutsMarkup = this.renderDevicesDropouts();

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className={structure.boxesWrapOuter}>
            <div className={structure.boxesWrapInner}>
              <div className={structure.boxFirstLast}>
                <div className={structure.boxHeadingLast}>ANT+ Analysis</div>
                <div className={editorial.editorialBoxContent}>
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      {antPlusAnalysis}
                      {deviceDropoutsMarkup}
                      {antPlusRecommendations}
                      {antPlusDongleBuyLinks}
                      {antPlusAccessoriesBuyLinks}
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
      return (
        <div className="alert alert-success">
          <p className={editorial.alertBox}>
            <strong>Perfect!</strong> Your ANT+ devices were paired just once
            which means there were no dropouts after you started riding.
            Congratulations!
          </p>
        </div>
      );
    } else if (n <= 2) {
      return (
        <div className="alert alert-info">
          <p className={editorial.alertBox}>
            <strong>Pretty good.</strong> Your ANT+ devices were paired a couple
            of times. Probably nothing to worry about.
          </p>
        </div>
      );
    } else if (n <= 5) {
      return (
        <div className="alert alert-warning">
          <p className={editorial.alertBox}>
            <strong>Ah.</strong> Your ANT+ devices were paired several times.
            You might want to improve your signal.
          </p>
        </div>
      );
    } else if (n <= 10) {
      return (
        <div className="alert alert-warning">
          <p className={editorial.alertBox}>
            <strong>Hmm.</strong> Your ANT+ devices were paired many times. You
            definitely want to improve your signal.
          </p>
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger">
          <p className={editorial.alertBox}>
            <strong>Yikes!</strong> Your ANT+ device signal was up and down like
            a fiddler's elbow. Your environment is the most likely cause. Work
            through the recommendations below changing one thing at a time.
          </p>
        </div>
      );
    }
  }

  getAntPlusSignalRecommendations() {
    return (
      <div>
        <h3>ANT+ Recommendations</h3>

        <h4>1. Check your batteries & push everything in</h4>
        <p>
          Let's check the easy things first. Are your batteries fresh in your
          devices? Change them anyway if you don't know. Is the dongle firmly
          pushed in? Check again.
        </p>

        <h4>2. Stop Garmin ANT Agent / Garmin Connect</h4>
        <p>
          Check for Garmin ANT Agent in the system tray. Stop it if it is
          running so that it does not try to read the dongle at the same time as
          Zwift.
        </p>

        <h4>3. Try a different USB port</h4>
        <p>
          Most USB ports provide 500mA current but some only only provide 100mA.
          This is why trying a different USB port can improve your ANT+ signal.
        </p>

        <h4>4. Use a short, high quality USB extension cable</h4>
        <p>
          ANT+ works up to 30 meters but since it uses a low powered radio, at a
          fixed frequency of 2457 MHz, it is susceptible to radio-frequency
          interference. Using an SHORT extension cable, to move the dongle away
          from your computer, reduces interference caused by electronics inside
          the computer. A USB port puts out 5v @ 500 mA. Voltage and current
          drops over long cables. This is why short cables are better. A long
          cable plugged into a powered USB hub may work because the powered USB
          hub puts out up to 2.5A - 5 times more current than a built-in USB
          port.
        </p>

        <h4>5. Change your WiFi router channel</h4>
        <p>
          If you have a 2.4 GHz WiFi router, use channels 1 to 5 and avoid
          channel 10 becuase it uses the same frequency as ANT+ (2457MHz). This
          is still an issue even if the computer you use for Zwift has a hard
          wired network connection because other devices nearby that use WiFi -
          your phone, or someone watching Netflix on a Roku next door - could be
          flooding the environment with noise.
        </p>

        <h4>6. Don't sweat on your dongle</h4>
        <p>
          If your dongle is on the floor, or anywhere else where sweat falls,
          put it in a plastic bag with an elastic band around it. Sweat kills
          electronics.
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reader, ant } = state;
  return {
    ...reader,
    ...ant
  };
}

Analysis.propTypes = {
  system: PropTypes.object,
  ant: PropTypes.object
};

export default connect(mapStateToProps)(Analysis);
