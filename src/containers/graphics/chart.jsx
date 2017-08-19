/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react'

import {format} from 'd3-format';

import {timeFormat} from 'd3-time-format';

import {colors} from '../../styles/colors'

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
  Legend,
  Resizable,
  Baseline,
  styler
} from 'react-timeseries-charts'

import {
  load,
  getPerformanceScore,
  openProfilePanel
} from '../../actions/benchmarks';

import {TimeSeries} from 'pondjs';

import structure from '../../styles/structure.css'

import {CHART_HEIGHT, BRUSH_HEIGHT} from '../../styles/constants.js';

/* Frame rates are very subjective. */
/* Based on community feedback, and the fact that the majority of users have */
/* Intel HD integrated graphics, not discrete GPUs, I have decided to make these tiers low */
/* Basically, if it works, all is good, but can be better, or best */
const bestThreshold = 30
const betterThreshold = 15

const bestStyle = {
  color: colors.green
}

const betterStyle = {
  color: colors.orange
}

const goodStyle = {
  color: colors.fiestared
}

const primaryStyle = styler([
  {
    key: 'value',
    color: colors.brand,
    width: 1.5
  }
])

const baselineStyle = {
  line: {
    stroke: colors.steel,
    strokeWidth: 1,
    opacity: 1,
    dashed: true
  }
}

// 15 second max zoom
const minDuration = 15 * 1000

const fpsFormat = format('d');

class Chart extends React.Component {

  constructor(props) {
    super(props)

    this.seeInBenchMarksClicked = this.seeInBenchMarksClicked.bind(this);

    this.fpsSeries = props.data;

    //this.fpsSeries = new TimeSeries(props.data);

    const specs = props.specs

    const tracker = null
    const timerange = this.fpsSeries.range()
    const brushrange = null
    const minOverall = this.fpsSeries.min()
    const maxOverall = this.fpsSeries.max()
    const avgOverall = this.fpsSeries.avg()
    const stdevOverall = this.fpsSeries.stdev()

    // @todo, find mid-point, then extend 40% either side
    const initialRange = this.fpsSeries.range();

    const samples = Math.round(props.samples)

    let samplesStr = samples + ''

    if (samples && samples > 1000) {
      samplesStr = (samples / 1000).toFixed(2)
      // remove trailing zero, if exists
      samplesStr = samplesStr.replace(/^(\d*?)\.(\d)0$/, '$1.$2') + 'k'
    }

    const fpsSummaryValues = [
      {
        label: 'Max',
        value: fpsFormat(maxOverall)
      }, {
        label: 'Avg',
        value: fpsFormat(avgOverall)
      }, {
        label: 'Min',
        value: fpsFormat(minOverall)
      }
    ]

    this.state = {
      tracker,
      timerange,
      initialRange,
      brushrange,
      samplesStr,
      minOverall,
      maxOverall,
      avgOverall,
      stdevOverall,
      fpsSummaryValues,      
      ...specs
    }

    this.handleTrackerChanged = this.handleTrackerChanged.bind(this)

    this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this)
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

 seeInBenchMarksClicked(e) {
    e.preventDefault();

    const { currentSystem, dispatch } = this.props;

    if (!currentSystem) {
      return;
    }

    // force open the panel that contains the current system before scrolling 
    // incase the user closed it (this just sets up the preference for opening the panel after the bench marks loads)
    dispatch(openProfilePanel(currentSystem.panelKey));

    var callback = () => {
      // route to the benchmarks page
      this.props.history.push({ pathname: '/benchmarks' });

      // scroll to the current system, with enough delay to wait for the router redirect to benchmarks to complete rendering
      setTimeout(() => {
        const anchorToScrollTo = document.getElementById('current');
        anchorToScrollTo &&
          anchorToScrollTo.scrollIntoView(false /* align top */);
      }, 500);
    };

    setTimeout(() => {
      dispatch(load(callback));
    }, 100);
  }

