/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import structure from '../../styles/structure.css'
import {Chart} from './chart.jsx'

class Network extends React.Component {

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

    return (
      <div className="container">       
        <Chart data={this.props}/>             
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {reader, network} = state
  return {
    ...reader,
    ...network
  }
}

Network.propTypes = {
  reader: PropTypes.object,
  network: PropTypes.object
}

export default connect(mapStateToProps)(Network)
