import React from 'react'
import styles from './styles.css'
import images from '../../styles/images.css'

class System extends React.Component {

  constructor(props) {
    super(props)
  }

  platform(str) {
    return (str.match(/^Mac.*/))
      ? 'Mac'
      : 'PC'
  }

  cpuVendor(str) {
    var regex = /.*\s+\/\s+([^\s]*).*\s+\/\s+[^\s]*.*/

    const match = regex.exec(str)

    if (!match) {
      return undefined
    }

    return match[1].toLowerCase()

  }

  gpuVendor(str) {
    var regex = /.*\s+\/\s+[^\s]*.*\s+\/\s+([^\s]*).*/

    const match = regex.exec(str)

    if (!match) {
      return undefined
    }

    return match[1].toLowerCase()
  }

  render() {

    const {
      systemId,
      minFps,
      maxFps,
      avgFps,
      samples,
      maxAvgResolutionProfile
    } = this.props.data

    var relativeWidth = 100

    if (maxAvgResolutionProfile > 0) {
      relativeWidth = Math.round((avgFps / maxAvgResolutionProfile) * 100)
    }

    const platform = this.platform(systemId);

    const cpuVendor = this.cpuVendor(systemId);

    const gpuVendor = this.gpuVendor(systemId);

    let platformClass,
      cpuClass,
      gpuClass = null;

    if (platform) {

      switch (platform.toLowerCase()) {
        case('pc'):
          platformClass = images.pc
          break

        case('mac'):
          platformClass = images.mac
          break

        default:
          platformClass = null
          break
      }
    }

    if (cpuVendor) {
      switch (cpuVendor) {
        case('amd'):
          cpuClass = images.amd
          break

        case('intel'):
          cpuClass = images.intel
          break

        case('apple'):
        case('arm'):
          cpuClass = images.mac
          break

        default:
          cpuClass = null
          break
      }
    }

    if (gpuVendor) {
      switch (gpuVendor) {
        case('amd'):
        case('ati'):
          gpuClass = images.amd
          break

        case('nvidia'):
          gpuClass = images.nvidia
          break

        case('intel'):
          gpuClass = images.intel
          break

        case('apple'):
        case('arm'):
          gpuClass = images.mac
          break

        default:
          gpuClass = null
          break
      }
    }

    const widthStyle = {
      width: relativeWidth + '%',
      minWidth: '0.2 rem'
    }

    return (
      <div className="row">
        <div className="col-xs-12 col-sm-2">
          <div className={styles.iconsWrapper}>
            <div className={styles.icon}>
              <div className={platformClass} data-label={platformClass}></div>
            </div>
            <div className={styles.icon}>
              <div className={cpuClass} data-label={cpuClass}></div>
            </div>
            <div className={styles.icon}>
              <div className={gpuClass} data-label={gpuClass}></div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6">
          <div className={styles.systemNameOuter}>
            <div>{systemId}</div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-4">
          <div className="progress">
            <div className="progress-bar" role="progressbar" aria-valuenow={relativeWidth} aria-valuemin="0" aria-valuemax="100" style={widthStyle}>
              {avgFps}
            </div>
          </div>
        </div>
      </div>
    )

  }
}

export default System
