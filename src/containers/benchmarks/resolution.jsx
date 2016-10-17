import React from 'react'
import Profile from './profile.jsx'
import structure from '../../styles/structure.css'
import styles from './styles.css'

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

      <div className={styles.benchmarksWrapOuter}>
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
