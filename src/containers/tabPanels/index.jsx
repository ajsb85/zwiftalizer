var _ = require('underscore')
  import React, {Component, PropTypes} from 'react'
  import {connect} from 'react-redux'
  import {render} from 'react-dom'
  import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
  import Graphics from '../graphics'
  import Ant from '../ant'
  import Btle from '../btle'
  import Network from '../network'
  import Analysis from '../analysis'
  import structure from '../../styles/structure.css'
  import styles from './styles.css'

  class TabPanels extends React.Component {

    constructor(props) {
      super(props)
    }

    handleSelect(index, last) {
      //console.log('Selected tab: ' + index + ', Last tab: ' + last);
    }

    render() {
      const {isLoaded} = this.props
      return isLoaded
        ? this.renderTabs()
        : null
    }

    renderTabs() {

      return (
        <div className={styles.root}>

          <div className='row'>
            <div className='center-block'>
              <div className='text-center'>
                <Tabs
                  onSelect={this.handleSelect}
                  selectedIndex={0}
                  style={{
                  margin: 0,
                  padding: 0,
                  marginBefore: 0,
                  marginAfter: 0,
                  marginStart: 0,
                  marginEnd: 0
                }}>
                  <TabList>
                    <Tab>Graphics</Tab>
                    <Tab>ANT+ Devices</Tab>
                    <Tab>BTLE Devices</Tab>
                    <Tab>Network</Tab>
                    <Tab>Analysis</Tab>
                  </TabList>

                  <TabPanel>
                    <Graphics/>
                  </TabPanel>

                  <TabPanel>
                    <Ant/>
                  </TabPanel>

                  <TabPanel>
                    <Btle/>
                  </TabPanel>

                  <TabPanel>
                    <Network/>
                  </TabPanel>

                  <TabPanel>
                    <Analysis/>
                  </TabPanel>

                </Tabs>
              </div>
            </div>
          </div>
        </div>

      )
    }
  }

  function mapStateToProps(state) {
    const {reader} = state
    return {
      ...reader
    }
  }

  TabPanels.propTypes = {
    reader: PropTypes.object
  }

  export default connect(mapStateToProps)(TabPanels)