  render() {

    const tr = this.state.timerange;
    const fpsBegin = this.fpsSeries.bisect(tr.begin());
    const fpsEnd = this.fpsSeries.bisect(tr.end());
    const fpsCropped = this.fpsSeries.slice(fpsBegin, fpsEnd);

    let min = Math.round(fpsCropped.min())
    let max = Math.round(fpsCropped.max())
    let avg = Math.round(fpsCropped.avg())
    let stdev = Math.round(fpsCropped.stdev())

    // Get the fps at the current tracker position
    let fpsValue = '--';

    if (this.state.tracker) {
      const fpsIndexAtTracker = fpsCropped.bisect(new Date(this.state.tracker))
      const fpsAtTracker = Math.round(fpsCropped.at(fpsIndexAtTracker).get('value'))
      if (fpsAtTracker) {
        fpsValue = fpsAtTracker;
      }
    }

    const trackerValues = [
      {
        label: 'FPS',
        value: fpsValue
      }
    ]

    const style = styler([
      {
        key: 'value',
        color: colors.brand
      }
    ]);

    const categories = [
      {
        key: 'value',
        label: 'FPS',
        disabled: false
      }
    ];

    return (
      <div className="container">
        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxFirst}>
              <div className={structure.boxHeading}>PROFILE</div>
              <div className={structure.boxContent}>{this.state.profile}</div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>RESOLUTION</div>
              <div className={structure.boxContent}>{this.state.resolution}</div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>SHADOW RES</div>
              <div className={structure.boxContent}>{this.state.shadowres}</div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>AVG</div>
              <div
                className={structure.boxContent}
                style={avg >= bestThreshold
                ? bestStyle
                : (avg >= betterThreshold
                  ? betterStyle
                  : goodStyle)}>{avg}</div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>MIN</div>
              <div
                className={structure.boxContent}
                style={min >= bestThreshold
                ? bestStyle
                : (min >= betterThreshold
                  ? betterStyle
                  : goodStyle)}>{min}</div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>MAX</div>
              <div
                className={structure.boxContent}
                style={max >= bestThreshold
                ? bestStyle
                : (max >= betterThreshold
                  ? betterStyle
                  : goodStyle)}>{max}</div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>STDEV</div>
              <div className={structure.boxContent}>{stdev}</div>
            </div>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>SAMPLES</div>
              <div className={structure.boxContent}>{this.state.samplesStr}</div>
            </div>
          </div>
        </div>          
        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxFirstLast}>
              <div className={structure.boxHeadingLast}>
                Graphics Performance
              </div>
              <div className={structure.chartsBoxContent}>
                <div className="row">
                  <div className="col-xs-12 col-sm-offset-1 col-sm-7">
                    <div className={structure.alignLeft}>
                      <h4 className={structure.heading}>Frames Per Second</h4>
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
                <div>                  
                  <Resizable>
                    <ChartContainer
                      timeRange={this.state.timerange}
                      trackerPosition={this.state.tracker}
                      onTrackerChanged={this.handleTrackerChanged}
                      onTimeRangeChanged={this.handleTimeRangeChange}
                      enablePanZoom={true}
                      minDuration={minDuration}
                      maxTime={this.state.initialRange.end()}
                      minTime={this.state.initialRange.begin()}
                      showGrid={false}>
                      <ChartRow height={CHART_HEIGHT} debug={false} trackerValues={trackerValues} trackerHintHeight={30}>
                        <LabelAxis id="fpsAxis" label="FPS" values={this.state.fpsSummaryValues} min={this.state.minOverall} max={this.state.maxOverall} width={100} type="linear" format="d"/>
                        <Charts>
                          <LineChart axis="fpsAxis" series={this.fpsSeries} style={primaryStyle} smooth={true} interpolation="curveBasis"/>
                          <Baseline axis="fpsAxis" value={this.state.avgOverall} style={baselineStyle} label="Avg" position="left"/>
                        </Charts>
                        <ValueAxis id="trackerValueAxis" value={fpsValue} detail="FPS" width={60} min={this.state.minOverall} max={this.state.maxOverall}/>
                      </ChartRow>
                    </ChartContainer>
                  </Resizable>
                  <Resizable>
                    <ChartContainer timeRange={this.state.initialRange} format="HH:mm:ss" trackerPosition={this.state.tracker}>
                      <ChartRow height={BRUSH_HEIGHT} debug={false}>
                        <Brush timeRange={this.state.brushrange} allowSelectionClear={true} onTimeRangeChanged={this.handleTimeRangeChange}></Brush>
                        <YAxis id="fpsBrushAxis" label="FPS" min={this.state.minOverall - 5} max={this.state.maxOverall + 5} width={100} type="linear" format="d"></YAxis>
                        <Charts>
                          <LineChart axis="fpsBrushAxis" series={this.fpsSeries} style={primaryStyle} smooth={true} interpolation="curveBasis"/>
                          <Baseline axis="fpsBrushAxis" value={this.state.avgOverall} style={baselineStyle}/>
                        </Charts>
                        <YAxis id="fpsBrushAxis2" label="FPS" min={this.state.minOverall - 5} max={this.state.maxOverall + 5} width={60} type="linear" format="d"></YAxis>
                      </ChartRow>
                    </ChartContainer>
                  </Resizable>                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export {Chart}
