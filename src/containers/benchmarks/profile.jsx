var _ = require('underscore')

import React from 'react'
import System from './system.jsx'
import structure from '../../styles/structure.css'
import styles from './styles.css'

class Profile extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const {resolution, profileId, results} = this.props.data

    var name = '';

    switch (profileId) {
      case(3):
        {
          name = 'Ultra'
        }
        break;

      case(2):
        {
          name = 'High'
        }
        break;

      case(1):
        {
          name = 'Medium'
        }
        break;

      default:
        name = 'Basic'
        break;
    }

    var systemWithBestAvg = results && _.max(results, _.property('avgFps'))

    var maxAvgResolutionProfile = systemWithBestAvg
      ? systemWithBestAvg.avgFps
      : 0;

    var resultsData = results && results.map(function(result, i) {

      const data = {
        maxAvgResolutionProfile,
        ...result
      }

      return (<System data={data}/>)

    }, this)

    return (
      <div className={styles.benchmarksWrapOuter}>
        <div className={styles.benchmarksBoxHeading}>{resolution}&nbsp;{name}</div>
        <div className={styles.benchmarksBoxContent}>
          <div className="container-fluid">
            <div className="row">
              <div className="hidden-xs col-sm-offset-2 col-sm-6">
                <h3>System</h3>
              </div>
              <div className="hidden-xs col-sm-4">
                <h3>Average FPS</h3>
              </div>
            </div>
            {resultsData}
          </div>
        </div>
      </div>
    )

  }
}

export default Profile
