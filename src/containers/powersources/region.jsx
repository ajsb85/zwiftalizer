var _ = require('underscore');
import React from 'react';
import structure from '../../styles/structure.css';
import styles from './styles.css';
import { colors } from '../../styles/colors';

class Region extends React.Component {
  constructor(props) {
    super(props);
  }

  isObject = val => {
    if (val === null) {
      return false;
    }
    return typeof val === 'function' || typeof val === 'object';
  };

  renderPanel(isExpanded) {
    if (!isExpanded) {
      return null;
    }

    console.log(this.props.data);

    const {
      powermeters,
      smartTrainers,
      countryCode
    } = this.props.data;

    const panelStyle = isExpanded
      ? {
          maxHeight: '100rem'
        }
      : {
          maxHeight: 0,
          overflow: 'hidden'
        };

    const orderedSmartTrianers = _.sortBy(smartTrainers.data, t => {
      return t.percent;
    }).reverse();

    var smartTrainersMarkup = orderedSmartTrianers.map(
      function(smartTrainer, i) {
        const key = `${countryCode}-${smartTrainer.manufacturerId}-${smartTrainer.modelId}`;

        const accuracy = smartTrainer.accuracy
          ? '+/- ' + smartTrainer.accuracy * 100 + '%'
          : 'Unknown';

        const controllable = smartTrainer.controllable ? 'Yes' : 'No';

        const maxIncline = smartTrainer.maxIncline
          ? smartTrainer.maxIncline * 100 + ' %'
          : 'Unknown';

        const keyStyle = {
        color: smartTrainer.color
        };

        return (
          <tr key={key}>
            <td><span style={keyStyle}><i className="fa fa-square" aria-hidden="true"></i></span></td>
            <td>{smartTrainer.manufacturerName}</td>
            <td>{smartTrainer.modelName}</td>
            <td>{accuracy}</td>
            <td>{controllable}</td>
            <td>{maxIncline}</td>
            <td>{smartTrainer.percent} %</td>
          </tr>
        );
      },
      this
    );

    // need to make these separate React components
    if (!this.isObject(powermeters) || !powermeters.data) {
      return null;
    }

    const orderedPowermeters = _.sortBy(powermeters.data, t => {
      return t.percent;
    }).reverse();

    var powermetersMarkup = orderedPowermeters.map(
      function(powermeter, i) {
        const key = `${countryCode}-${powermeter.manufacturerId}-${powermeter.modelId}`;

        const accuracy = powermeter.accuracy
          ? '+/- ' + powermeter.accuracy * 100 + '%'
          : 'Unknown';

        const keyStyle = {
            color: powermeter.color
        };

        return (
          <tr key={key}>
            <td><span style={keyStyle}><i className="fa fa-square" aria-hidden="true"></i></span></td>
            <td>{powermeter.manufacturerName}</td>
            <td>{powermeter.modelName}</td>
            <td>{accuracy}</td>
            <td>{powermeter.percent} %</td>
          </tr>
        );
      },
      this
    );

    return (
      <div className={styles.powerSourcesBoxContent} style={panelStyle}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-7">
              <h3 className="">Smart Trainers</h3>
              <div className="table-responsive">
                <table
                  className="table table-bordered table-striped"
                  cellSpacing="0"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Accuracy</th>
                      <th>Interactive</th>
                      <th>Max Incline</th>
                      <th>Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smartTrainersMarkup}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-xs-12 col-sm-5">
              <h3 className="">Powermeters</h3>
              <div className="table-responsive">
                <table
                  className="table table-bordered table-striped"
                  cellSpacing="0"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Accuracy</th>
                      <th>Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {powermetersMarkup}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      countryCode,
      countryName
    } = this.props.data;

    const panelKey = this.props.keyName;

    //   const isExpanded = _find(expanded, function(panel) {
    //       return panel === panelKey;
    //     });

    const isExpanded = true;

    return (
      <div className={styles.powerSourcesWrapOuter}>
        <div
          className={styles.powerSourcesBoxHeading}
          data-panel-key={panelKey}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-1 col-sm-1 col-md-1">
                {isExpanded
                  ? <i className="fa fa-minus" />
                  : <i className="fa fa-plus" />}
              </div>
              <div className="col-xs-11 col-sm-11 col-md-11">
                {countryName}
              </div>
            </div>
          </div>
        </div>

        {this.renderPanel(true)}

      </div>
    );
  }
}

export default Region;
