import React from 'react'
import {connect} from 'react-redux'
import Reader from '../reader'
import Activity from '../activity'
import TabPanels from '../tabPanels'
import System from '../system'

class Home extends React.Component {
  render() {
    return (
      <div>
        <Reader/>
        <Activity/>
        <System/>
        <TabPanels/>
      </div>
    )
  }
}

export default connect()(Home)
