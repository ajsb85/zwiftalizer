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

  renderVsyncSymbol() {
    return (
      <span>&nbsp;~V</span>
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
      maxMaxResolutionProfile
    } = this.props.data

    var relativeMaxWidth = 100
    var relativeAvgWidth = 100
    var relativeMinWidth = 100

    if (maxMaxResolutionProfile > 0) {
      relativeMaxWidth = Math.round((maxFps / maxMaxResolutionProfile) * 100)
      relativeAvgWidth = Math.round((avgFps / maxMaxResolutionProfile) * 100)
      relativeMinWidth = Math.round((minFps / maxMaxResolutionProfile) * 100)
    }

    const absMaxFps = Math.round(maxFps)

    const absAvgFps = Math.round(maxFps)

    const isVsyncOn = (absMaxFps < 90) && (absMaxFps % 30 === 0) && absMaxFps >= absAvgFps;

    // const isVsyncOn = (absMaxFps < 90) && (Math.round((absMaxFps / (Math.round((absMaxFps + absAvgFps) / 2) - absMaxFps)) * 100) >= 0.02) && ((absMaxFps % 30 === 0) || (absAvgFps %
    // 30 === 0));

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
      switch (cpuVendor.toLowerCase()) {
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
        case('arm'):
          gpuClass = images.mac
          break

        default:
          gpuClass = null
          break
      }
    }

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

    const vSyncMarkup = isVsyncOn
      ? this.renderVsyncSymbol()
      : null

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
        <div className="col-xs-12 col-sm-5">
          <div className={styles.systemName}>
            {systemId}
          </div>
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
