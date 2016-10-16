import React from 'react'

import System from './system.jsx'

class Profile extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const {resolution, profileId, results} = this.props.data

    var name = '';

    switch (profileId) {
      case(3):
        {
          name = 'Ultra'
        }
        break;

      case(2):
        {
          name = 'High'
        }
        break;

      case(1):
        {
          name = 'Medium'
        }
        break;

      default:
        name = 'Basic'
        break;
    }

    var resultsData = results && results.map(function(result, i) {
      return (<System data={result}/>)
    }, this)

    return (
      <div>
        <h2>{resolution} {name}</h2>
        <table className="table table-striped table-condensed">
          <tbody>
            {resultsData}
          </tbody>
        </table>
      </div>
    )

  }
}

export default Profile
