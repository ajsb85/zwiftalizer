var _ = require('underscore');
const _find = require('lodash/find');
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {toggleProfilePanel} from '../../actions/benchmarks'
import System from './system.jsx'
import structure from '../../styles/structure.css'
import styles from './styles.css'
import {colors} from '../../styles/colors'

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.togglePanel = this.togglePanel.bind(this)
  }

  togglePanel(e) {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch(toggleProfilePanel(e.currentTarget.getAttribute('data-panel-key')))
  }

  getPerformanceScoreMarkup(score) {
    const items = []

    for (let i = 0, len = score; i < len; i++) {
      const key = i + 1
      items.push(
        <i className="fa fa-thumbs-up" key={key}></i>
      )

    }

    return items
  }

  renderPanel(isExpanded) {

    if (!isExpanded) {
      return null
    }

    const {resolution, totalRecords, profileId, results} = this.props.data

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

      const key = resolution + '-' + profileId + '-' + i

      return (<System data={data} key={key}/>)

    }, this)

    const panelStyle = isExpanded
      ? {
        maxHeight: '5000rem'
      }
      : {
        maxHeight: 0,
        overflow: 'hidden'
      }

    const progressStyle = {
      marginTop: '1rem',
      marginBottom: '0.2rem'
    }

    const barStyle = {
      width: '33.33%',
      minWidth: '0.2rem'
    }

    return (
      <div className={styles.benchmarksBoxContent} style={panelStyle}>
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
              <p>Ordered by average FPS descending.<br/>
                Longer bars are better.</p>
            </div>
          </div>
          {resultsData}
        </div>
      </div>
    )

  }

  render() {

    const {resolution, totalRecords, profileId, results, expanded} = this.props.data

    const panelKey = this.props.keyName

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

    // a 'score' for the current resolution and profile combination works out as a scale of 3/10 to 10/10
    var performanceScore = Math.round(resolution / 395) + profileId + 2;

    // ultra 1080 is pretty awesome, so fudge this one
    if (profileId === 3 && resolution === 1080) {
      performanceScore = 9
    }

    const maxScore = 10;

    var performanceScoreStyle = {
      background: colors.green,
      border: '0.2rem solid ' + colors.greenBorder
    }

    var opinion = 'Unicorns and rainbows!'

    if (performanceScore <= 8) {
      opinion = 'Sweet spot!'
      performanceScoreStyle = {
        background: colors.tacxblueMuted,
        border: '0.2rem solid ' + colors.tacxblueBorder
      }
    }

    if (performanceScore <= 5) {
      opinion = 'Gets the job done!'
      performanceScoreStyle = {
        background: colors.yellow,
        border: '0.2rem solid ' + colors.yellowBorder
      }
    }

    const totalSystems = results && results.length
      ? results.length
      : 0;

    const percentage = Math.round(totalSystems / totalRecords * 100) + '%'

    const isExpanded = _find(expanded, function(panel) {
      return panel === panelKey
    })

    return (

      <div className={styles.benchmarksWrapOuter}>
        <div onClick={this.togglePanel} className={styles.benchmarksBoxHeading} data-panel-key={panelKey}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-1 col-sm-1 col-md-1">
                {isExpanded
                  ? <i className="fa fa-minus"></i>
                  : <i className="fa fa-plus"></i>}
              </div>
              <div className="col-xs-11 col-sm-3 col-md-2">
                {resolution}&nbsp;{name}
              </div>
              <div className="hidden-xs hidden-sm col-md-6">
                <span className={styles.badge} style={performanceScoreStyle}>{performanceScore}/{maxScore}</span>&nbsp;<span className={styles.thumbs}>{this.getPerformanceScoreMarkup(performanceScore)}</span>&nbsp;<span className={styles.opinion}>{opinion}</span>
              </div>
              <div className="col-xs-offset-1 col-xs-11 col-sm-offset-0 col-sm-8 col-md-offset-0 col-md-3">
                <div className={styles.systemsCount}>
                  <span className={styles.systemsCountBadge}>{totalSystems}/{totalRecords}</span>&nbsp;<span className={styles.systemsCountBadge}>{percentage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.renderPanel(isExpanded)}

      </div>

    )
  }
}

function mapStateToProps(state) {
  const {benchmarks} = state
  return {
    ...benchmarks
  }
}

Profile.propTypes = {
  benchmarks: PropTypes.object
}

export default connect(mapStateToProps)(Profile)
