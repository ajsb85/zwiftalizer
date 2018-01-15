import React from 'react';

import structure from '../../styles/structure.css';
import editorial from '../../styles/editorial.css';

class Help extends React.Component {
  render() {
    return (
      <div className="container">
        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>
                Video Walk-through / Tutorial
              </div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                          className="embed-responsive-item"
                          allowFullScreen
                          src="https://www.youtube.com/embed/xQI-7-ZU_ao"
                        />
                      </div>
                      <br />
                      <br />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-offset-1 col-xs-10">
                      <p>
                        This video explains how to load your log files on PC,
                        Mac, iPad and iPhone, how to interpret the ANT+ signal
                        quality charts, and includes tips for how to search the
                        system benchmarks report.
                      </p>
                      <p>
                        The video shows the graphics quality of a typical Intel
                        Core i7 laptop with Intel integrated graphics alongside
                        Nvidia GTX 970 and Radeon 7870 discrete GPUs and
                        considers whether the improved graphics quality is worth
                        the cost of upgrading to a gaming PC.
                      </p>
                      <p>
                        For comparisons of Apple TV 4K (1080 basic profile
                        graphics with 4K text overlays) with 1080 high profile
                        graphics see
                        <a
                          href="https://youtu.be/6KVkjmeW6AM"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Shane Miller's video - Zwift on Apple TV: The A to Z
                          User Experience (Unbox/Install/Interface/Devices)
                        </a>
                      </p>
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
export { Help };
