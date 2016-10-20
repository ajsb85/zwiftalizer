import React from 'react'
import Profile from './profile.jsx'
import structure from '../../styles/structure.css'

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

        const key = resolution.resolution + '-' + profileId

        return (<Profile data={data} key={key}/>)
      }

    }, this)

    return (

      <div>
        <div className={structure.boxesWrapInner}>
          <div className={structure.boxLast}>
            {profileData}
          </div>
        </div>
      </div>
    )

  }
}

export default Resolution
