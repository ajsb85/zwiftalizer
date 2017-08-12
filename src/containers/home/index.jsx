import React from 'react'
import {connect} from 'react-redux'
import Reader from '../reader'
import Activity from '../activity'
import System from '../system'
import Graphics from '../graphics';
import Ant from '../ant';
import Btle from '../btle';
import Network from '../network';
import Analysis from '../analysis';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Reader/>
        <Activity/>
        <System/>
        <Graphics />
        <Ant />
        <Btle />
        <Network />
        <Analysis />
      </div>
    )
  }
}

export default connect()(Home)
