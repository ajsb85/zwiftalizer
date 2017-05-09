import React from 'react';
import styles from './styles.css';
import images from '../../styles/images.css';

class System extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDetails(cpuDetail) {
    if (!cpuDetail) {
      return null;
    }

    return <h4 className={styles.cpuDetail}>{cpuDetail}</h4>;
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
      current,
      platform,
      cpuVendor,
      gpuVendor,
      details      
    } = this.props.data;

    var relativeMaxWidth = 100;
    var relativeAvgWidth = 100;
    var relativeMinWidth = 100;

    if (maxMaxResolutionProfile > 0) {
      relativeMaxWidth = Math.round(maxFps / maxMaxResolutionProfile * 100);
      relativeAvgWidth = Math.round(avgFps / maxMaxResolutionProfile * 100);
      relativeMinWidth = Math.round(minFps / maxMaxResolutionProfile * 100);
    }

    let platformClass, cpuClass, gpuClass = null;

    if (platform) {
      switch (platform.toLowerCase()) {
        case 'alienware':
          platformClass = images.alienware;
          break;

        case 'pc':
          platformClass = images.pc;
          break;

        case 'mac':
          platformClass = images.mac;
          break;

        case 'ios':
          platformClass = images.arm64;
          break;

        default:
          platformClass = null;
          break;
      }
    }

    if (cpuVendor) {
      switch (cpuVendor.toLowerCase()) {
        case 'amd':
          cpuClass = images.amd;
          break;

        case 'intel':
        case 'pentium':
          cpuClass = images.intel;
          break;

        case 'apple':
          cpuClass = images.mac;
          break;

        case 'arm64':
          cpuClass = images.arm64;
          break;

        default:
          cpuClass = null;
          break;
      }
    }

    if (gpuVendor) {
      switch (gpuVendor.toLowerCase()) {
        case 'amd':
        case 'ati':
          gpuClass = images.amd;
          break;

        case 'nvidia':
          gpuClass = images.nvidia;
          break;

        case 'intel':
          gpuClass = images.intel;
          break;

        case 'apple':          
        case 'arm64':
          gpuClass = images.arm64;
          break;

        default:
          gpuClass = null;
          break;
      }
    }

    const detailsMarkup = details ? this.renderDetails(details) : null;

    const barStyle = {
      marginBottom: '0.2rem'
    };

    const maxWidthStyle = {
      width: relativeMaxWidth + '%',
      minWidth: '0.2rem'
    };

    const avgWidthStyle = {
      width: relativeAvgWidth + '%',
      minWidth: '0.2rem'
    };

    const minWidthStyle = {
      width: relativeMinWidth + '%',
      minWidth: '0.2rem'
    };

    const rowStyle = current
      ? {
          background: '#FDDF8B',
          paddingTop: '1.5rem',
          marginBottom: '3rem'
        }
      : {};

    return (
      <div>
        {current ? <a id="current" /> : null}
        <div className="row" style={rowStyle}>
          <div className="col-xs-12 col-sm-2">
            <div className={styles.iconsWrapper}>
              <div className={styles.icon}>
                <div className={platformClass} data-label={platformClass} />
              </div>
              <div className={styles.icon}>
                <div className={cpuClass} data-label={cpuClass} />
              </div>
              <div className={styles.icon}>
                <div className={gpuClass} data-label={gpuClass} />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-5">
            <div className={styles.systemName}>
              {systemId}
            </div>
            {detailsMarkup}
          </div>
          <div className="col-xs-12 col-sm-5">
            <div className={styles.samplesOuter}>
              <div className={styles.samplesInner}>
              {samples}<br/>Logs
              </div>
            </div>
            <div className={styles.barsOuter}>
              <div className="progress" style={barStyle}>
                <div
                  className="progress-bar progress-bar-success"
                  role="progressbar"
                  aria-valuenow={relativeMaxWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={maxWidthStyle}
                >
                  {maxFps}
                </div>
              </div>
              <div className="progress" style={barStyle}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={relativeAvgWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={avgWidthStyle}
                >
                  {avgFps}
                </div>
              </div>
              <div className="progress" style={barStyle}>
                <div
                  className="progress-bar progress-bar-warning"
                  role="progressbar"
                  aria-valuenow={relativeMinWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={minWidthStyle}
                >
                  {minFps}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default System;
