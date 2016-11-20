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
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      <div className={editorialStyles.editorialColumn}>
                        <div className={styles.centered}>
                          <div className="alert alert-danger" role="alert">
                            <div className={styles.centered}>
                              <p>
                                This report is&nbsp;<strong>not</strong>&nbsp;an official Zwift resource and is&nbsp;<strong>not</strong>&nbsp;supported by Zwift HQ.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-5">
                      <p>
                        Last Updated: {dateLastUpdateHuman}
                      </p>
                    </div>
                    <div className="col-xs-12 col-sm-5">
                      <div className="pull-right">Total Systems: {totalRecords}</div>
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
