import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import structure from '../../styles/structure.css'
import styles from './styles.css'
var moment = require('moment')

class Activity extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {isLoaded} = this.props
    return isLoaded
      ? this.renderActivity()
      : null
  }

  renderActivity() {

    const {startDate, startTime, humanizedDuration} = this.props;

    const friendlyDate = moment(startDate, 'YYYY-MM-DD').format('MMM Do YYYY')

    // <div className="row">   <div className="col-sm-12">     <h2 className={structure.sectionHeading}>Activity</h2>   </div> </div>

    return (
      <div className="container">
        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxFirst}>
              <div className={structure.boxHeading}>Date</div>
              <div className={styles.activityBoxContent}>{friendlyDate}</div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>Time</div>
              <div className={styles.activityBoxContent}>{startTime}</div>
            </div>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>Duration</div>
              <div className={styles.activityBoxContent}>{humanizedDuration}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {reader, activity} = state
  return {
    ...reader,
    ...activity
  }
}

Activity.propTypes = {
  reader: PropTypes.object,
  activity: PropTypes.object
}

export default connect(mapStateToProps)(Activity)