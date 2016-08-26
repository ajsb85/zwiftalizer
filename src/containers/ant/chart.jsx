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
import {BASIC_DEVICE, POWER_METER_DEVICE, FEC_DEVICE, WAHOO_KICKR_DEVICE} from '../../parser/constants'

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

const headingRowStyle = {
  marginBottom: '1rem'
}

const searchesStyle = {
  value: {
    normal: {
      fill: colors.fiestared
    }
  }
}

const baselineStyles = {
  solid: {
    stroke: 'steelblue',
    opacity: 0.3,
    width: 1
  },
  dashed: {
    stroke: 'steelblue',
    opacity: 0.3,
    width: 1
  }
}

const chartHeight = 85

const largeChartHeight = 150

const leftLabelAxisLabelWidth = 110

const leftAxisLabelWidth = 60

const rightAxisLabelWidth = 60

const powerFormat = format('d');

const powerOutputStyles = {
  value: {
    stroke: colors.purple,
    strokeWidth: 1.5
  }
}

const wahooGradientChangeStyles = {
  value: {
    stroke: colors.yellow,
    strokeWidth: 1.5
  }
}

const fecGradientChangeStyles = {
  value: {
    stroke: colors.magenta,
    strokeWidth: 1.5
  }
}

const powerSignalStyle = {
  up: [colors.seafoamgreen]
}

const kickrSignalStyle = {
  up: [colors.wahooblue]
}

const fecSignalStyles = {
  up: [colors.tacxblue]
}

const basicDeviceStyles = [
  {
    up: [colors.salmonpink]
  }, {
    up: [colors.sonicblue]
  }, {
    up: [colors.beige]
  }
]

// 15 second max zoom
const minDuration = 15 * 1000

const signalFormat = format('d');

class Chart extends React.Component {

  constructor(props) {
    super(props)

    const {searches, devices} = props

    const tracker = null
    const brushrange = null
    const timerange = searches.range()
    const initialRange = searches.range();
    const firstTimestamp = moment(searches.begin()).unix() * 1000
    const lastTimestamp = moment(searches.end()).unix() * 1000
    const emptyTimeSeries = timeAxis(firstTimestamp, lastTimestamp)

    this.state = {
      searches,
      devices,
      tracker,
      timerange,
      brushrange,
      initialRange,
      emptyTimeSeries
    }

    this.handleTrackerChanged = this.handleTrackerChanged.bind(this)
    this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this)
    this.renderPowerDevice = this.renderPowerDevice.bind(this)
    this.renderKickrDevice = this.renderKickrDevice.bind(this)
    this.renderBasicDevices = this.renderBasicDevices.bind(this)
    this.renderBasicDevice = this.renderBasicDevice.bind(this)
    this.renderSearchesBrush = this.renderSearchesBrush.bind(this)
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

  getMakeAndModel(device) {
    return (device.manufacturer + ' ' + device.model).trim()
  }

  getBatteryClassName(device) {
    return 'fa fa-battery-' + device.batteryLevel
  }

  renderBatteryLevel(device) {

    if (!_.isUndefined(device.batteryLevel)) {

      let batteryLevelSpanStyle = {
        fontSize: '2.4rem',
        marginLeft: '1rem'
      }

      switch (device.batteryLevel) {
        case 0:
        case 1:
          batteryLevelSpanStyle.color = colors.fiestared
          break;

        case 2:
          batteryLevelSpanStyle.color = colors.orange
          break;

        default:
          batteryLevelSpanStyle.color = colors.green
          break;
      }

      return (
        <span style={batteryLevelSpanStyle}>
          <i className={this.getBatteryClassName(device)} aria-hidden="true"></i>
        </span>
      )
    }

    return null
  }

