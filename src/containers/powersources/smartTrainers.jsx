var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import { PieChart } from 'react-easy-chart';

class SmartTrainers extends React.Component {
  constructor(props) {
    super(props);
  }

  isObject = val => {
    if (val === null) {
      return false;
    }
    return typeof val === 'function' || typeof val === 'object';
  };

  render() {
    const { countryCode, smartTrainers } = this.props;

    if (!this.isObject(smartTrainers) || !smartTrainers.data) {
      return null;
    }

    const orderedSmartTrainers = _.sortBy(smartTrainers.data, t => {
      return t.percent;
    }).reverse();

    const pieData = [];

    var smartTrainerRows = orderedSmartTrainers.map(
      function(smartTrainer, i) {
        const key = `${countryCode}-${smartTrainer.manufacturerId}-${smartTrainer.modelId}`;

        const accuracy = smartTrainer.accuracy
          ? '+/- ' + smartTrainer.accuracy * 100 + '%'
          : 'Unknown';

        var controllable = smartTrainer.controllable ? 'Yes' : 'No';

        if (smartTrainer.modelName.toLowerCase().indexOf('kura') >= 0) {
          controllable = 'Drivo Yes, Kura No';
        }

        const maxIncline = smartTrainer.maxIncline
          ? smartTrainer.maxIncline * 100 + ' %'
          : 'Unknown';

        const keyStyle = {
          color: smartTrainer.color
        };

        const pieKey = `${smartTrainer.manufacturerName} ${smartTrainer.modelName} - ${smartTrainer.percent}%`;

        pieData.push({
          key: pieKey,
          value: smartTrainer.percent,
          color: smartTrainer.color
        });

        return (
          <tr key={key}>
            <td>
              <span style={keyStyle}>
                <i className="fa fa-square" aria-hidden="true" />
              </span>
            </td>
            <td>{smartTrainer.percent} %</td>
            <td className="hidden-xs">{smartTrainer.manufacturerName}</td>
            <td>{smartTrainer.modelName}</td>
            <td className="hidden-xs">{accuracy}</td>
            <td className="hidden-xs">{controllable}</td>
            <td className="hidden-xs">{maxIncline}</td>
            <td className="hidden-xs">{smartTrainer.maxPower}</td>
          </tr>
        );
      },
      this
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <h3>Smart Trainers</h3>

            <div className={styles.pieChartContainer}>
              <PieChart
                labels
                size={500}
                data={pieData}
                padding={50}
                styles={{
                  '.pie-chart-label': {
                    fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                    fontSize: '1.6rem',
                    fill: '#fff'
                  }
                }}
              />
            </div>

            <div className="table-responsive">
              <table
                className="table table-bordered table-striped"
                cellSpacing="0"
                width="100%"
              >
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Usage</th>
                    <th className="hidden-xs">Make</th>
                    <th>Model</th>
                    <th className="hidden-xs">Accuracy</th>
                    <th className="hidden-xs">Interactive</th>
                    <th className="hidden-xs">Max Incline</th>
                    <th className="hidden-xs">Max Power</th>
                  </tr>
                </thead>
                <tbody>
                  {smartTrainerRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SmartTrainers;
