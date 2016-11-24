import React from 'react'
import Profile from './profile.jsx'
import structure from '../../styles/structure.css'
class Resolution extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const {resolution, profiles, totalRecords, expanded, currentSystem} = this.props.data

    var profileData = profiles && profiles.map(function(profile, i) {

      const {profileId, results} = profile;

      if (results && results.length) {

        const data = {
          resolution,
          totalRecords,
          expanded,
          currentSystem,
          ...profile
        }

        const key = resolution + '-' + profileId

        return (<Profile data={data} key={key} keyName={key}/>)
      }

    }, this)

    return (
      <div>
        {profileData}
      </div>
    )

  }
}

export default Resolution
