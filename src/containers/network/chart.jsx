/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
var _ = require('underscore')
var moment = require('moment')

import React from 'react'

import {format} from 'd3-format'
import {timeFormat} from 'd3-time-format'
import {colors} from '../../styles/colors'
import {timeAxis} from '../../parser'

import {
  TimeRange,
  Charts,
  ChartContainer,
  ChartRow,
  Brush,
  YAxis,
  LabelAxis,
  ValueAxis,
  LineChart,
  AreaChart,
  BarChart,
  Legend,
  Resizable,
  Baseline
} from 'react-timeseries-charts'

import {TimeSeries} from 'pondjs'

import structure from '../../styles/structure.css'

// 15 second max zoom
const minDuration = 15 * 1000

const signalFormat = format('d');

const chartHeight = 100

const leftLabelAxisLabelWidth = 110

const leftAxisLabelWidth = 60

const rightAxisLabelWidth = 60

const brushLeftLabelAxisWidth = (2 * leftLabelAxisLabelWidth)

const headingRowStyle = {
  marginBottom: '1rem'
}

const reconnectsStyle = {
  value: {
    normal: {
      fill: colors.fiestared
    }
  }
}

const phoneConnectionAttemtpsStyles = {
  value: {
    normal: {
      fill: colors.orange
    }
  }
}

const errorStyles = {
  value: {
    stroke: colors.fiestared,
    strokeWidth: 1.5
  }
}

class Chart extends React.Component {

  constructor(props) {
    super(props)

    const {reconnects, phoneConnectionAttempts, errors} = props.data;

    const tracker = null
    const brushrange = null
    const timerange = reconnects.range()
    const initialRange = reconnects.range();

    const firstTimestamp = moment(reconnects.begin()).unix() * 1000
    const lastTimestamp = moment(reconnects.end()).unix() * 1000
    const emptyTimeSeries = timeAxis(firstTimestamp, lastTimestamp)

    this.state = {
      reconnects,
      phoneConnectionAttempts,
      errors,
      tracker,
      timerange,
      brushrange,
      initialRange,
      emptyTimeSeries
    }

    this.handleTrackerChanged = this.handleTrackerChanged.bind(this)
    this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this)
    this.renderNetworkSignals = this.renderNetworkSignals.bind(this)
    this.renderPhoneConnectionAttempts = this.renderPhoneConnectionAttempts.bind(this)
    this.renderReconnectsBrush = this.renderReconnectsBrush.bind(this)
  }

  handleTrackerChanged(tracker) {
    this.setState({tracker})
  }

  handleTimeRangeChange(timerange) {
    if (timerange) {
      this.setState({timerange, brushrange: timerange});
    } else {
      this.setState({timerange: this.state.initialRange, brushrange: null});
    }
  }

  renderNetworkSignals() {

    const maxErrors = parseInt(signalFormat(this.state.errors.max()))

    return (
      <div key="networkSignals">

        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-10">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>Network errors</h4>
              <h5 className={structure.infoHeading}>Lower is better. A bump at the beginning is normal.</h5>
            </div>
          </div>
        </div>
        <Resizable>
          <ChartContainer
            timeRange={this.state.timerange}
            onTimeRangeChanged={this.handleTimeRangeChange}
            padding={0}
            enablePanZoom={true}
            minDuration={minDuration}
            maxTime={this.state.initialRange.end()}
            minTime={this.state.initialRange.begin()}
            showGrid={false}>
            <ChartRow height={chartHeight} debug={false}>
              <YAxis id="errors1" label="Errors" min={0} max={maxErrors} absolute={true} width={leftAxisLabelWidth} type="linear" format="d"/>
              <Charts>
                <LineChart axis="errors1" breakLine={true} series={this.state.errors} style={errorStyles} smooth={true} interpolation="curveBasis"/>
              </Charts>
              <YAxis id="errors1" label="Connection Errors" min={0} max={maxErrors} absolute={true} width={rightAxisLabelWidth} type="linear" format="d"/>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  renderPhoneConnectionAttempts() {

    const max = parseInt(signalFormat(this.state.phoneConnectionAttempts.max()))

    return (
      <div key="phoneConnectionAttemptsChart">

        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-10">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>Mobile app connection attempts</h4>
              <h5 className={structure.infoHeading}>Lots of bars here is normal if you don't use the mobile app.</h5>
            </div>
          </div>
        </div>

        <Resizable>
          <ChartContainer
            timeRange={this.state.timerange}
            onTimeRangeChanged={this.handleTimeRangeChange}
            padding={0}
            enablePanZoom={true}
            minDuration={minDuration}
            maxTime={this.state.initialRange.end()}
            minTime={this.state.initialRange.begin()}
            showGrid={false}>
            <ChartRow height={chartHeight} debug={false}>
              <YAxis id="connectionAttempts1" label="Connection Attempts" min={0} max={max} absolute={true} width={leftAxisLabelWidth} type="linear" format="d"/>
              <Charts>
                <BarChart axis="connectionAttempts1" series={this.state.phoneConnectionAttempts} style={phoneConnectionAttemtpsStyles} columns={["value"]}/>
              </Charts>
              <YAxis id="connectionAttempts2" label="Connection Attempts" min={0} max={max} absolute={true} width={rightAxisLabelWidth} type="linear" format="d"/>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  renderReconnectsBrush() {

    return (
      <div key="reconnectsBrush">
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-10">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>Network reconnects</h4>
              <h5 className={structure.infoHeading}>Fewer is better. Empty is perfect.</h5>
            </div>
          </div>
        </div>
        <Resizable >
          <ChartContainer timeRange={this.state.initialRange} format="HH:mm:ss" padding={0} trackerPosition={this.state.tracker}>
            <ChartRow height={chartHeight} debug={false}>
              <Brush timeRange={this.state.brushrange} allowSelectionClear={true} onTimeRangeChanged={this.handleTimeRangeChange}></Brush>
              <YAxis id="reconnectsBrushAxis1" label="Reconnects" min={0} max={1} width={leftAxisLabelWidth} type="linear" format="d"></YAxis>
              <Charts>
                <BarChart axis="reconnectsBrushAxis1" series={this.state.reconnects} style={reconnectsStyle} columns={["value"]}/>
              </Charts>
              <YAxis id="reconnectsBrushAxis2" label="Reconnects" min={0} max={1} width={rightAxisLabelWidth} type="linear" format="d"></YAxis>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  render() {

    const networkSignals = this.renderNetworkSignals()

    const phoneConnectionAttempts = this.renderPhoneConnectionAttempts()

    const brush = this.renderReconnectsBrush()

    return (
      <div>
        {networkSignals}
        {phoneConnectionAttempts}
        {brush}
      </div>
    )
  }
}

export {Chart}
