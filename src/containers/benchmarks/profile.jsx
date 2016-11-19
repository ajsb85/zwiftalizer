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

    const totalSystems = results && results.length
      ? results.length
      : 0;

    var systemWithBestAvg = results && _.max(results, _.property('avgFps'))

    var maxAvgResolutionProfile = systemWithBestAvg
      ? systemWithBestAvg.avgFps
      : 0;

    var systemWithBestMax = results && _.max(results, _.property('maxFps'))

    var maxMaxResolutionProfile = systemWithBestMax
      ? systemWithBestMax.maxFps
      : 0;

    var resultsData = results && results.map(function(result, i) {

      const data = {
        maxAvgResolutionProfile,
        maxMaxResolutionProfile,
        ...result
      }

      const key = resolution.resolution + '-' + profileId + '-' + i

      return (<System data={data} key={key}/>)

    }, this)

    const progressStyle = {
      marginTop: '1rem',
      marginBottom: '0.2rem'
    }

    const barStyle = {
      width: '33.33%',
      minWidth: '0.2rem'
    }

    return (
      <div className={styles.benchmarksWrapOuter}>
        <div className={styles.benchmarksBoxHeading}>{resolution}&nbsp;{name}&nbsp;<span className={styles.badge}>{totalSystems}</span>
        </div>
        <div className={styles.benchmarksBoxContent}>
          <div className="container-fluid">
            <div className="row">
              <div className="hidden-xs col-sm-offset-2 col-sm-5">
                <h3>System</h3>
              </div>
              <div className="hidden-xs col-sm-5">
                <div className="row">

                  <div className="col-xs-6">
                    <h3>FPS</h3>
                  </div>

                  <div className="col-xs-6">
                    <div className="progress" style={progressStyle}>
                      <div className="progress-bar progress-bar-success" role="progressbar" style={barStyle}>
                        Max
                      </div>
                      <div className="progress-bar" role="progressbar" style={barStyle}>
                        Avg
                      </div>
                      <div className="progress-bar progress-bar-warning" role="progressbar" style={barStyle}>
                        Min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="hidden-xs col-sm-offset-7 col-sm-5">
                <p>Ordered by average FPS descending. Longer bars are better.</p>
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
