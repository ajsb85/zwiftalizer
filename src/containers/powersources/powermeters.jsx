var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import shadeColor, { shadeFactor } from './shadeColor.js';

class Powermeters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightRow: false
    };
    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
  }

  isObject(val) {
    if (val === null) {
      return false;
    }
    return typeof val === 'function' || typeof val === 'object';
  }

  mouseOverHandler(d, e) {
    this.setState({
      highlightRow: true,
      rowKey: d.rowKey
    });
  }

  mouseOutHandler() {
    this.setState({ highlightRow: false });
  }

  render() {
    const { countryCode, powermeters } = this.props;

    if (!this.isObject(powermeters) || powermeters.total === 0) {
      return null;
    }

    const orderedPowermeters = _.sortBy(powermeters.data, t => {
      return t.percent;
    }).reverse();

    var maxShare = 100;

    if (orderedPowermeters && orderedPowermeters.length) {
      maxShare = Math.round(orderedPowermeters[0].percent);
    }

    const barContainerStyle = {
      marginTop: '1.8rem'
    };

    var powermeterRows = orderedPowermeters.map(function(powermeter, i) {
      const rowKey = `${countryCode}-${powermeter.manufacturerId}-${powermeter.modelId}`;

      const keyColor = shadeColor(powermeter.color, shadeFactor);

      const accuracy = powermeter.accuracy
        ? '+/- ' + Math.round(powermeter.accuracy * 10000) / 100 + '%'
        : 'Unknown';

      const leftRightBalanceAdjustable =
        powermeter.leftRightBalanceAdjustable === null
          ? 'Unknown'
          : powermeter.leftRightBalanceAdjustable ? 'Yes' : 'No';
      const slopeAdjustable =
        powermeter.slopeAdjustable === null
          ? 'Unknown'
          : powermeter.slopeAdjustable ? 'Yes' : 'No';
      const zeroCadenceExploitable =
        powermeter.zeroCadenceExploitable === null
          ? 'Unknown'
          : powermeter.zeroCadenceExploitable ? 'Yes' : 'No';

      const powerPercentRounded = Math.round(powermeter.percent);

      const relativeBarWidth = Math.round(
        powerPercentRounded / maxShare * 100
      );

      const barStyle = {
        width: relativeBarWidth + '%',
        minWidth: '2.8rem',
        backgroundImage: 'none',
        backgroundColor: keyColor
      };

      const powerPercentFormatted = `${powerPercentRounded === 0
        ? '<1'
        : powerPercentRounded}%`;

      return (
        <tr key={rowKey}>
          <td
            className="hidden-xs hidden-sm hidden-md col-lg-1"
            style={{ textAlign: 'center' }}
          >
            {i + 1}
          </td>
          <td 
          className="hidden-xs hidden-sm hidden-md col-lg-3"
          style={{ textAlign: 'center' }}>
            <div className="progress" style={barContainerStyle}>
              <div
                className="progress-bar progress-bar-success"
                role="progressbar"
                aria-valuenow={relativeBarWidth}
                aria-valuemin="0"
                aria-valuemax="100"
                style={barStyle}
              >{powerPercentFormatted}
              </div>
            </div>
          </td>
          <td className="col-sm-1 hidden-lg hidden-xl" style={{ textAlign: 'center' }}>{powerPercentFormatted}</td>
          <td className="col-sm-1">{powermeter.manufacturerName}</td>
          <td className="col-sm-2">{powermeter.modelName}</td>
          <td className="col-sm-1">{accuracy}</td>          
          <td className="col-sm-1">
            {leftRightBalanceAdjustable}
          </td>
          <td className="col-sm-1">{slopeAdjustable}</td>
          <td className="col-sm-1">
            {zeroCadenceExploitable}
          </td>
        </tr>
      );
    }, this);

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              <h3>Power Meters</h3>
              <span className={styles.totalBadge}>
                Sample size {powermeters.total}
              </span>
            </div>
          </div>          
          <div className="row">
            <div className="col-xs-12">
              <table
                className="table table-bordered table-striped"
                cellSpacing="0"
                width="100%"
              >
                <thead>
                  <tr>
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">
                      Rank
                    </th>
                    <th className="col-sm-3 hidden-xs hidden-sm hidden-md">Share</th>
                    <th className="col-sm-1 hidden-lg hidden-xl">Share</th>
                    <th className="col-sm-1">Make</th>
                    <th className="col-sm-2">Model</th>
                    <th className="col-sm-1">Accuracy</th>
                    <th className="col-sm-1">
                      User Serviceable Leg Imbalance Correction
                    </th>
                    <th className="col-sm-1">
                      User Serviceable Torque Slope
                    </th>
                    <th className="col-sm-1">
                      Exhibits Coasting Power Bug
                    </th>
                  </tr>
                </thead>
                <tbody>{powermeterRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Powermeters;
