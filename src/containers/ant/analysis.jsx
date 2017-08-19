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
import structure from '../../styles/structure.css';
import images from '../../styles/images.css';
import editorial from '../../styles/editorial.css';

class Analysis extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isLoaded, devices } = this.props;
    return isLoaded && devices ? this.renderAnalysis() : null;
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
        <h4>
          {label}
        </h4>
        <p>
          {dropoutTimes}
        </p>
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

  renderAnalysis() {
    const { devices, searches, searchesTimestampsRounded } = this.props;

    let antPlusAnalysis = null;

    let antPlusRecommendations = null;

    const countSearchesTimestamps =
      searchesTimestampsRounded && searchesTimestampsRounded.length;

    if (countSearchesTimestamps) {
      antPlusAnalysis = this.getAntSearchesOpinion(countSearchesTimestamps);

      if (countSearchesTimestamps > 1) {
        antPlusRecommendations = this.getAntPlusSignalRecommendations();
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
          <p>
            <strong>Perfect!</strong> There was only one pairing of your ANT+
            devices which means there were no dropouts after you started riding.
            It does not get any better than that.
          </p>
        </div>
      );
    } else if (n <= 2) {
      return (
        <div className="alert alert-info">
          <p>
            <strong>Pretty good.</strong> Your ANT+ devices were paired a couple of times. Probably nothing to worry about.
          </p>
        </div>
      );
    } else if (n <= 5) {
      return (
        <div className="alert alert-warning">
          <p>
            <strong>Ah.</strong> Your ANT+ devices were paired between two
            and five times. You can probably improve your signal.
          </p>
        </div>
      );
    } else if (n <= 10) {
      return (
        <div className="alert alert-warning">
          <p>
            <strong>Hmm.</strong> Your ANT+ devices were paired between
            six and ten times. You can probably improve your signal.
          </p>
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger">
          <p>
            <strong>Yikes!</strong> Your ANT+ device signal was up and down like a fiddlers
            elbow. Your signal can definitely be improved.
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

        <h4>3. Use a short, high quality USB extension cable</h4>
        <p>
          ANT+ works up to 30 meters but since it uses a low powered radio, at a
          fixed frequency of 2457 MHz, it is susceptible to radio-frequency
          interference. Using an extension cable to move the dongle away from
          your computer reduces interference caused by electronics inside the
          computer.{' '}
        </p>

        <h4>4. Change your WiFi router channel</h4>
        <p>
          If you have a 2.4 GHz WiFi router, use channels 1 to 5 and avoid
          channel 10 becuase it is the same frequency as ANT+ (2457MHz). This is
          still an issue even if the computer you use for Zwift has a hard wired
          network connection because other devices nearby that use WiFi - your
          phone, or someone watching Netflix on a Roku next door, could fill the
          airwaves with interference.
        </p>

        <h4>5. Use a different USB port</h4>
        <p>
          Some USB ports run at lower voltages than others, particularly in
          laptops where power saving is often enabled when running on batteries.
          Setting your computer's power management to 'high performance' will
          give the USB ports maximum power. It might improve your graphics
          performance too. Always set power management to 'high performance' for
          gaming and if you are using a laptop, always plug it in.
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
