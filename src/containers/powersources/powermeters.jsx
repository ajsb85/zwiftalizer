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
          display: 'inline-block',
          minWidth: '6rem',
          padding: '0.3rem 0.7rem',
          fontSize: '1.6rem',
          fontWeight: '600',
          color: '#FFF',          
          lineHeight: '1',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          textAlign: 'center',  
          backgroundColor: powermeter.color,
          borderRadius: '1.5rem',
          border: '0.2rem solid #555',
          fontFamily: "'Proxima Nova', Arial, Helvetica, sans-serif",
          fontWeight: '600'
        };

        const pieKey = `${i+1}`;

        pieData.push({
          key: pieKey,
          value: powermeter.percent,
          color: powermeter.color
        });

        return (
          <tr key={key}>
            <td style={{textAlign:'center'}}>
              <span style={keyStyle}>
                {pieKey}
              </span>
            </td>
            <td>{powermeter.percent} %</td>
            <td>{powermeter.manufacturerName}</td>
            <td className="hidden-xs hidden-sm hidden-md">{powermeter.modelName}</td>
            <td>{accuracy}</td>
          </tr>
        );
      },
      this
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-offset-5 col-sm-7 col-md-offset-4 col-md-8 ">
            <h3>Powermeters            
             </h3>
          </div>
        </div>          
        <div className="row">
          <div className="col-xs-12 col-sm-5 col-md-4">
            <span className={styles.totalBadge}>n= {powermeters.total}</span>
            <div className={styles.pieChartContainer}>
              <PieChart
                labels
                size={275}
                innerHoleSize={135}
                data={pieData}
                padding={10}
                styles={{
                  '.pie-chart-label': {
                    fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                    fontSize: '1.6rem',
                    fill: '#fff'
                  }
                }}
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
                <th>Key</th>
                <th>Usage</th>
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
    );
  }
}

export default Powermeters;
