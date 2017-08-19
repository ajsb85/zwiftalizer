import React from 'react';
import styles from './styles.css';
import images from '../../styles/images.css';
import shopping from '../../styles/shopping.css';

import {
  AMAZON_US_LABEL,  
  AMAZON_CA_LABEL,
  AMAZON_UK_LABEL,
  AMAZON_DE_LABEL,
  AMAZON_ES_LABEL,
  AMAZON_FR_LABEL,
  AMAZON_IT_LABEL,
  NEWEGG_LABEL,
  EBAY_LABEL,
  AMAZON_US_TAG,
  AMAZON_CA_TAG,
  AMAZON_UK_TAG,
  AMAZON_DE_TAG,
  AMAZON_ES_TAG,
  AMAZON_FR_TAG,
  AMAZON_IT_TAG
} from '../constants/index.js';

class System extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDetails(details) {
    if (!details) {
      return null;
    }

    return (
      <h4 className={styles.cpuDetail}>
        {details}
      </h4>
    );
  }

  renderShopLinks() {
    const {
      platform,
      gpuVendor,
      gpuTerms,
      cpuVendor,
      cpuTerms,
      details
    } = this.props.data;

    let cpuLinks;
    let cpuLinksMarkup;
    const cpuShopLinks = [];

    let gpuLinks;
    let gpuLinksMarkup;
    const gpuShopLinks = [];

    const platformLower = platform.toLowerCase();
    const cpuVendorLower = cpuVendor.toLowerCase();
    const gpuVendorLower = gpuVendor.toLowerCase();

    if (platformLower === 'pc' && cpuTerms && cpuTerms.length) {
      const cpuQueryTerms = cpuTerms.join('+');

      cpuShopLinks.push({
        tag: AMAZON_US_LABEL,
        href: `https://www.amazon.com/s?tag=${AMAZON_US_TAG}&keywords=${cpuQueryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_UK_LABEL,
        href: `https://www.amazon.co.uk/s/?tag=${AMAZON_UK_TAG}&field-keywords=${cpuQueryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_CA_LABEL,
        href: `https://www.amazon.ca/s/?tag=${AMAZON_CA_TAG}&field-keywords=${cpuQueryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_DE_LABEL,
        href: `https://www.amazon.de/s/?tag=${AMAZON_DE_TAG}&field-keywords=${cpuQueryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_ES_LABEL,
        href: `https://www.amazon.es/s/?tag=${AMAZON_ES_TAG}&field-keywords=${cpuQueryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_FR_LABEL,
        href: `https://www.amazon.fr/s/?tag=${AMAZON_FR_TAG}&field-keywords=${cpuQueryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_IT_LABEL,
        href: `https://www.amazon.it/s/?tag=${AMAZON_IT_TAG}&field-keywords=${cpuQueryTerms}`
      });

      cpuShopLinks.push({
        tag: NEWEGG_LABEL,
        href: `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=PRICE&PageSize=36&Description=${cpuQueryTerms}`
      });

      // http://www.helios825.org/url-parameters.php
      cpuShopLinks.push({
        tag: EBAY_LABEL,
        href: `http://www.ebay.com/sch/?_ipg=200&_sop=12&_dmd=1&_nkw=${cpuQueryTerms}`
      });

      cpuLinksMarkup = cpuShopLinks.map(function(link, i) {
        return (
          <li key={i}>
            <a target="_blank" href={link.href}>
              {link.tag}
            </a>
          </li>
        );
      }, this);

      cpuLinks = (
        <div>
          <span className={shopping.shoplinksLabel}>Buy CPU:&nbsp;</span>
          <ul className={shopping.shoplinks}>
            {cpuLinksMarkup}
          </ul>
        </div>
      );
    }

    if (platformLower === 'alienware') {
      var lowerDetails = details ? details.toLowerCase() : '';

      let queryTerms = 'alienware+alpha+-steam+-xbox';

      if (lowerDetails.indexOf('r2') !== -1) {
        queryTerms += '+R2';
      }

      cpuShopLinks.push({
        tag: AMAZON_US_LABEL,
        href: `https://www.amazon.com/s?tag=${AMAZON_US_TAG}&keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_UK_LABEL,
        href: `https://www.amazon.co.uk/s/?tag=${AMAZON_UK_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_CA_LABEL,
        href: `https://www.amazon.ca/s/?tag=${AMAZON_CA_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_DE_LABEL,
        href: `https://www.amazon.de/s/?tag=${AMAZON_DE_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_ES_LABEL,
        href: `https://www.amazon.es/s/?tag=${AMAZON_ES_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_FR_LABEL,
        href: `https://www.amazon.fr/s/?tag=${AMAZON_FR_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_IT_LABEL,
        href: `https://www.amazon.it/s/?tag=${AMAZON_IT_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: EBAY_LABEL,
        href: `http://www.ebay.com/sch/?_ipg=200&_sop=12&_dmd=1&_nkw=${queryTerms}`
      });

      cpuLinksMarkup = cpuShopLinks.map(function(link, i) {
        return (
          <li key={i}>
            <a target="_blank" href={link.href}>
              {link.tag}
            </a>
          </li>
        );
      }, this);

      cpuLinks = (
        <div>
          <span className={shopping.shoplinksLabel}>Buy:&nbsp;</span>
          <ul className={shopping.shoplinks}>
            {cpuLinksMarkup}
          </ul>
        </div>
      );
    }

    if (platformLower === 'mac') {
      let queryTerms = 'apple+computer';

      var lowerDetails = details ? details.toLowerCase() : '';

      if (lowerDetails.indexOf('imac') !== -1) {
        queryTerms += '+imac';
      }

      if (lowerDetails.indexOf('macbook pro') !== -1) {
        queryTerms += '+macbook+pro';
      } else if (lowerDetails.indexOf('macbook air') !== -1) {
        queryTerms += '+macbook+air';
      } else if (lowerDetails.indexOf('macbook') !== -1) {
        queryTerms += '+macbook';
      }

      if (lowerDetails.indexOf('4k') !== -1) {
        queryTerms += '+4k';
      }

      if (lowerDetails.indexOf('5k') !== -1) {
        queryTerms += '+5k';
      }

      if (lowerDetails.indexOf('touch') !== -1) {
        queryTerms += '+touch';
      }

      cpuShopLinks.push({
        tag: AMAZON_US_LABEL,
        href: `https://www.amazon.com/s?tag=${AMAZON_US_TAG}&keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_UK_LABEL,
        href: `https://www.amazon.co.uk/s/?tag=${AMAZON_UK_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_CA_LABEL,
        href: `https://www.amazon.ca/s/?tag=${AMAZON_CA_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_DE_LABEL,
        href: `https://www.amazon.de/s/?tag=${AMAZON_DE_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_ES_LABEL,
        href: `https://www.amazon.es/s/?tag=${AMAZON_ES_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_FR_LABEL,
        href: `https://www.amazon.fr/s/?tag=${AMAZON_FR_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: AMAZON_IT_LABEL,
        href: `https://www.amazon.it/s/?tag=${AMAZON_IT_TAG}&field-keywords=${queryTerms}`
      });

      cpuShopLinks.push({
        tag: EBAY_LABEL,
        href: `http://www.ebay.com/sch/?_ipg=200&_sop=12&_dmd=1&_nkw=${queryTerms}`
      });

      cpuLinksMarkup = cpuShopLinks.map(function(link, i) {
        return (
          <li key={i}>
            <a target="_blank" href={link.href}>
              {link.tag}
            </a>
          </li>
        );
      }, this);

      cpuLinks = (
        <div>
          <span className={shopping.shoplinksLabel}>Buy:&nbsp;</span>
          <ul className={shopping.shoplinks}>
            {cpuLinksMarkup}
          </ul>
        </div>
      );
    }

    if (
      platformLower === 'pc' &&
      (gpuVendorLower === 'nvidia' || gpuVendorLower === 'ati') &&
      gpuTerms &&
      gpuTerms.length
    ) {
      const gpuQueryTerms = gpuTerms.join('+');

      gpuShopLinks.push({
        tag: AMAZON_US_LABEL,
        href: `https://www.amazon.com/s?tag=${AMAZON_US_TAG}&keywords=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: AMAZON_UK_LABEL,
        href: `https://www.amazon.co.uk/s/?tag=${AMAZON_UK_TAG}&field-keywords=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: AMAZON_CA_LABEL,
        href: `https://www.amazon.ca/s/?tag=${AMAZON_CA_TAG}&field-keywords=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: AMAZON_DE_LABEL,
        href: `https://www.amazon.de/s/?tag=${AMAZON_DE_TAG}&field-keywords=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: AMAZON_ES_LABEL,
        href: `https://www.amazon.es/s/?tag=${AMAZON_ES_TAG}&field-keywords=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: AMAZON_FR_LABEL,
        href: `https://www.amazon.fr/s/?tag=${AMAZON_FR_TAG}&field-keywords=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: AMAZON_IT_LABEL,
        href: `https://www.amazon.it/s/?tag=${AMAZON_IT_TAG}&field-keywords=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: NEWEGG_LABEL,
        href: `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=PRICE&PageSize=36&Description=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: EBAY_LABEL,
        href: `http://www.ebay.com/sch/?_ipg=200&_sop=12&_dmd=1&_nkw=${gpuQueryTerms}`
      });

      gpuLinksMarkup = gpuShopLinks.map(function(link, i) {
        return (
          <li key={i}>
            <a target="_blank" href={link.href}>
              {link.tag}
            </a>
          </li>
        );
      }, this);

      gpuLinks = (
        <div>
          <span className={shopping.shoplinksLabel}>Buy GPU:&nbsp;</span>
          <ul className={shopping.shoplinks}>
            {gpuLinksMarkup}
          </ul>
        </div>
      );
    }

    return (
      <div>
        {cpuLinks}
        {gpuLinks}
      </div>
    );
  }

  render() {
    const {
      systemId,
      minFps,
      maxFps,
      avgFps,
      samples,
      maxAvgResolutionProfile,
      maxMaxResolutionProfile,
      current,
      platform,
      cpuVendor,
      gpuVendor,
      details,
      gpuTerms,
      cpuTerms
    } = this.props.data;

    var relativeMaxWidth = 100;
    var relativeAvgWidth = 100;
    var relativeMinWidth = 100;

    if (maxMaxResolutionProfile > 0) {
      relativeMaxWidth = Math.round(maxFps / maxMaxResolutionProfile * 100);
      relativeAvgWidth = Math.round(avgFps / maxMaxResolutionProfile * 100);
      relativeMinWidth = Math.round(minFps / maxMaxResolutionProfile * 100);
    }

    let platformClass,
      cpuClass,
      gpuClass = null;

    if (platform) {
      switch (platform.toLowerCase()) {
        case 'alienware':
          platformClass = images.alienware;
          break;

        case 'pc':
          platformClass = images.pc;
          break;

        case 'mac':
          platformClass = images.mac;
          break;

        case 'ios':
          platformClass = images.arm64;
          break;

        default:
          platformClass = null;
          break;
      }
    }

    if (cpuVendor) {
      switch (cpuVendor.toLowerCase()) {
        case 'amd':
          cpuClass = images.amd;
          break;

        case 'intel':
        case 'pentium':
          cpuClass = images.intel;
          break;

        case 'apple':
          cpuClass = images.mac;
          break;

        case 'arm64':
          cpuClass = images.arm64;
          break;

        default:
          cpuClass = null;
          break;
      }
    }

    if (gpuVendor) {
      switch (gpuVendor.toLowerCase()) {
        case 'amd':
        case 'ati':
          gpuClass = images.amd;
          break;

        case 'nvidia':
          gpuClass = images.nvidia;
          break;

        case 'intel':
          gpuClass = images.intel;
          break;

        case 'apple':
        case 'arm64':
          gpuClass = images.arm64;
          break;

        default:
          gpuClass = null;
          break;
      }
    }

    const detailsMarkup = details ? this.renderDetails(details) : null;

    const shopLinksMarkup = this.renderShopLinks();

    const barStyle = {
      marginBottom: '0.2rem'
    };

    const maxWidthStyle = {
      width: relativeMaxWidth + '%',
      minWidth: '0.2rem'
    };

    const avgWidthStyle = {
      width: relativeAvgWidth + '%',
      minWidth: '0.2rem'
    };

    const minWidthStyle = {
      width: relativeMinWidth + '%',
      minWidth: '0.2rem'
    };

    const rowStyle = current
      ? {
          background: '#FDDF8B',
          paddingTop: '1.5rem',
          marginBottom: '1rem'
        }
      : {
          marginBottom: '1rem'
        };

    return (
      <div>
        <div className="row" style={rowStyle}>
          <div className="col-xs-12 col-sm-2">
            <div className={styles.iconsWrapper}>
              <div className={styles.icon}>
                <div className={platformClass} data-label={platformClass} />
              </div>
              <div className={styles.icon}>
                <div className={cpuClass} data-label={cpuClass} />
              </div>
              <div className={styles.icon}>
                <div className={gpuClass} data-label={gpuClass} />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className={styles.systemName}>
              {systemId}
            </div>
            {current
              ? <div className={styles.currentSystem}>
                  Your system is always visible regardless of any search filter
                  settings.
                </div>
              : null}
            {detailsMarkup}
            {shopLinksMarkup}
          </div>
          <div className="col-xs-12 col-sm-4">
            {current
              ? <div className={styles.samplesOuter}>
                  <div className={styles.samplesInner} />
                </div>
              : <div className={styles.samplesOuter}>
                  <div className={styles.samplesInner}>
                    {samples}
                    <br />Logs
                  </div>
                </div>}
            <div className={styles.barsOuter}>
              <div className="progress" style={barStyle}>
                <div
                  className="progress-bar progress-bar-success"
                  role="progressbar"
                  aria-valuenow={relativeMaxWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={maxWidthStyle}
                >
                  {maxFps}
                </div>
              </div>
              <div className="progress" style={barStyle}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={relativeAvgWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={avgWidthStyle}
                >
                  {avgFps}
                </div>
              </div>
              <div className="progress" style={barStyle}>
                <div
                  className="progress-bar progress-bar-warning"
                  role="progressbar"
                  aria-valuenow={relativeMinWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={minWidthStyle}
                >
                  {minFps}
                </div>
              </div>
            </div>
          </div>
        </div>
        {current ? <a id="current" /> : null}
      </div>
    );
  }
}

export default System;
