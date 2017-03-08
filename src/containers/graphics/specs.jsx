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
import {withRouter} from 'react-router'
import {load, getPerformanceScore, openProfilePanel} from '../../actions/benchmarks'
import Badge from '../badge'
import structure from '../../styles/structure.css'
import images from '../../styles/images.css'
import editorial from '../../styles/editorial.css'

const isFire = (str) => {
  if (!str) {
    return false
  }
  return str.match(/(.*)fire(.*)/i)
}

class Specs extends React.Component {

  constructor(props) {
    super(props)

    this.seeInBenchMarksClicked = this.seeInBenchMarksClicked.bind(this)

    const specs = props.specs

    let gpuClass = null

    const {gpuVendor, gpuDetails} = specs

    if (gpuVendor) {

      switch (gpuVendor.toLowerCase()) {
        case('amd'):
          if (isFire(gpuDetails)) {
            gpuClass = images.firepro
          } else {
            gpuClass = images.radeon
          }
          break

          //@todo, parse actual GPU data to get radeon or firegl
        case('ati'):
          if (isFire(gpuDetails)) {
            gpuClass = images.firepro
          } else {
            gpuClass = images.ati
          }
          break

          //@todo, parse actual GPU data to get HD or Iris
        case('intel'):
          gpuClass = images.intel
          break

        case('nvidia'):
          gpuClass = images.nvidia
          break

        case('apple'):
          gpuClass = images.mac
          break

          //@todo, add a graphic for unknown
        default:
          gpuClass = null
          break
      }
    }

    this.state = {
      gpuClass,
      ...specs
    }

  }

  seeInBenchMarksClicked(e) {

    e.preventDefault()

    const {currentSystem, dispatch} = this.props

    if (!currentSystem) {
      return;
    }

    // force open the panel that contains the current system before scrolling incase the user closed it (this just sets up the preference for opening the panel after the bench marks
    // loads)
    dispatch(openProfilePanel(currentSystem.panelKey))

    var callback = () => {

      // route to the benchmarks page
      this.props.router.push('/benchmarks')

      // scroll to the current system, with enough delay to wait for the router redirect to benchmarks to complete rendering
      setTimeout(() => {
        const anchorToScrollTo = document.getElementById('current')
        anchorToScrollTo && anchorToScrollTo.scrollIntoView(true/* align top */)
      }, 500)

    }

    setTimeout(() => {
      dispatch(load(callback))
    }, 100)

  }

  render() {

    const {currentSystem} = this.props

    var performanceScore = getPerformanceScore(currentSystem.resolution, currentSystem.profileId)

    var mutation = performanceScore.value === 8
      ? 'n'
      : ''

    return (
      <div className="container">
        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxFirst}>
              <div className={structure.boxHeading}>GPU</div>
              <div className={structure.boxContent}>
                <div className={this.state.gpuClass} data-label={this.state.gpuVendor}></div>
              </div>
            </div>
            <div className={structure.box}>
              <div className={structure.boxHeading}>MODEL</div>
              <div className={structure.boxContent}>
                <div className={structure.boxValue}>
                  <div className={structure.boxValueBig}>
                    {this.state.gpuDetails}
                  </div>
                </div>
              </div>
            </div>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>OPENGL</div>
              <div className={structure.boxContent}>
                <div className={structure.boxValue}>
                  <div className={structure.boxValueBig}>
                    {this.state.openglMajor}
                  </div>
                  <div className={structure.boxValueSmall}>
                    {this.state.openglMinor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <div className={structure.boxesWrapOuter}>
              <div className={structure.boxesWrapInner}>
                <div className={structure.boxFirstLast}>
                  <div className={editorial.editorialBoxContent}>
                    <div className="container">
                      <div className="row">
                        <div className="col-xs-12 col-sm-offset-1 col-sm-5">
                          <h3>
                            This system is a{mutation}&nbsp;<Badge data={performanceScore}/>
                          </h3>
                        </div>
                        <div className="col-xs-12 col-sm-5">
                          <div className="pull-right">
                            <button type="button" className="btn btn-primary" onClick={this.seeInBenchMarksClicked}>See standing in benchmarks</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps(state) {
  const {reader, system, graphics, benchmarks} = state
  return {
    ...reader,
    ...system,
    ...graphics,
    ...benchmarks
  }
}

Specs.propTypes = {
  router: React.PropTypes.shape({push: React.PropTypes.func.isRequired}).isRequired
}

var RoutedSpecs = withRouter(Specs);

export default connect(mapStateToProps)(RoutedSpecs)
