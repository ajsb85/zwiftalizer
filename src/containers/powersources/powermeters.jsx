var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import { PieChart } from 'react-easy-chart';

class Powermeters extends React.Component {
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
    const { countryCode, powermeters } = this.props;

    if (!this.isObject(powermeters) || !powermeters.data) {
      return null;
    }

    const orderedPowermeters = _.sortBy(powermeters.data, t => {
      return t.percent;
    }).reverse();

    const pieData = [];

    var powermeterRows = orderedPowermeters.map(
      function(powermeter, i) {
        const key = `${countryCode}-${powermeter.manufacturerId}-${powermeter.modelId}`;

        const accuracy = powermeter.accuracy
          ? '+/- ' + powermeter.accuracy * 100 + '%'
          : 'Unknown';

        const keyStyle = {
          color: powermeter.color
        };

        const pieKey = `${powermeter.manufacturerName} ${powermeter.modelName} - ${powermeter.percent}%`;

        pieData.push({
          key: pieKey,
          value: powermeter.percent,
          color: powermeter.color
        });

        return (
          <tr key={key}>
            <td>
              <span style={keyStyle}>
                <i className="fa fa-square" aria-hidden="true" />
              </span>
            </td>
            <td>{powermeter.percent} %</td>
            <td className="hidden-xs">{powermeter.manufacturerName}</td>
            <td>{powermeter.modelName}</td>
            <td className="hidden-xs">{accuracy}</td>
          </tr>
        );
      },
      this
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <h3>Powermeters</h3>

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
                  </tr>
                </thead>
                <tbody>
                  {powermeterRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Powermeters;
