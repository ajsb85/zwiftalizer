import React from 'react'
import styles from './styles.css'
class System extends React.Component {

  constructor(props) {
    super(props)
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

    console.log(relativeWidth)

    const widthStyle = {
      width: relativeWidth + '%',
      minWidth: '0.2 rem'
    }

    return (
      <div className="row">
        <div className="col-xs-12 col-sm-6">
          <div className={styles.systemNameOuter}>
            <div>{systemId}</div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6">
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
System
