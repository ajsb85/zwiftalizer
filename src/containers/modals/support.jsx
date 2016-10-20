/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';

class Support extends React.Component {

  render() {
    return (
      <div className="modal fade" id="supportModal" role="dialog" aria-labelledby="supportModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="pull-right">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <h4 className="modal-title" id="supportModalLabel">Support the Zwiftalizer</h4>
            </div>
            <div className="modal-body">

              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-4">

                    <h3>
                      <i className="fa fa-github"></i>&nbsp;Open Source</h3>
                    <p>The Zwiftalizer is free, open source software. You are welcome to checkout the source from GitHub and contribute changes.</p>
                    <p>You do not have to be a coder to make a valuable contribution.
                    </p>
                    <p>
                      <a href="https://github.com/mhanney/zwiftalizer/issues" target="_blank">Submit an bug report or feature request</a>&nbsp;or simply "star" the project on GitHub (we like nerd hugs).
                    </p>
                    <p>
                      <a href="https://github.com/mhanney/zwiftalizer" target="_blank">github.com/mhanney/zwiftalizer</a>
                    </p>

                  </div>
                  <div className="col-sm-8">

                    <h3>
                      <i className="fa fa-paypal"></i>&nbsp;Make a donation</h3>

                    <p>Your donations help fund the continued development of the Zwiftalizer</p>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Buys</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>$5</td>
                            <td>Global hosting at 29 locations in North America, South America, Europe, Asia and Australia for 2 months</td>
                          </tr>
                          <tr>
                            <td>$12</td>
                            <td>Renews the domain name for a year</td>
                          </tr>
                          <tr>
                            <td>$30</td>
                            <td>Three months of Zwift for&nbsp;<a href="https://www.facebook.com/mhanney" target="_blank">Mike</a>&nbsp;<i className="fa fa-thumbs-o-up"></i>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pull-right">
                      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick"/>
                        <input type="hidden" name="hosted_button_id" value="WWLZWGPD4JS2G"/>
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"/>
                        <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"/>
                      </form>
                    </div>

                  </div>
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

export {Support};
