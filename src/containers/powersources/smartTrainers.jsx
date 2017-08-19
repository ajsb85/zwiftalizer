var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import shopping from '../../styles/shopping.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';
import { BarChart } from 'react-easy-chart';
import shadeColor, { shadeFactor } from './shadeColor.js';

import {
  AMAZON_US_LABEL,  
  AMAZON_CA_LABEL,  
  AMAZON_UK_LABEL,
  AMAZON_DE_LABEL,
  AMAZON_ES_LABEL,
  AMAZON_FR_LABEL,
  AMAZON_IT_LABEL,  
  AMAZON_US_TAG,
  AMAZON_CA_TAG,
  AMAZON_UK_TAG,
  AMAZON_DE_TAG,
  AMAZON_ES_TAG,
  AMAZON_FR_TAG,
  AMAZON_IT_TAG
} from '../constants/index.js';

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

        var controllable = smartTrainer.controllable ? 'Yes' : 'No';

        if (smartTrainer.modelName.toLowerCase().indexOf('kura') >= 0) {
          controllable = 'Drivo Yes, Kura No';
        }

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

        const chartKey = `${smartTrainerPercentRounded}%`

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
        
        let buyLinksMarkup;
        const buyLinks = [];
        const buyQueryTerms = `${smartTrainer.manufacturerName}${smartTrainer.modelName !== 'Unknown' ? ' ' + smartTrainer.modelName + ' ' : ''} smart trainer`.replace(/\s(\s)+/, ' ').replace(' ', '+');

        buyLinks.push({
          tag: AMAZON_US_LABEL,
          href: `https://www.amazon.com/s?tag=${AMAZON_US_TAG}&keywords=${buyQueryTerms}`
        });
  
        buyLinks.push({
          tag: AMAZON_UK_LABEL,
          href: `https://www.amazon.co.uk/s/?tag=${AMAZON_UK_TAG}&field-keywords=${buyQueryTerms}`
        });
  
        buyLinks.push({
          tag: AMAZON_CA_LABEL,
          href: `https://www.amazon.ca/s/?tag=${AMAZON_CA_TAG}&field-keywords=${buyQueryTerms}`
        });
  
        buyLinks.push({
          tag: AMAZON_DE_LABEL,
          href: `https://www.amazon.de/s/?tag=${AMAZON_DE_TAG}&field-keywords=${buyQueryTerms}`
        });
  
        buyLinks.push({
          tag: AMAZON_ES_LABEL,
          href: `https://www.amazon.es/s/?tag=${AMAZON_ES_TAG}&field-keywords=${buyQueryTerms}`
        });
  
        buyLinks.push({
          tag: AMAZON_FR_LABEL,
          href: `https://www.amazon.fr/s/?tag=${AMAZON_FR_TAG}&field-keywords=${buyQueryTerms}`
        });
  
        buyLinks.push({
          tag: AMAZON_IT_LABEL,
          href: `https://www.amazon.it/s/?tag=${AMAZON_IT_TAG}&field-keywords=${buyQueryTerms}`
        });
  
        buyLinksMarkup = buyLinks.map(function(link, i) {
          return (
            <li key={i}>
              <a target="_blank" href={link.href}>
                {link.tag}
              </a>
            </li>
          );
        }, this);

        return (
          <tr key={rowKey} style={highlightStyle}>
            <td className="hidden-xs hidden-sm hidden-md" style={{ textAlign: 'center' }}>{i+1}</td>
            <td style={{ textAlign: 'center' }}>
              <span style={keyStyle}>
                {chartKey}
              </span>
            </td>          
            <td>
              {smartTrainer.manufacturerName}
            </td>
            <td>{smartTrainer.modelName}</td>
            <td>{accuracy}</td>
            <td className="hidden-xs hidden-sm hidden-md">{controllable}</td>
            <td className="hidden-xs hidden-sm hidden-md">{maxIncline}</td>
            <td className="hidden-xs hidden-sm hidden-md">
              {smartTrainer.maxPower}
            </td>
            <td className="hidden-xs hidden-sm hidden-md">                            
              <ul className={shopping.shoplinks}>
                {buyLinksMarkup}
              </ul>                          
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
                    <th className="hidden-xs hidden-sm hidden-md">Row</th>
                    <th>Share</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Accuracy</th>
                    <th className="hidden-xs hidden-sm hidden-md">Interactive</th>
                    <th className="hidden-xs hidden-sm hidden-md">Max Incline</th>
                    <th className="hidden-xs hidden-sm hidden-md">Max Power</th>
                    <th className="hidden-xs hidden-sm hidden-md">Buy</th>
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
