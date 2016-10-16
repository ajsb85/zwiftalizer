import React from 'react'

class System extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const {systemId, minFps, maxFps, avgFps, samples} = this.props.data

    const widthStyle = {
      width: maxFps + '%'
    }

    return (
      <tr>
        <td>{systemId}</td>
        <td>
          <div className="progress">
            <div className="progress-bar" role="progressbar" aria-valuenow={maxFps} aria-valuemin="0" aria-valuemax="100%" style={widthStyle}></div>
          </div>
        </td>
      </tr>
    )

  }
}

export default System
