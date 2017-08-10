var _ = require('underscore');
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { render } from 'react-dom';

import { setSelectedTab } from '../../actions/tabs';

import { Tabs, TabLink, TabContent } from 'react-tabs-redux';

import Graphics from '../graphics';
import Ant from '../ant';
import Btle from '../btle';
import Network from '../network';
import Analysis from '../analysis';
import structure from '../../styles/structure.css';
import styles from './styles.css';

class TabPanels extends React.Component {
  constructor(props) {
    super(props);
  }

  onChangeSelectedTab(selectedTab, tabNamespace) {
    const { dispatch } = this.props;
    dispatch(setSelectedTab(selectedTab, tabNamespace));
  }

  render() {
    const { isLoaded } = this.props;
    return isLoaded ? this.renderTabs() : null;
  }

  renderTabs() {
    return (
      <div className={styles.root}>
        <div className="container">
          <div className="row">
            <div className="center-block">
              <div className="text-center">
                <Tabs
                  handleSelect={this.onChangeSelectedTab}
                  renderActiveTabContentOnly={true}
                  style={{
                    margin: 0,
                    padding: 0,
                    marginBefore: 0,
                    marginAfter: 0,
                    marginStart: 0,
                    marginEnd: 0
                  }}
                >
                  <div className="tab-links">
                    <TabLink to="tab1">Graphics</TabLink>
                    <TabLink to="tab2">ANT+ Devices</TabLink>
                    <TabLink to="tab3">BTLE Devices</TabLink>
                    <TabLink to="tab4">Network</TabLink>
                    <TabLink to="tab5">Analysis</TabLink>
                  </div>

                  <TabContent for="tab1">
                    <Graphics />
                  </TabContent>

                  <TabContent for="tab2">
                    <Ant />
                  </TabContent>

                  <TabContent for="tab3">
                    <Btle />
                  </TabContent>

                  <TabContent for="tab4">
                    <Network />
                  </TabContent>

                  <TabContent for="tab5">
                    <Analysis />
                  </TabContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reader, tabs } = state;
  return {
    ...reader,
    ...tabs
  };
}

TabPanels.propTypes = {
  reader: PropTypes.object,
  tabs: PropTypes.object
};

export default connect(mapStateToProps)(TabPanels);
