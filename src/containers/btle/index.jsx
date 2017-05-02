/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import structure from '../../styles/structure.css'
import {Chart} from './chart.jsx'

class Btle extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {isLoaded} = this.props
    return isLoaded
      ? this.renderChart()
      : null
  }

  renderChart() {

    const {messages} = this.props

    if (messages && messages.count()) {
      return (
        <div className="container">
          <div className={structure.boxesWrapOuter}>
            <div className={structure.boxesWrapInner}>
              <div className={structure.boxFirstLast}>
                <div className={structure.chartsBoxContent}>
                  <Chart data={this.props}/></div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container">
        <div className="row" style={{height:"30rem"}}>
          <div className="col-sm-12">
            <h3 className={structure.sectionSubHeading}>No devices found</h3>
          </div>
        </div>
      </div>
    )

  }
}

function mapStateToProps(state) {
  const {reader, btle} = state
  return {
    ...reader,
    ...btle
  }
}

Btle.propTypes = {
  reader: PropTypes.object,
  btle: PropTypes.object
}

export default connect(mapStateToProps)(Btle)
