var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import { PieChart } from 'react-easy-chart';
import ToolTip from '../toolTip/toolTip.jsx';
import shadeColor, { shadeFactor } from './shadeColor.js';

class Powermeters extends React.Component {
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
      rowKey: d.data.rowKey,
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
        const rowKey = `${countryCode}-${powermeter.manufacturerId}-${powermeter.modelId}`;

        const keyColor = shadeColor(powermeter.color, shadeFactor);

        const accuracy = powermeter.accuracy
          ? '+/- ' + powermeter.accuracy * 100 + '%'
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
          fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
          fontWeight: '600'
        };

        // const pieKey = `${i + 1}`;

        const pieKey = `${powermeter.percent}%`

        pieData.push({
          key: pieKey,
          rowKey: rowKey,
          value: powermeter.percent,
          color: keyColor,
          label: `${powermeter.manufacturerName} - ${powermeter.modelName}`
        });

        let highlightStyle = {}
        
        if (this.state.showToolTip && this.state.rowKey === rowKey) {          
          highlightStyle = {backgroundColor: '#FF0'};
        }

        return (
          <tr key={rowKey} style={highlightStyle}>
            <td style={{ textAlign: 'center' }}>
              <span style={keyStyle}>
                {pieKey}
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
            <div
              className="col-xs-12 col-sm-offset-5 col-sm-7 col-md-offset-4 col-md-8 "
            >
              <h3>
                Power Meters
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-5 col-md-4">
              <span className={styles.totalBadge}>Sample size {powermeters.total}</span>
              <div className={styles.pieChartContainer}>
                <PieChart
                  pieKey={`${countryCode}-powermeters`}
                  labels
                  size={275}
                  innerHoleSize={100}
                  data={pieData}
                  padding={10}
                  styles={{
                    '.pie-chart-label': {
                      fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
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
        {this.createTooltip()}        
      </div>
    );
  }
}

export default Powermeters;
