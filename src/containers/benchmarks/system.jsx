import React from 'react';
import styles from './styles.css';
import images from '../../styles/images.css';
var uuid = require('node-uuid');

const PRICEWATCH_LABEL = 'Pricewatch';
const TWEAKERS_LABEL = 'Tweakers';
const NEWEGG_LABEL = 'Newegg';
const EBAY_LABEL = 'eBay';
const AMAZON_US_LABEL = 'Amazon US';
const AMAZON_CA_LABEL = 'CA';
const AMAZON_UK_LABEL = 'UK';
const AMAZON_DE_LABEL = 'DE';
const AMAZON_ES_LABEL = 'ES';
const AMAZON_FR_LABEL = 'FR';
const AMAZON_IT_LABEL = 'IT';
const AMAZON_JP_LABEL = 'JP';

const AMAZON_US_TAG = 'zwiftalizer-20';
const AMAZON_CA_TAG = 'zwiftalizer07-20';
const AMAZON_UK_TAG = 'zwiftalizer-21';
const AMAZON_DE_TAG = 'zwiftalizer0c-21';
const AMAZON_ES_TAG = 'zwiftalizer02-21';
const AMAZON_FR_TAG = 'zwiftalizer06-21';
const AMAZON_IT_TAG = 'zwiftalizer0f-21';
const AMAZON_JP_TAG = 'zwiftalizer-22';

class System extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDetails(cpuDetail) {
    if (!cpuDetail) {
      return null;
    }

    return <h4 className={styles.cpuDetail}>{cpuDetail}</h4>;
  }

  renderShopLinks() {
    const {
      platform,
      gpuVendor,
      gpuTerms,
      cpuVendor,
      cpuTerms
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

    if (
      platformLower === 'pc' &&            
      cpuTerms &&
      cpuTerms.length
    ) {
      const cpuQueryTerms = cpuTerms.join('+');

      cpuShopLinks.push({
        tag: PRICEWATCH_LABEL,
        href: `http://www.pricewatch.com/search?q=${cpuQueryTerms}&gallery=1&sortby=price&condition=new&discounted=2`
      });

      cpuShopLinks.push({
        tag: TWEAKERS_LABEL,
        href: `https://tweakers.net/pricewatch/zoeken/?keyword=${cpuQueryTerms}`
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
        tag: AMAZON_JP_LABEL,
        href: `https://www.amazon.co.jp/s/?tag=${AMAZON_JP_TAG}&field-keywords=${cpuQueryTerms}`
      });

      cpuLinksMarkup = cpuShopLinks.map(
        function(link, i) {
          return <li key={uuid.v4()}><a target="_blank" href={link.href}>{link.tag}</a></li>;
        },
        this
      );

      cpuLinks = (
        <div>
          <span className={styles.shoplinksLabel}>CPU:&nbsp;</span>
          <ul className={styles.shoplinks}>{cpuLinksMarkup}</ul>
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

      const pricewatchGpuLink = `http://www.pricewatch.com/search?q=${gpuQueryTerms}&gallery=1&sortby=price&condition=new&discounted=2`;
      gpuShopLinks.push({
        tag: PRICEWATCH_LABEL,
        href: pricewatchGpuLink
      });

      gpuShopLinks.push({
        tag: TWEAKERS_LABEL,
        href: `https://tweakers.net/pricewatch/zoeken/?keyword=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: NEWEGG_LABEL,
        href: `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=PRICE&PageSize=36&Description=${gpuQueryTerms}`
      });

      gpuShopLinks.push({
        tag: EBAY_LABEL,
        href: `http://www.ebay.com/sch/?_ipg=200&_sop=12&_dmd=1&_nkw=${gpuQueryTerms}`
      });

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
        tag: AMAZON_JP_LABEL,
        href: `https://www.amazon.co.jp/s/?tag=${AMAZON_JP_TAG}&field-keywords=${gpuQueryTerms}`
      });

      gpuLinksMarkup = gpuShopLinks.map(
        function(link, i) {
          return <li key={uuid.v4()}><a target="_blank" href={link.href}>{link.tag}</a></li>;
        },
        this
      );

      gpuLinks = (
        <div>
          <span className={styles.shoplinksLabel}>GPU:&nbsp;</span>
          <ul className={styles.shoplinks}>{gpuLinksMarkup}</ul>
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

    let platformClass, cpuClass, gpuClass = null;

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

    //@todo, shop links for CPU and GPU
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
        {current ? <a id="current" /> : null}
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
            { current ? 
            <div className={styles.currentSystem}>
              Your system is always visible regardless of any search filter settings.
            </div> : null}
            {detailsMarkup}
            {shopLinksMarkup}
          </div>
          <div className="col-xs-12 col-sm-4">
          { current ?
            <div className={styles.samplesOuter}>
              <div className={styles.samplesInner}>
                &nbsp;
              </div>
            </div>            
            :
            <div className={styles.samplesOuter}>
              <div className={styles.samplesInner}>
                {samples}<br />Logs
              </div>
            </div>
          }
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
      </div>
    );
  }
}

export default System;
