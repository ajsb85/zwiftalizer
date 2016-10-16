import React from 'react'

import Profile from './profile.jsx'

class Resolution extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const {resolution, profiles} = this.props.data

    var profileData = profiles && profiles.map(function(profile, i) {

      const {profileId, results} = profile;

      if (results && results.length) {

        const data = {
          resolution,
          ...profile
        }

        return (<Profile data={data}/>)
      }

    }, this)

    return (
      <div>
        <h2>{resolution}</h2>
        {profileData}
      </div>
    )

  }
}

export default Resolution
