var moment = require('moment');
import React, {Component, PropTypes} from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {load} from '../../actions/benchmarks'
import Resolution from './resolution.jsx'

import structure from '../../styles/structure.css'
import editorialStyles from '../../styles/editorial.css'
import styles from './styles.css'

class Benchmarks extends React.Component {

  constructor(props) {

    super(props)

    const {dispatch} = this.props

    setTimeout(() => {
      dispatch(load())
    }, 250)

  }

  render() {

    const {isLoaded} = this.props

    return isLoaded
      ? this.renderBenchmarks()
      : null
  }

  renderBenchmarks() {

    const {resolutions, dateLastUpdate, totalRecords} = this.props

    var resolutionEntries = resolutions && resolutions.map(function(resolution, i) {

      return (<Resolution data={resolution} key={resolution.resolution}/>)
    }, this)

    const dateLastUpdateHuman = moment(dateLastUpdate).format()

    return (

      <div className="container-fluid">

        <div className={editorialStyles.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorialStyles.editorialBoxHeading}>
                Zwift System Benchmarks (Community Generated)
              </div>
              <div className={editorialStyles.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      <div className={editorialStyles.editorialColumn}>
                        <div className={styles.centered}>
                          <div className="alert alert-danger" role="alert">
                            <div className={styles.centered}>
                              <p>
                                This report is&nbsp;<strong>not</strong>&nbsp;an official Zwift resource and is&nbsp;<strong>not</strong>&nbsp;supported by Zwift HQ.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-5">
                      <p>
                        Last Updated: {dateLastUpdateHuman}
                      </p>
                    </div>
                    <div className="col-xs-12 col-sm-5">
                      <div className="pull-right">Total Systems: {totalRecords}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {resolutionEntries}

        <div className={editorialStyles.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorialStyles.editorialBoxHeading}>
                About The Benchmarks
              </div>
              <div className={editorialStyles.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      <div className={styles.centered}>
                        <p>
                          A system is identified by its OS, CPU and GPU 'signature'. A system appears no more than once in each resolution/profile table. However, a system may appear in more than one
                          resolution/profile if the user uploaded logs from the same system running at different resolutions. When a user uploads a log from a system that is already 'known' then the
                          averages are taken again for all instances of that type of system at that resolution/profile.
                        </p>
                        <h4>
                          Frequently Asked Questions:
                        </h4>
                        <p>
                          Q: Why is my system listed under '1440 High' when I chose '1440 Ultra' in the game? (or '1080 Basic' when I chose '1080 High').
                        </p>
                        <p>
                          A: Resolution and profile are actually two separate things. Resolution is the number of vertical lines in the picture. Profile is the level of detail of items rendered - things
                          like road texture, walls, buildings, clothing, skin, special effects, etc (using higher resolution texture maps afforded by discrete GPUs). Profile can not be set by the user
                          because it is decided by the game engine code that picks a profile based on the capabilities of your GPU.
                        </p>
                        <p>
                          Q: Why are some systems stuck at 30 or 60 FPS?
                        </p>
                        <p>
                          A: It is most probably because the frame rate is set to sync with the vertical refresh rate of the display, which is 60 times per second, or half refresh rate.
                        </p>
                        <p>
                          Q: What's the tech behind this report?
                        </p>
                        <p>
                          A: AWS API Gateway, AWS Lambda (nodejs, ramda), AWS DynamoDB, AWS S3, AWS CloudFront, AWS Route 53. See the&nbsp;<a href="https://github.com/mhanney/serverless-zwiftalizer" target="_blank">serverless-zwiftalizer</a>&nbsp; github repo for more details.
                        </p>
                        <p>
                          Q: Why was this report made?
                        </p>
                        <p>
                          A: To know when enough is enough (the point of diminishing returns - 4th gen Core i3 + Nvidia GTX 960 with a 1080 TV, for example). To make informed purchasing decisions. To learn
                          new tech.
                        </p>
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
  const {benchmarks} = state
  return {
    ...benchmarks
  }
}

Benchmarks.propTypes = {
  benchmarks: PropTypes.object
}

export default connect(mapStateToProps)(Benchmarks)
