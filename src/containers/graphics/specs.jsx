/**
 *  Copyright (c) 2016, Michael R Hanney. All rights reserved.
 *
 *  No affiliation with Zwift LLC whatsoever. Use at your own risk.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import structure from '../../styles/structure.css'
import images from '../../styles/images.css'

const isFire = (str) => {
  if (!str) {
    return false
  }
  return str.match(/(.*)fire(.*)/i)
}

class Specs extends React.Component {

  constructor(props) {
    super(props)

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

  render() {

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
      </div>

    )
  }
}

export {Specs}
