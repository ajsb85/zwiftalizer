var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import { BarChart } from 'react-easy-chart';
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
  };
  
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

    if (!this.isObject(powermeters) || !powermeters.data) {
      return null;
    }

    const orderedPowermeters = _.sortBy(powermeters.data, t => {
      return t.percent;
    }).reverse();

    const chartData = [];

    var powermeterRows = orderedPowermeters.map(
      function(powermeter, i) {
        const rowKey = `${countryCode}-${powermeter.manufacturerId}-${powermeter.modelId}`;

        const keyColor = shadeColor(powermeter.color, shadeFactor);

        const accuracy = powermeter.accuracy
          ? '+/- ' + (Math.round(powermeter.accuracy * 10000) / 100) + '%'
          : 'Unknown';

        const keyStyle = {
          display: 'inline-block',
          minWidth: '8rem',
          padding: '0.3rem 0.7rem',
          fontSize: '1.6rem',
          fontWeight: '600',
          color: '#fff',
          lineHeight: '1',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          backgroundColor: keyColor,
          borderRadius: '1.5rem',
          border: '0.2rem solid #555',
          fontFamily: '"Open Sans", Arial, Helvetica, sans-serif',
          fontWeight: '600'
        };

        // const chartKey = `${i + 1}`;

        const powerPercentRounded = Math.round(powermeter.percent);

        const chartKey = `${powerPercentRounded}%`

        chartData.push({
          key: chartKey,
          rowKey: rowKey,
          y: powerPercentRounded,
          color: keyColor,
          x: `${powermeter.modelName}`
        });

        let highlightStyle = {}
        
        if (this.state.highlightRow && this.state.rowKey === rowKey) {          
          highlightStyle = {backgroundColor: '#FF0'};
        }

        return (
          <tr key={rowKey} style={highlightStyle}>
            <td style={{ textAlign: 'center' }}>
              <span style={keyStyle}>
                {chartKey}
              </span>
            </td>            
            <td>{powermeter.manufacturerName}</td>
            <td className="hidden-xs hidden-sm hidden-md">
              {powermeter.modelName}
            </td>
            <td>{accuracy}</td>
          </tr>
        );
      },
      this
    );

    return (
      <div>        
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              <h3>
                Power Meters
              </h3>
              <span className={styles.totalBadge}>Sample size {powermeters.total}</span>
            </div>
          </div>
          <div className="row hidden-xs hidden-sm hidden-md">
            <div className="col-xs-12">              
              <div className={styles.chartContainer}>                
                <BarChart
                  chartKey={`${countryCode}-powermeters`}
                  axisLabels={{x: 'Model', y: 'Percent'}}
                  axes
                  grid
                  height={250}
                  width={860}    
                  data={chartData}
                  padding={10}                 
                  mouseOverHandler={this.mouseOverHandler}
                  mouseOutHandler={this.mouseOutHandler}                  
                />
              </div>
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
                    <th>Share</th>
                    <th>Make</th>
                    <th className="hidden-xs hidden-sm hidden-md">Model</th>
                    <th>Accuracy</th>
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