  renderCalibration(device) {

    if (device.calibration) {

      const calibrationSuccess = device.calibration.status
        ? 'succesful'
        : 'failed'

      const calibrationValues = device.calibration.values[0] + ',' + device.calibration.values[1]

      let autoZero = 'not supported'

      // hack, 4iiii doesn't report auto-zero enabled status properly, but is always enabled
      if (device.manufacturer === '4iiii') {
        autoZero = 'enabled'
      } else if (!_.isUndefined(device.calibration.autoZero)) {
        autoZero = (device.calibration.autoZero
          ? ''
          : 'not ') + 'enabled'
      }

      return (
        <h5 className={structure.subHeading}>Calibration {calibrationSuccess}&nbsp;<strong>({calibrationValues})</strong>&nbsp;auto-zero&nbsp;<strong>{autoZero}</strong>
        </h5>
      )

      return null
    }
  }

  renderPowerDevice(device) {

    const key = device.deviceId + device.channel

    let label = ('Device ' + device.deviceId + ' - ' + this.getMakeAndModel(device) + ' Powermeter').replace(/\s(\s)+/, ' ').trim()

    const calibrationMessage = this.renderCalibration(device)

    const batteryLevel = this.renderBatteryLevel(device)

    let minPower = 0
    let avgPower = 0
    let maxPower = 0

    if (device.power && device.power.count() > 0) {
      minPower = parseInt(powerFormat(device.power.min()))
      avgPower = parseInt(powerFormat(device.power.avg()))
      maxPower = parseInt(powerFormat(device.power.max()))
    }

    const maxSignal = parseInt(signalFormat(device.signal.max()))

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}{batteryLevel}</h4>
              {calibrationMessage}
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend
                  type="swatch"
                  categories={[
                  {
                    key: "signal",
                    label: "Signal",
                    disabled: false,
                    style: {
                      fill: colors.seafoamgreen
                    }
                  }, {
                    key: "power",
                    label: "Power",
                    disabled: false,
                    style: {
                      fill: colors.purple
                    }
                  }
                ]}/>
              </div>
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
            <ChartRow height={largeChartHeight} debug={false}>
              <YAxis id="powerWatts" label="Watts" min={minPower} max={maxPower} absolute={true} width={leftAxisLabelWidth} type="linear" format="d"/>
              <Charts>
                <AreaChart axis="powerSignal" series={device.signal} style={powerSignalStyle} columns={{
                  up: ['value']
                }}/>
                <LineChart axis="powerWatts" breakLine={true} series={device.power} style={powerOutputStyles} smooth={true} interpolation="curveBasis"/>
                <Baseline axis="powerWatts" value={avgPower} style={powerOutputStyles.solid}/>
              </Charts>
              <YAxis id="powerSignal" label="Signal" min={0} max={maxSignal} absolute={true} width={rightAxisLabelWidth} type="linear" format="d"/>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  renderFecDevice(device) {

    const key = device.deviceId + device.channel

    let label = ('Device ' + device.deviceId + ' - ' + this.getMakeAndModel(device) + ' Smart Trainer').replace(/\s(\s)+/, ' ').trim()

    const batteryLevel = this.renderBatteryLevel(device)

    let minGrad = 0
    let maxGrad = 0

    if (device.gradient && device.gradient.count() > 0) {
      minGrad = parseInt(device.gradient.min())
      maxGrad = parseInt(device.gradient.max())
    }

    const maxSignal = parseInt(signalFormat(device.signal.max()))

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}{batteryLevel}</h4>
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend
                  type="swatch"
                  categories={[
                  {
                    key: "signal",
                    label: "Signal",
                    disabled: false,
                    style: {
                      fill: colors.tacxblue
                    }
                  }, {
                    key: "resistance",
                    label: "Resistance",
                    disabled: false,
                    style: {
                      fill: colors.magenta
                    }
                  }
                ]}/>
              </div>
            </div>
          </div>
        </div>
        <Resizable >
          <ChartContainer
            timeRange={this.state.timerange}
            onTimeRangeChanged={this.handleTimeRangeChange}
            padding={0}
            enablePanZoom={true}
            minDuration={minDuration}
            maxTime={this.state.initialRange.end()}
            minTime={this.state.initialRange.begin()}
            showGrid={false}>
            <ChartRow height={largeChartHeight} debug={false}>
              <YAxis id="gradientAxis" label="Resistance" min={minGrad} max={maxGrad} absolute={true} width={leftAxisLabelWidth} type="linear" format="+.0%"/>
              <Charts>
                <AreaChart axis="fecSignal" series={device.signal} style={fecSignalStyles} columns={{
                  up: ['value']
                }}/>
                <LineChart axis="gradientAxis" breakLine={true} series={device.gradient} style={fecGradientChangeStyles} smooth={true} interpolation="curveBasis"/>
              </Charts>
              <YAxis id="fecSignal" label="Signal" min={0} max={maxSignal} absolute={true} width={rightAxisLabelWidth} type="linear" format="d"/>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  renderBasicDevices(devices) {
    const charts = devices.map((device, i) => {
      return this.renderBasicDevice(device, i)
    })
    return charts
  }

