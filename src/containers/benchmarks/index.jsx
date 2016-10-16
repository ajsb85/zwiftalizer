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

    const {benchmarks} = this.props;

    console.log(benchmarks.data)

    var resolutions = benchmarks && benchmarks.data && benchmarks.data.map(function(resolution, i) {

      return (<Resolution data={resolution} key={resolution.resolution}/>)
    }, this)

    return (
      <div>
        {resolutions}
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
