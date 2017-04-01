import React from 'react'
import structure from '../../styles/structure.css'
import editorial from '../../styles/editorial.css'

class PowerSources extends React.Component {

  render() {
    return (
      <div className="container">
        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>Smart Trainer and Powermeter Usage</div>
              <div className={editorial.editorialBoxContent}>
                <div className="container">
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                      <h3>Smart Trainer and Powermeter Usage</h3>
                      <p></p>
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

export {PowerSources}