  renderBasicDevice(device, i) {

    let label = ('Device ' + device.deviceId + ' - ' + this.getMakeAndModel(device) + ' Basic Sensor').replace(/\s(\s)+/, ' ').trim()

    const batteryLevel = this.renderBatteryLevel(device)

    const labelAxisId = 'labelAxis' + i
    const leftAxisId = 'leftAxis' + i
    const rightAxisId = 'rightAxis' + i

    // (one device id, two signals, one on each channel). Device Ids are ints, ''+ to cast to string
    const key = device.deviceId + device.channel
    const max = parseInt(signalFormat(device.signal.max()))

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}{batteryLevel}</h4>
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend
                  type="swatch"
                  categories={[{
                    key: "signal",
                    label: "Signal",
                    disabled: false,
                    style: {
                      fill: basicDeviceStyles[i].up[0]
                    }
                  }
                ]}/>
              </div>
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
              <YAxis id={leftAxisId} label="Signal" min={0} max={max} absolute={true} width={leftAxisLabelWidth} type="linear" format="d"/>
              <Charts>
                <AreaChart axis={leftAxisId} series={device.signal} style={basicDeviceStyles[i]} columns={{
                  up: ['value']
                }}/>
              </Charts>
              <YAxis id={rightAxisId} label="Signal" min={0} max={max} absolute={true} width={rightAxisLabelWidth} type="linear" format="d"/>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  renderKickrDevice(device) {

    const key = device.deviceId + device.channel

    let label = ('Device ' + device.deviceId + ' - ' + this.getMakeAndModel(device)).replace(/\s(\s)+/, ' ').trim()

    const batteryLevel = this.renderBatteryLevel(device)

    let minPower = 0
    let avgPower = 0
    let maxPower = 0

    if (device.power && device.power.count() > 0) {
      minPower = parseInt(powerFormat(device.power.min()))
      avgPower = parseInt(powerFormat(device.power.avg()))
      maxPower = parseInt(powerFormat(device.power.max()))
    }

    const maxSignal = parseInt(signalFormat(device.signal.max()))

    let minGrad = 0
    let maxGrad = 0

    if (device.gradient && device.gradient.count() > 0) {
      minGrad = parseInt(device.gradient.min())
      maxGrad = parseInt(device.gradient.max())
    }

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}{batteryLevel}</h4>
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend
                  type="swatch"
                  categories={[
                  {
                    key: "signal",
                    label: "Signal",
                    disabled: false,
                    style: {
                      fill: colors.wahooblue
                    }
                  }, {
                    key: "power",
                    label: "Power",
                    disabled: false,
                    style: {
                      fill: colors.purple
                    }
                  }, {
                    key: "resistance",
                    label: "Resistance",
                    disabled: false,
                    style: {
                      fill: colors.yellow
                    }
                  }
                ]}/>
              </div>
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
            <ChartRow height={largeChartHeight} debug={false}>
              <YAxis id="powerAxis" label="Power" min={minPower} max={maxPower} absolute={true} width={leftAxisLabelWidth} type="linear" format="d"/>
              <YAxis id="gradientAxis" label="Resistance" min={minGrad} max={maxGrad} absolute={true} width={leftAxisLabelWidth} type="linear" format="+.0%"/>
              <Charts>
                <AreaChart axis="powerSignal" series={device.signal} style={kickrSignalStyle} columns={{
                  up: ['value']
                }}/>
                <LineChart axis="gradientAxis" breakLine={true} series={device.gradient} style={wahooGradientChangeStyles} smooth={true} interpolation="curveBasis"/>
                <LineChart axis="powerAxis" breakLine={true} series={device.power} style={powerOutputStyles} smooth={true} interpolation="curveBasis"/>
                <Baseline axis="powerAxis" value={avgPower} style={powerOutputStyles.solid}/>
              </Charts>
              <YAxis id="powerSignal" label="Signal" min={0} max={maxSignal} absolute={true} width={rightAxisLabelWidth} type="linear" format="d"/>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  renderSearchesBrush() {

    return (
      <div key="searchesBrush" className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>ANT+ device searches</h4>
              <h5 className={structure.infoHeading}>Fewer is better.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend
                  type="swatch"
                  categories={[{
                    key: "searches",
                    label: "Searches",
                    disabled: false,
                    style: {
                      fill: colors.fiestared
                    }
                  }
                ]}/>
              </div>
            </div>
          </div>
        </div>
        <Resizable >
          <ChartContainer timeRange={this.state.initialRange} format="HH:mm:ss" padding={0} trackerPosition={this.state.tracker}>
            <ChartRow height={75} debug={false}>
              <Brush timeRange={this.state.brushrange} allowSelectionClear={true} onTimeRangeChanged={this.handleTimeRangeChange}></Brush>
              <YAxis id="searchesBrushAxis" label="Searches" min={0} max={1} width={leftAxisLabelWidth} type="linear" format="d"></YAxis>
              <Charts>
                <BarChart axis="searchesBrushAxis" series={this.state.searches} style={searchesStyle} columns={["value"]}/>
              </Charts>
              <YAxis id="searchesBrushAxis2" label="Searches" min={0} max={1} width={rightAxisLabelWidth} type="linear" format="d"></YAxis>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    )
  }

