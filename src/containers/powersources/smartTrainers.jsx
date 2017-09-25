var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import shopping from '../../styles/shopping.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import shadeColor, { shadeFactor } from './shadeColor.js';

class SmartTrainers extends React.Component {
  constructor(props) {
    super(props);    
  }

  isObject(val) {
    if (val === null) {
      return false;
    }
    return typeof val === 'function' || typeof val === 'object';
  }

  render() {
    const { countryCode, smartTrainers } = this.props;

    if (!this.isObject(smartTrainers) || smartTrainers.total === 0) {
      return null;
    }

    const orderedSmartTrainers = _.sortBy(
      _.sortBy(smartTrainers.data, t => {
        return t.percent;
      }).reverse()
    );

    var maxShare = 100;

    if (orderedSmartTrainers && orderedSmartTrainers.length) {
      maxShare = Math.round(orderedSmartTrainers[0].percent);
    }
    
    const barContainerStyle = {
      marginTop: '1.8rem'
    };

    var smartTrainerRows = orderedSmartTrainers.map(function(smartTrainer, i) {
      const rowKey = `${countryCode}-${smartTrainer.manufacturerId}-${smartTrainer.modelId}`;

      const keyColor = shadeColor(smartTrainer.color, shadeFactor);

      const accuracy = smartTrainer.accuracy
        ? '+/- ' + Math.round(smartTrainer.accuracy * 10000) / 100 + '%'
        : 'Unknown';

      var controllable =
        smartTrainer.controllable === null
          ? 'Unknown'
          : smartTrainer.controllable ? 'Yes' : 'No';

      const supportsSpindownCalibration =
        smartTrainer.supportsSpindownCalibration === null
          ? 'Unknown'
          : smartTrainer.supportsSpindownCalibration ? 'Yes' : 'No';

      const maxIncline = smartTrainer.maxIncline
        ? +(Math.round(smartTrainer.maxIncline * 10000) / 100) + ' %'
        : 'Unknown';

      const smartTrainerPercentRounded = Math.round(smartTrainer.percent);

      const relativeBarWidth = Math.round(
        smartTrainerPercentRounded / maxShare * 100
      );

      const barStyle = {
        width: relativeBarWidth + '%',
        minWidth: '2.8rem',
        backgroundImage: 'none',
        backgroundColor: keyColor
      };

      const chartKey = `${smartTrainerPercentRounded}`;

      const smartTrainerPercentFormatted = `${smartTrainerPercentRounded === 0
        ? '<1'
        : smartTrainerPercentRounded}%`;

      return (
        <tr key={rowKey}>
          <td
            className="hidden-xs hidden-sm hidden-md"
            style={{ textAlign: 'center' }}
          >
            {i + 1}
          </td>
          <td 
            className="hidden-xs hidden-sm hidden-md"
            style={{ textAlign: 'center' }}>
            <div className="progress" style={barContainerStyle}>
              <div
                className="progress-bar progress-bar-success"
                role="progressbar"
                aria-valuenow={relativeBarWidth}
                aria-valuemin="0"
                aria-valuemax="100"
                style={barStyle}
              >
                {smartTrainerPercentFormatted}
              </div>
            </div>
          </td>
          <td className="col-sm-1 hidden-lg hidden-xl" style={{ textAlign: 'center' }}>{smartTrainerPercentFormatted}</td>
          <td>{smartTrainer.manufacturerName}</td>
          <td>{smartTrainer.modelName}</td>
          <td>{accuracy}</td>
          <td>
            {smartTrainer.maxPower}
          </td>
          <td>{maxIncline}</td>
          <td className="hidden-xs hidden-sm hidden-md">{controllable}</td>
          <td className="hidden-xs hidden-sm hidden-md">
            {supportsSpindownCalibration}
          </td>
        </tr>
      );
    }, this);

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              <h3>Smart Trainers</h3>
              <span className={styles.totalBadge}>                
                Sample size {smartTrainers.total}
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
                      Max Power
                    </th>
                    <th className="col-sm-1">
                      Max Incline
                    </th>
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">
                      Interactive
                    </th>
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">
                      Spin Down Calibration Required
                    </th>
                  </tr>
                </thead>
                <tbody>{smartTrainerRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SmartTrainers;
