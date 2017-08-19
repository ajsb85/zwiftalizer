var _ = require('underscore');
var moment = require('moment');

import React from 'react';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { colors } from '../../styles/colors';
import { timeAxis } from '../../parser';

import {
  BASIC_DEVICE,
  POWER_METER_DEVICE,
  SMART_TRAINER_DEVICE,
  WAHOO_MANUFACTURER_ID,
  SARIS_MANUFACTURER_ID,
  ELITE_MANUFACTURER_ID
} from '../../parser/constants';

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
} from 'react-timeseries-charts';

import { TimeSeries } from 'pondjs';

import structure from '../../styles/structure.css';

import styles from './styles.css';

import { CHART_HEIGHT, BRUSH_HEIGHT } from '../../styles/constants.js';

const baselineStyle = {
  line: {
    stroke: colors.steel,
    strokeWidth: 1,
    opacity: 1,
    dashed: true
  }
};

const leftLabelAxisLabelWidth = 110;

const leftAxisLabelWidth = 60;

const rightAxisLabelWidth = 60;

const powerFormat = format('d');

const basicDeviceColors = [
  colors.salmonpink,
  colors.sonicblue,
  colors.beige,
  colors.seafoamgreen
];

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
  ]),
  styler([
    {
      key: 'value',
      color: basicDeviceColors[3]
    }
  ])
];

// 3 second max zoom
const minDuration = 3 * 1000;

const signalFormat = format('d');

class Chart extends React.Component {
  constructor(props) {
    super(props);

    const { searches, devices } = props;

    const tracker = null;
    const brushrange = null;
    const timerange = searches.range();
    const initialRange = searches.range();
    const firstTimestamp = moment(searches.begin()).unix() * 1000;
    const lastTimestamp = moment(searches.end()).unix() * 1000;
    const emptyTimeSeries = timeAxis(firstTimestamp, lastTimestamp);

    this.state = {
      searches,
      devices,
      tracker,
      timerange,
      brushrange,
      initialRange,
      emptyTimeSeries
    };

    this.handleTrackerChanged = this.handleTrackerChanged.bind(this);
    this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
    this.renderDevices = this.renderDevices.bind(this);
    this.renderDevice = this.renderDevice.bind(this);
    this.renderSearchesBrush = this.renderSearchesBrush.bind(this);
  }

  handleTrackerChanged(tracker) {
    this.setState({ tracker });
  }

  handleTimeRangeChange(timerange) {
    if (timerange) {
      this.setState({ timerange, brushrange: timerange });
    } else {
      this.setState({ timerange: this.state.initialRange, brushrange: null });
    }
  }

  getMakeAndModel(device) {
    return `${device.manufacturer} ${device.model}`.trim();
  }

  renderCalibration(device) {
    if (device.calibration) {
      const calibrationSuccess = device.calibration.status
        ? 'succesful'
        : 'failed';

      const calibrationValues =
        device.calibration.values[0] + ',' + device.calibration.values[1];

      let autoZero = 'not supported';

      // hack, 4iiii doesn't report auto-zero enabled status properly, but is always enabled
      if (device.manufacturer === '4iiii') {
        autoZero = 'enabled';
      } else if (!_.isUndefined(device.calibration.autoZero)) {
        autoZero = (device.calibration.autoZero ? '' : 'not ') + 'enabled';
      }

      return (
        <h5 className={structure.subHeading}>
          Calibration &nbsp;
          {calibrationSuccess}
          &nbsp;
          <strong>({calibrationValues})</strong>
          &nbsp;auto-zero&nbsp;
          <strong>{autoZero}</strong>
        </h5>
      );
    }

    return null;
  }

  renderDevices(devices) {
    let devicesArray = _.isArray(devices) ? devices : [devices];

    const charts = devicesArray.map((device, i) => {
      return this.renderDevice(device, i);
    });
    return charts;
  }

