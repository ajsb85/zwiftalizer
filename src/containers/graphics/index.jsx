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
import {Specs} from './specs.jsx'
import {Chart} from './chart.jsx'

class Graphics extends React.Component {

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

    // fpsData, fpsSamples, specs come from ...graphics spread operator
    const {fpsData, fpsSamples, specs} = this.props;


    return (
      <div>
        <Specs specs={specs}/>
        <Chart data={fpsData} samples={fpsSamples} specs={specs}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {reader, graphics} = state
  return {
    ...reader,
    ...graphics
  }
}

Graphics.propTypes = {
  reader: PropTypes.object,
  graphics: PropTypes.object
}

export default connect(mapStateToProps)(Graphics)
