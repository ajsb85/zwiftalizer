import React from 'react';

import structure from '../../styles/structure.css';
import editorial from '../../styles/editorial.css';

class Support extends React.Component {
  render() {
    return (
      <div className="container">
        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>
                Support the Zwiftalizer
              </div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-xs-12 col-sm-4">
                            <h3>
                              <i className="fa fa-github" />&nbsp;Open Source
                            </h3>
                            <p>
                              The Zwiftalizer is free, open source software. You
                              are welcome to checkout the source from GitHub and
                              contribute changes.
                            </p>
                            <p>
                              But you do not have to be a coder to make a
                              valuable contribution.
                            </p>
                            <p>
                              <a
                                href="https://github.com/mhanney/zwiftalizer/issues"
                                target="_blank"
                              >
                                You can submit an bug report, feature request
                              </a>&nbsp;or simply "star" the project on&nbsp;<a
                                href="https://github.com/mhanney/zwiftalizer"
                                target="_blank"
                              >
                                GitHub
                              </a>
                              &nbsp;(we like nerd hugs).
                            </p>
                          </div>
                          <div className="col-xs-12 col-sm-8">
                            <div className="container-fluid">
                              <div className="row">
                                <div className="col-xs-12 col-sm-8">
                                  <h3>
                                    <i className="fa fa-paypal" />&nbsp;Make a
                                    donation
                                  </h3>
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                  <div
                                    className={editorial.donateButtonWrapper}
                                  >
                                    <div className="pull-right">
                                      <form
                                        action="https://www.paypal.com/cgi-bin/webscr"
                                        method="post"
                                        target="_top"
                                      >
                                        <input
                                          type="hidden"
                                          name="cmd"
                                          value="_s-xclick"
                                        />
                                        <input
                                          type="hidden"
                                          name="hosted_button_id"
                                          value="WWLZWGPD4JS2G"
                                        />
                                        <input
                                          type="image"
                                          src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
                                          border="0"
                                          name="submit"
                                          alt="PayPal - The safer, easier way to pay online!"
                                        />
                                        <img
                                          alt=""
                                          border="0"
                                          src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                                          width="1"
                                          height="1"
                                        />
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p>
                              Your donations fund the hosting and continued
                              development of the Zwiftalizer
                            </p>
                            <div className="table-responsive">
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th>
                                      <h4>Amount</h4>
                                    </th>
                                    <th>
                                      <h4>Covers</h4>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <p>$5</p>
                                    </td>
                                    <td>
                                      <p>
                                        Hosting at 100+ mirror locations
                                        wordlwide for 2 months
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <p>$12</p>
                                    </td>
                                    <td>
                                      <p>The domain name for a year</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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
      </div>
    );
  }
}
export { Support };