  renderDevice(device, i) {
    const key = device.deviceId + device.channel;

    let label = `Channel ${device.channel} Device ${device.deviceId} ${device.manufacturer} ${device.model}`
      .replace(/\s(\s)+/, ' ')
      .trim();

    const labelAxisId = 'labelAxis' + i;

    const leftAxisId = 'leftAxis' + i;

    const rightAxisId = 'rightAxis' + i;

    const max = parseInt(signalFormat(device.signal.max()));

    const calibrationMessage = this.renderCalibration(device);

    const style = basicDeviceStyles[i];

    const categories = [
      {
        key: 'value',
        label: 'Signal',
        disabled: false
      }
    ];

    return (
      <div key={key} className={structure.chartContainer}>
        <div className="row">
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>
                {label}
              </h4>
              {calibrationMessage}
              <h5 className={structure.infoHeading}>
                Use the mouse wheel to zoom in. Click and drag to pan.
              </h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend type="swatch" style={style} categories={categories} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-10">
            <Resizable>
              <ChartContainer
                timeRange={this.state.timerange}
                onTimeRangeChanged={this.handleTimeRangeChange}
                padding={0}
                enablePanZoom={true}
                minDuration={minDuration}
                maxTime={this.state.initialRange.end()}
                minTime={this.state.initialRange.begin()}
                showGrid={false}
              >
                <ChartRow height={CHART_HEIGHT} debug={false}>
                  <YAxis
                    id={leftAxisId}
                    label="Signal"
                    min={0}
                    max={max}
                    absolute={true}
                    width={leftAxisLabelWidth}
                    type="linear"
                    format="d"
                  />
                  <Charts>
                    <BarChart
                      axis={leftAxisId}
                      series={device.signal}
                      style={style}
                      columns={['value']}
                    />
                  </Charts>
                  <YAxis
                    id={rightAxisId}
                    label="Signal"
                    min={0}
                    max={max}
                    absolute={true}
                    width={rightAxisLabelWidth}
                    type="linear"
                    format="d"
                  />
                </ChartRow>
              </ChartContainer>
            </Resizable>
          </div>
          <div className="hidden-xs col-sm-2">
            <div className={styles.signalBoxContent}>
              <div className={styles.signalBoxTitle}>Data Rate</div>
              <div className={styles.signalBoxValue}>
                {device.sampleRate}Hz
              </div>
            </div>
            <div className={styles.signalBoxContent}>
              <div className={styles.signalBoxTitle}>Avg RxFails</div>
              <div className={styles.signalBoxValue}>
                {device.failureRate}%
              </div>
            </div>
            <div className={styles.signalBoxContent}>
              <div className={styles.signalBoxTitle}>Searches</div>
              <div className={styles.signalBoxValue}>
                {device.dropoutsTotal}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderSearchesBrush() {
    const style = styler([
      {
        key: 'value',
        color: colors.fiestared
      }
    ]);

    const categories = [
      {
        key: 'value',
        label: 'Searches',
        disabled: false
      }
    ];

    return (
      <div key="searchesBrush" className={structure.chartContainer}>
        <div className="row">
          <div className="col-xs-12 col-sm-offset-1 col-sm-7">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>
                ANT+ device searches/re-syncs
              </h4>
              <h5 className={structure.infoHeading}>
                Fewer is better. One at the start is ideal.
              </h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend type="swatch" style={style} categories={categories} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-10">
            <Resizable>
              <ChartContainer
                timeRange={this.state.initialRange}
                format="HH:mm:ss"
                padding={0}
                trackerPosition={this.state.tracker}
              >
                <ChartRow height={BRUSH_HEIGHT} debug={false}>
                  <Brush
                    timeRange={this.state.brushrange}
                    allowSelectionClear={true}
                    onTimeRangeChanged={this.handleTimeRangeChange}
                  />
                  <YAxis
                    id="searchesBrushAxis"
                    label="Searches"
                    min={0}
                    max={1}
                    width={leftAxisLabelWidth}
                    type="linear"
                    format="d"
                  />
                  <Charts>
                    <BarChart
                      axis="searchesBrushAxis"
                      series={this.state.searches}
                      style={style}
                      columns={['value']}
                    />
                  </Charts>
                  <YAxis
                    id="searchesBrushAxis2"
                    label="Searches"
                    min={0}
                    max={1}
                    width={rightAxisLabelWidth}
                    type="linear"
                    format="d"
                  />
                </ChartRow>
              </ChartContainer>
            </Resizable>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const basicDeviceCharts = this.state.devices
      ? this.renderDevices(this.state.devices)
      : null;

    const brush = this.renderSearchesBrush();

    return (
      <div className={structure.boxesWrapOuter}>
        <div className={structure.boxesWrapInner}>
          <div className={structure.boxFirstLast}>
            <div className={structure.boxHeadingLast}>ANT+ signal quality</div>
            <div className={structure.chartsBoxContent}>
              {basicDeviceCharts}
              {brush}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Chart };
