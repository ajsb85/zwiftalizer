var moment = require('moment')
  import React, {Component, PropTypes} from 'react'
  import {withRouter} from 'react-router'
  import {connect} from 'react-redux'
  import {load} from '../../actions/benchmarks'
  import Resolution from './resolution.jsx'

  class Benchmarks extends React.Component {

    constructor(props) {

      super(props)

      const {dispatch} = this.props

      setTimeout(() => {
        dispatch(load())
      }, 250)

    }

    render() {

      const {isLoaded} = this.props

      return isLoaded
        ? this.renderBenchmarks()
        : null
    }

    renderBenchmarks() {

      const {resolutions, dateLastUpdate, totalRecords} = this.props

      var resolutionEntries = resolutions && resolutions.map(function(resolution, i) {

        return (<Resolution data={resolution} key={resolution.resolution}/>)
      }, this)

      const dateLastUpdateHuman = moment(dateLastUpdate).format()

      return (
        <div>
          {resolutionEntries}
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                Last Updated: {dateLastUpdateHuman}
              </div>
              <div className="col-xs-12 col-sm-6">
                <div className="pull-right">Total Records: {totalRecords}</div>
              </div>
            </div>
          </div>
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
