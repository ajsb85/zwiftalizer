const _ = require('underscore');
const moment = require('moment');

import React from 'react';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { colors } from '../../styles/colors';
import { timeAxis } from '../../parser';

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
  BarChart,
  Legend,
  Resizable,
  Baseline,
  styler
} from 'react-timeseries-charts';

import { TimeSeries } from 'pondjs';

import structure from '../../styles/structure.css';

import { CHART_HEIGHT, BRUSH_HEIGHT } from '../../styles/constants.js';

// 15 second max zoom
const minDuration = 15 * 1000;

const signalFormat = format('d');

const leftLabelAxisLabelWidth = 110;

const leftAxisLabelWidth = 60;

const rightAxisLabelWidth = 60;

const brushLeftLabelAxisWidth = 2 * leftLabelAxisLabelWidth;

const headingRowStyle = {
  marginBottom: '1rem'
};

const messagesStyle = styler([
  {
    key: 'value',
    color: colors.sonicblue,
    width: 1.5
  }
]);

class Chart extends React.Component {
  constructor(props) {
    super(props);

    const { messages } = props.data;

    const tracker = null;
    const brushrange = null;
    const timerange = messages.range();
    const initialRange = messages.range();

    const firstTimestamp = moment(messages.begin()).unix() * 1000;
    const lastTimestamp = moment(messages.end()).unix() * 1000;
    const emptyTimeSeries = timeAxis(firstTimestamp, lastTimestamp);

    this.state = {
      messages,
      tracker,
      timerange,
      brushrange,
      initialRange,
      emptyTimeSeries
    };

    this.handleTrackerChanged = this.handleTrackerChanged.bind(this);
    this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
    this.renderBtleMessages = this.renderBtleMessages.bind(this);
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

  renderBtleMessages() {
    const maxMessages = parseInt(signalFormat(this.state.messages.max()));

    const legendCategories = [
      {
        key: 'messages',
        label: 'Messages',
        disabled: false
      }
    ];

    const style = styler([
      {
        key: 'value',
        color: colors.sonicblue
      }
    ]);

    const legendStyle = styler([
      {
        key: 'messages',
        color: colors.sonicblue
      }
    ]);

    return (
      <div key="btleMessages">
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-9">
            <div className={structure.alignLeft}>
              <h4 className={structure.heading}>BTLE Messages</h4>
              <h5 className={structure.infoHeading}>
                Use the mouse wheel to zoom in. Click and drag to pan.
              </h5>
            </div>
          </div>
          <div className="col-xs-12 col-sm-2">
            <div className="pull-right">
              <div className={structure.legendWrapper}>
                <Legend
                  type="swatch"
                  style={legendStyle}
                  categories={legendCategories}
                />
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
            showGrid={false}
          >
            <ChartRow height={CHART_HEIGHT} debug={false}>
              <YAxis
                id="messages1"
                label="Messages"
                min={0}
                max={maxMessages}
                absolute={true}
                width={leftAxisLabelWidth}
                type="linear"
                format="d"
              />
              <Charts>
                <BarChart
                  axis="messages1"
                  series={this.state.messages}
                  style={messagesStyle}
                  columns={['value']}
                />
              </Charts>
              <YAxis
                id="messages2"
                label="Messages"
                min={0}
                max={maxMessages}
                absolute={true}
                width={leftAxisLabelWidth}
                type="linear"
                format="d"
              />
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    );
  }

  renderBrush() {
    const maxMessages = parseInt(signalFormat(this.state.messages.max()));

    const style = styler([
      {
        key: 'value',
        color: colors.sonicblue
      }
    ]);

    return (
      <div key="messagesBrush">
        <div className="row" style={headingRowStyle}>
          <div className="col-xs-12 col-sm-offset-1 col-sm-10" />
        </div>
        <Resizable>
          <ChartContainer
            timeRange={this.state.initialRange}            
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
                id="messages1"
                label="Messages"
                min={0}
                max={maxMessages}
                absolute={true}
                width={leftAxisLabelWidth}
                type="linear"
                format="d"
              />
              <Charts>
                <BarChart
                  axis="messages1"
                  series={this.state.messages}
                  style={messagesStyle}
                  columns={['value']}
                />
              </Charts>
              <YAxis
                id="messages2"
                label="Messages"
                min={0}
                max={maxMessages}
                absolute={true}
                width={leftAxisLabelWidth}
                type="linear"
                format="d"
              />
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>
    );
  }

  render() {
    const btleMessages = this.renderBtleMessages();
    const brush = this.renderBrush();
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className={structure.boxesWrapOuter}>
            <div className={structure.boxesWrapInner}>
              <div className={structure.boxFirstLast}>
                <div className={structure.boxHeadingLast}>
                  BTLE Signal Quality
                </div>
                <div className={structure.chartsBoxContent}>
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      {btleMessages}
                      {brush}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Chart };
