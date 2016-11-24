import React from 'react'
import styles from './styles.css'
import images from '../../styles/images.css'
import * as Parser from '../../parser/index.js'

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

    return match[1]

  }

  gpuVendor(str) {
    var regex = /.*\s+\/\s+[^\s]*.*\s+\/\s+([^\s]*).*/

    const match = regex.exec(str)

    if (!match) {
      return undefined
    }

    return match[1]
  }

  renderCpuDetail(cpuDetail) {
    if (!cpuDetail) {
      return null
    }

    return (
      <h4 className={styles.cpuDetail}>{cpuDetail}</h4>
    )
  }

  render() {

    const {
      systemId,
      minFps,
      maxFps,
      avgFps,
      samples,
      maxAvgResolutionProfile,
      maxMaxResolutionProfile,
      highlighted
    } = this.props.data

    var relativeMaxWidth = 100
    var relativeAvgWidth = 100
    var relativeMinWidth = 100

    if (maxMaxResolutionProfile > 0) {
      relativeMaxWidth = Math.round((maxFps / maxMaxResolutionProfile) * 100)
      relativeAvgWidth = Math.round((avgFps / maxMaxResolutionProfile) * 100)
      relativeMinWidth = Math.round((minFps / maxMaxResolutionProfile) * 100)
    }

    let platform = this.platform(systemId);

    let cpuVendor = this.cpuVendor(systemId);

    let gpuVendor = this.gpuVendor(systemId);

    const cpuDetail = Parser.cpuClass(systemId);

    let systemIdVariable = systemId;

    // crude iOS detection
    if (platform === 'Mac' && cpuVendor && cpuVendor.toLowerCase() === 'arm64') {
      platform = 'iOS',
      gpuVendor = 'arm64',
      cpuVendor = 'arm64'
      systemIdVariable = systemIdVariable.replace('Mac /', 'iOS /')
    }

    // crude Alienware detection, checks for a T series intel CPU and (Nvidia or AMD GPU).
    if (platform === 'PC' && cpuDetail && (cpuDetail.toLowerCase().indexOf('alienware') !== -1) && gpuVendor && (gpuVendor.toLowerCase() === 'nvidia' || gpuVendor.toLowerCase() === 'ati')) {
      platform = 'Alienware',
      systemIdVariable = systemIdVariable.replace('PC /', 'Alienware /')
    }

    let platformClass,
      cpuClass,
      gpuClass = null;

    if (platform) {

      switch (platform.toLowerCase()) {

        case('alienware'):
          platformClass = images.alienware
          break

        case('pc'):
          platformClass = images.pc
          break

        case('mac'):
          platformClass = images.mac
          break

        case('ios'):
          platformClass = images.arm64
          break

        default:
          platformClass = null
          break
      }
    }

    if (cpuVendor) {
      switch (cpuVendor.toLowerCase()) {
        case('amd'):
          cpuClass = images.amd
          break

        case('intel'):
        case('pentium'):
          cpuClass = images.intel
          break

        case('apple'):
          cpuClass = images.mac
          break

        case('arm64'):
          cpuClass = images.arm64
          break

        default:
          cpuClass = null
          break
      }
    }

    if (gpuVendor) {
      switch (gpuVendor.toLowerCase()) {
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
          gpuClass = images.mac
          break

        case('arm64'):
          gpuClass = images.arm64
          break

        default:
          gpuClass = null
          break
      }
    }

    const cpuDetailMarkup = cpuDetail
      ? this.renderCpuDetail(cpuDetail)
      : null;

    const barStyle = {
      marginBottom: '0.2rem'
    }

    const maxWidthStyle = {
      width: relativeMaxWidth + '%',
      minWidth: '0.2rem'
    }

    const avgWidthStyle = {
      width: relativeAvgWidth + '%',
      minWidth: '0.2rem'
    }

    const minWidthStyle = {
      width: relativeMinWidth + '%',
      minWidth: '0.2rem'
    }

    const rowStyle = highlighted
      ? {
        background: '#FFD04C',
        paddingTop: '1.5rem',
        marginBottom: '1.5rem'
      }
      : {}

    return (
      <div className="row" style={rowStyle}>
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
        <div className="col-xs-12 col-sm-5">
          <div className={styles.systemName}>
            {systemIdVariable}
          </div>
          {cpuDetailMarkup}
        </div>
        <div className="col-xs-12 col-sm-5">
          <div className={styles.barsOuter}>
            <div className="progress" style={barStyle}>
              <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={relativeMaxWidth} aria-valuemin="0" aria-valuemax="100" style={maxWidthStyle}>
                {maxFps}
              </div>
            </div>
            <div className="progress" style={barStyle}>
              <div className="progress-bar" role="progressbar" aria-valuenow={relativeAvgWidth} aria-valuemin="0" aria-valuemax="100" style={avgWidthStyle}>
                {avgFps}
              </div>
            </div>
            <div className="progress" style={barStyle}>
              <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow={relativeMinWidth} aria-valuemin="0" aria-valuemax="100" style={minWidthStyle}>
                {minFps}
              </div>
            </div>
          </div>

        </div>
      </div>
    )

  }
}

export default System
