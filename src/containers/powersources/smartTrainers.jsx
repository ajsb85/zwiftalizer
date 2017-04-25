var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import { PieChart } from 'react-easy-chart';
import ToolTip from '../toolTip/toolTip.jsx';
import shadeColor, { shadeFactor } from './shadeColor.js';

class SmartTrainers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToolTip: false
    };
    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
  }

  isObject = val => {
    if (val === null) {
      return false;
    }
    return typeof val === 'function' || typeof val === 'object';
  };

  mouseOverHandler(d, e) {
    this.setState({
      showToolTip: true,
      top: `${e.screenY}px`,
      left: `${e.screenX}px`,
      label: d.data.label,
      rowKey: d.data.rowKey
    });
  }

  mouseMoveHandler(e) {
    if (this.state.showToolTip) {
      this.setState({ top: `${e.y}px`, left: `${e.x}px` });
    }
  }

  mouseOutHandler() {
    this.setState({ showToolTip: false });
  }

  createTooltip() {
    if (this.state.showToolTip) {
      return (
        <ToolTip top={this.state.top} left={this.state.left}>
          {this.state.label}
        </ToolTip>
      );
    }
    return false;
  }

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
        const rowKey = `${countryCode}-${smartTrainer.manufacturerId}-${smartTrainer.modelId}`;

        const keyColor = shadeColor(smartTrainer.color, shadeFactor);

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
          display: 'inline-block',
          minWidth: '8rem',
          padding: '0.3rem 0.7rem',
          fontSize: '1.6rem',
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

        //const pieKey = `${i + 1}`;

        const pieKey = `${smartTrainer.percent}%`

        pieData.push({
          key: pieKey,
          rowKey: rowKey,
          value: smartTrainer.percent,
          color: keyColor,
          label: `${smartTrainer.manufacturerName} - ${smartTrainer.modelName}`
        });

        let highlightStyle = {};

        if (this.state.showToolTip && this.state.rowKey === rowKey) {
          highlightStyle = { backgroundColor: '#FF0' };
        }

        return (
          <tr key={rowKey} style={highlightStyle}>
            <td style={{ textAlign: 'center' }}>
              <span style={keyStyle}>
                {pieKey}
              </span>
            </td>          
            <td className="hidden-xs hidden-sm hidden-md">
              {smartTrainer.manufacturerName}
            </td>
            <td>{smartTrainer.modelName}</td>
            <td>{accuracy}</td>
            <td className="hidden-xs hidden-sm hidden-md">{controllable}</td>
            <td className="hidden-xs hidden-sm hidden-md">{maxIncline}</td>
            <td className="hidden-xs hidden-sm hidden-md">
              {smartTrainer.maxPower}
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
            <div
              className="col-xs-12 col-sm-offset-5 col-sm-7 col-md-offset-4 col-md-8 "
            >
              <h3>Smart Trainers</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-5 col-md-4">
              <div className={styles.pieChartContainer}>
                <span className={styles.totalBadge}> Sample size {smartTrainers.total}
                </span>
                <PieChart
                  pieKey={`${countryCode}-powermeters`}
                  labels
                  size={275}
                  innerHoleSize={100}
                  data={pieData}
                  padding={10}
                  styles={{
                    '.pie-chart-label': {
                      fontFamily: '"Open Sans", Arial, Helvetica, sans-serif',
                      fontSize: '1.6rem',
                      fontWeight: '600',
                      fill: '#fff'
                    },
                    '.pie-chart-slice': {
                      stroke: '#fff',
                      strokeWidth: '3',
                      opacity: '1'
                    }
                  }}
                  mouseOverHandler={this.mouseOverHandler}
                  mouseOutHandler={this.mouseOutHandler}
                  mouseMoveHandler={this.mouseMoveHandler}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-7 col-md-8">
              <table
                className="table table-bordered table-striped"
                cellSpacing="0"
                width="100%"
              >
                <thead>
                  <tr>                    
                    <th>Share</th>
                    <th className="hidden-xs hidden-sm hidden-md">Make</th>
                    <th>Model</th>
                    <th>Accuracy</th>
                    <th className="hidden-xs hidden-sm hidden-md">Interactive</th>
                    <th className="hidden-xs hidden-sm hidden-md">Max Incline</th>
                    <th className="hidden-xs hidden-sm hidden-md">Max Power</th>
                  </tr>
                </thead>
                <tbody>
                  {smartTrainerRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {this.createTooltip()} 
      </div>
    );
  }
}

export default SmartTrainers;
