var moment = require('moment');
import React, {Component, PropTypes} from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {load} from '../../actions/benchmarks'
import Resolution from './resolution.jsx'

import structure from '../../styles/structure.css'
import editorialStyles from '../../styles/editorial.css'
import styles from './styles.css'

class Benchmarks extends React.Component {

  constructor(props) {

    super(props)

    const {dispatch} = this.props

    setTimeout(() => {
      dispatch(load())
    }, 100)

  }

  render() {

    const {isLoaded} = this.props

    return isLoaded
      ? this.renderBenchmarks()
      : null
  }

  renderBenchmarks() {

    const {resolutions, dateLastUpdate, totalRecords, expanded} = this.props

    var resolutionEntries = resolutions && resolutions.map(function(resolution, i) {

      const data = Object.assign({}, resolution, {totalRecords, expanded})

      return (<Resolution data={data} key={data.resolution}/>)
    }, this)

    const dateLastUpdateHuman = moment(dateLastUpdate).format()

    return (

      <div className="container-fluid">

        <div className={editorialStyles.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorialStyles.editorialBoxHeading}>
                Zwift System Benchmarks (Community Generated)
              </div>
              <div className={editorialStyles.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-8">
                      <div className={styles.lastUpdateTime}>
                        Last Updated: {dateLastUpdateHuman}
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-4">
                      <div className={styles.systemsCount}>
                        Total systems&nbsp;<span className={styles.systemsCountBadge}>{totalRecords}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {resolutionEntries}

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

Benchmarks.propTypes = {
  benchmarks: PropTypes.object
}

export default connect(mapStateToProps)(Benchmarks)
