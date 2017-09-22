var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import shopping from '../../styles/shopping.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import { BarChart } from 'react-easy-chart';
import shadeColor, { shadeFactor } from './shadeColor.js';

class SmartTrainers extends React.Component {
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
    const { countryCode, smartTrainers } = this.props;

    if (!this.isObject(smartTrainers) || smartTrainers.total === 0) {
      return null;
    }

    const orderedSmartTrainers = _.sortBy(_.sortBy(smartTrainers.data, t => {
      return t.percent;      
    }).reverse());

    const chartData = [];

    var smartTrainerRows = orderedSmartTrainers.map(
      function(smartTrainer, i) {
        const rowKey = `${countryCode}-${smartTrainer.manufacturerId}-${smartTrainer.modelId}`;

        const keyColor = shadeColor(smartTrainer.color, shadeFactor);

        const accuracy = smartTrainer.accuracy
          ? '+/- ' + (Math.round(smartTrainer.accuracy * 10000) / 100) + '%'
          : 'Unknown';

        var controllable = smartTrainer.controllable === null ? 'Unknown' : smartTrainer.controllable ? 'Yes' : 'No';

        const supportsSpindownCalibration = smartTrainer.supportsSpindownCalibration === null ? 'Unknown' : smartTrainer.supportsSpindownCalibration ? 'Yes' : 'No'
                
        const maxIncline = smartTrainer.maxIncline
          ? + (Math.round(smartTrainer.maxIncline * 10000) / 100) + ' %'
          : 'Unknown';

        const keyStyle = {
          display: 'inline-block',
          minWidth: '6rem',
          padding: '0.5rem 0.7rem',
          fontSize: '1.3rem',
          fontWeight: '600',
          color: '#FFF',
          lineHeight: '1',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          backgroundColor: keyColor,
          borderRadius: '1.5rem',
          border: '0.2rem solid #1580BD',
          fontFamily: '"Open Sans", Arial, Helvetica, sans-serif',
          fontWeight: '600'
        };

        const smartTrainerPercentRounded = Math.round(smartTrainer.percent);

        const chartKey = `${smartTrainerPercentRounded}`

        const smartTrainerPercentFormatted = `${smartTrainerPercentRounded === 0 ? '<1' : smartTrainerPercentRounded}%`;

        chartData.push({
          key: chartKey,
          rowKey: rowKey,
          y: Math.round(smartTrainerPercentRounded),
          color: keyColor,
          x: `${i+1}`
        });

        let highlightStyle = {};

        if (this.state.highlightRow && this.state.rowKey === rowKey) {
          highlightStyle = { backgroundColor: '#FF0' };
        }
        
        return (
          <tr key={rowKey} style={highlightStyle}>
            <td className="hidden-xs hidden-sm hidden-md" style={{ textAlign: 'center' }}>{i+1}</td>
            <td style={{ textAlign: 'center' }}>
              <span style={keyStyle}>
                {smartTrainerPercentFormatted}
              </span>
            </td>          
            <td>
              {smartTrainer.manufacturerName}
            </td>
            <td>{smartTrainer.modelName}</td>
            <td>{accuracy}</td>
            <td className="hidden-xs hidden-sm hidden-md">
              {smartTrainer.maxPower}
            </td>
            <td className="hidden-xs hidden-sm hidden-md">{maxIncline}</td>
            <td className="hidden-xs hidden-sm hidden-md">{controllable}</td>                        
            <td className="hidden-xs hidden-sm hidden-md">
              {supportsSpindownCalibration}
            </td>            
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
              <h3>Smart Trainers</h3>
              <span className={styles.totalBadge}> Sample size {smartTrainers.total}</span>
            </div>
          </div>
          <div className="row hidden-xs hidden-sm hidden-md">
            <div className="col-xs-12">
              <div className={styles.chartContainer}>                
                <BarChart
                  chartKey={`${countryCode}-smarttrainers`}
                  axisLabels={{y: 'Percent'}}
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
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">Row</th>
                    <th className="col-sm-2">Share</th>
                    <th className="col-sm-2">Make</th>
                    <th className="col-sm-2">Model</th>
                    <th className="col-sm-1">Accuracy</th>
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">Max Power</th>
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">Max Incline</th>
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">Interactive</th>                                      
                    <th className="col-sm-1 hidden-xs hidden-sm hidden-md">Spin Down Calibration Required</th>
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
