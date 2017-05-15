var _ = require('underscore');
import React from 'react';
import Powermeters from './powermeters.jsx';
import SmartTrainers from './smartTrainers.jsx';
import structure from '../../styles/structure.css';
import styles from './styles.css';

class Region extends React.Component {
  constructor(props) {
    super(props);
  }

  //@todo, implement panel expand/collapse with persistent state in local storage
  renderPanel(isExpanded) {
    if (!isExpanded) {
      return null;
    }

    const panelStyle = isExpanded
      ? {
          maxHeight: '500rem'
        }
      : {
          maxHeight: 0,
          overflow: 'hidden'
        };

    return (
      <div className={styles.powerSourcesBoxContent} style={panelStyle}>
        <SmartTrainers {...this.props.data} />
        <Powermeters {...this.props.data} />
      </div>
    );
  }

  render() {
    const {
      countryCode,
      countryName
    } = this.props.data;

    const panelKey = this.props.keyName;

    let flagClass = countryCode === '00' ? '' : `flag flag-${countryCode.toLowerCase()}`;

    return (
      <div className={styles.powerSourcesWrapOuter}>
        <div
          className={styles.powerSourcesBoxHeading}
          data-panel-key={panelKey}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
              <span className={flagClass}></span>
                <h3>{countryName}</h3>
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
