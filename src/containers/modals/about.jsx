/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react'

class About extends React.Component {

  render() {
    return (
      <div className="modal fade" id="aboutModal" role="dialog" aria-labelledby="aboutModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="pull-right">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <h4 className="modal-title" id="aboutModalLabel">About the Zwiftalizer</h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">

                  <h3>What is the Zwiftalizer?</h3>

                  <p>The Zwiftalizer is a JavaScript application to analyze the log file from &nbsp;<a href="http://www.zwift.com" target="_blank">Zwift</a>
                  </p>

                  <h3>Privacy Policy</h3>

                  <p>
                    The log reader code runs entirely on your computer. Your log file does not get uploaded anywhere.
                  </p>
                  <p>
                    However, a tiny fragment of data, derived from your log file, is OPTIONALLY uploaded to a database to include in the benchmarks report No personal data is uploaded, only your
                    computer specs.
                  </p>
                  <p>
                    The following data is uploaded: OS, CPU make and model, GPU make and model, RAM, min FPS, avg FPS, max FPS, resolution, profile, date, time and duration of the activity in the log.
                  </p>

                  <h3>Support</h3>

                  <p>This is a free, open source project by members of the Zwift community and is not connected to Zwift LLC in any way. Use of the tool comes with no guarantee or support.
                  </p>

                  <h3>Copyrights and licenses</h3>

                  <p>ReactJS is copyright of Facebook</p>

                  <p>ESnet React Timeseries Charts and Pond.js are copyright of The Regents of the University of California, through Lawrence Berkeley National Laboratory.</p>

                  <p>Everything else is copyright Mike Hanney and made available by the GNU GPL V3 license</p>

                  <p>
                    <a href="https://github.com/mhanney/zwiftalizer/blob/master/LICENSE.md" target="_blank">The full licenses can be found here</a>
                  </p>

                  <p>Ride on!&nbsp;<em>Mike</em>
                  </p>

                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export {About}
