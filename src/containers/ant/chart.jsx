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
import {BASIC_DEVICE, POWER_METER_DEVICE, FEC_DEVICE, WAHOO_MANUFACTURER_ID} from '../../parser/constants'

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
  Baseline,
  styler
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

const kickrSignalStyle = styler([
  {
    key: 'up',
    color: colors.wahooblue
  }
])

const fecSignalStyles = styler([
  {
    key: 'up',
    color: colors.tacxblue
  }
])

const basicDeviceColors = [colors.salmonpink, colors.sonicblue, colors.beige]

const basicDeviceStyles = [
  styler([
    {
      key: 'value',
      color: basicDeviceColors[0]
    }
  ]),
  styler([
    {
      key: 'value',
      color: basicDeviceColors[1]
    }
  ]),
  styler([
    {
      key: 'value',
      color: basicDeviceColors[2]
    }
  ])
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

    let minPower = 0
    let avgPower = 0
    let maxPower = 0

    if (device.power && device.power.count() > 0) {
      minPower = parseInt(powerFormat(device.power.min()))
      avgPower = parseInt(powerFormat(device.power.avg()))
      maxPower = parseInt(powerFormat(device.power.max()))
    }

    const maxSignal = parseInt(signalFormat(device.signal.max()))

    const style = styler([
      {
        key: 'value',
        color: colors.seafoamgreen
      }, {
        key: 'power',
        color: colors.purple,
        width: 1.5
      }
    ])

    const categories = [
      {
        key: 'value',
        label: 'Signal',
        disabled: false
      }, {
        key: 'power',
        label: 'Power',
        disabled: false
      }
    ]

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}</h4>
              {calibrationMessage}
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend type="swatch" style={style} categories={categories}/>
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
                <AreaChart axis="powerSignal" series={device.signal} style={style} columns={{
                  up: ['value']
                }}/>
                <LineChart axis="powerWatts" breakLine={true} series={device.power} style={style} smooth={true} interpolation="curveBasis"/>
                <Baseline axis="powerWatts" value={avgPower} style={baselineStyles.solid}/>
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

    let minGrad = 0
    let maxGrad = 0

    //console.log(device.gradient.toJSON())

    if (device.gradient && device.gradient.count() > 0) {
      minGrad = parseInt(device.gradient.min())
      maxGrad = parseInt(device.gradient.max())
    }

    const maxSignal = parseInt(signalFormat(device.signal.max()))

    const style = styler([
      {
        key: 'value',
        color: colors.tacxblue
      }, {
        key: 'resistance',
        color: colors.magenta
      }
    ])

    const categories = [
      {
        key: 'value',
        label: 'Signal',
        disabled: false
      }, {
        key: 'resistance',
        label: 'Resistance',
        disabled: false
      }
    ]

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}</h4>
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend type="swatch" style={style} categories={categories}/>
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
              <YAxis id="gradientAxis" label="Resistance" min={minGrad} max={maxGrad} absolute={true} width={leftAxisLabelWidth} type="linear" format=",.2f"/>
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

    const labelAxisId = 'labelAxis' + i
    const leftAxisId = 'leftAxis' + i
    const rightAxisId = 'rightAxis' + i

    // (one device id, two signals, one on each channel). Device Ids are ints, ''+ to cast to string
    const key = device.deviceId + device.channel
    const max = parseInt(signalFormat(device.signal.max()))

    const style = basicDeviceStyles[i]

    const categories = [
      {
        key: 'value',
        label: 'Signal',
        disabled: false
      }
    ]

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}</h4>
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend type="swatch" style={style} categories={categories}/>
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
                <AreaChart axis={leftAxisId} series={device.signal} style={style} columns={{
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

    const style = styler([
      {
        key: 'value',
        color: colors.wahooblue
      }, {
        key: 'power',
        color: colors.purple
      }, {
        key: 'resistance',
        color: colors.yellow
      }
    ])

    const categories = [
      {
        key: 'value',
        label: 'Signal',
        disabled: false
      }, {
        key: 'power',
        label: 'Power',
        disabled: false
      }, {
        key: 'resistance',
        label: 'Resistance',
        disabled: false
      }
    ]

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>{label}</h4>
              <h5 className={structure.infoHeading}>Denser area is better. Use the mouse wheel to zoom in. Click and drag to pan.</h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend type="swatch" style={style} categories={categories}/>
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
              <YAxis id="gradientAxis" label="Resistance" min={minGrad} max={maxGrad} absolute={true} width={leftAxisLabelWidth} type="linear" format=",.2f"/>
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

    const style = styler([
      {
        key: 'value',
        color: colors.fiestared
      }
    ])

    const categories = [
      {
        key: 'value',
        label: 'Searches',
        disabled: false
      }
    ]

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
                <Legend type="swatch" style={style} categories={categories}/>
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
                <BarChart axis="searchesBrushAxis" series={this.state.searches} style={style} columns={["value"]}/>
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
      return (device.type === FEC_DEVICE && device.manufacturerId === WAHOO_MANUFACTURER_ID)
    })

    const kickrChart = kickrDevice
      ? this.renderKickrDevice(kickrDevice)
      : null

    const fecDevice = _.find(this.state.devices, device => {
      return (device.type === FEC_DEVICE)
    })

    const fecChart = fecDevice && !kickrDevice
      ? this.renderFecDevice(fecDevice)
      : null

    const basicDevices = _.filter(this.state.devices, device => {
      return (device.type === BASIC_DEVICE)
    })

    const basicDeviceCharts = basicDevices
      ? this.renderBasicDevices(basicDevices)
      : null

    const brush = this.renderSearchesBrush()

    // {kickrChart}  {fecChart}

    return (

      <div className={structure.boxesWrapOuter}>
        <div className={structure.boxesWrapInner}>
          <div className={structure.boxFirstLast}>
            <div className={structure.chartsBoxContent}>
              {powerChart}
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