  render() {

    // plucking out each device type instead of iterating so that power, kickr, fec always comes before basic devices regardless of the order the devices are in in the state

    const powerDevice = _.find(this.state.devices, device => {
      return (device.type === POWER_METER_DEVICE)
    })

    const powerChart = powerDevice
      ? this.renderPowerDevice(powerDevice)
      : null

    const kickrDevice = _.find(this.state.devices, device => {
      return (device.type === WAHOO_KICKR_DEVICE)
    })

    const kickrChart = kickrDevice
      ? this.renderKickrDevice(kickrDevice)
      : null

    const fecDevice = _.find(this.state.devices, device => {
      return (device.type === FEC_DEVICE)
    })

    const fecChart = fecDevice
      ? this.renderFecDevice(fecDevice)
      : null

    const basicDevices = _.filter(this.state.devices, device => {
      return (device.type === BASIC_DEVICE)
    })

    const basicDeviceCharts = basicDevices
      ? this.renderBasicDevices(basicDevices)
      : null

    const brush = this.renderSearchesBrush()

    return (

      <div className={structure.boxesWrapOuter}>
        <div className={structure.boxesWrapInner}>
          <div className={structure.boxFirstLast}>
            <div className={structure.chartsBoxContent}>
              {kickrChart}
              {powerChart}
              {fecChart}
              {basicDeviceCharts}
              {brush}
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export {Chart}
