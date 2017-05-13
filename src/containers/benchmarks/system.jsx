import React from 'react';
import styles from './styles.css';
import images from '../../styles/images.css';

const PRICEWATCH_LABEL = 'Deals (US)';
const TWEAKERS_LABEL = 'Deals (EU)';
const NEWEGG_LABEL = 'Newegg (US)';

const AMAZON_US_LABEL = 'US';
const AMAZON_CA_LABEL = 'CA';
const AMAZON_UK_LABEL = 'UK';
const AMAZON_DE_LABEL = 'DE';
const AMAZON_ES_LABEL = 'ES';
const AMAZON_FR_LABEL = 'FR';
const AMAZON_IT_LABEL = 'IT';

const AMAZON_US_TAG = 'zwiftalizer-20';
const AMAZON_CA_TAG = 'zwiftalizer07-20';
const AMAZON_UK_TAG = 'zwiftalizer-21';
const AMAZON_DE_TAG = 'zwiftalizer0c-21';
const AMAZON_ES_TAG = 'zwiftalizer02-21';
const AMAZON_FR_TAG = 'zwiftalizer06-21';
const AMAZON_IT_TAG = 'zwiftalizer0f-21';

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

  renderShopLinks(){
    const {
      platform,
      gpuVendor,
      gpuTerms,
      cpuVendor,
      cpuTerms
    } = this.props.data;
    
    const cpuShopLinks = [];
    const gpuShopLinks = [];

    let gpuLinks;
    let gpuLinksMarkup;

    console.log(platform);

    if (platform !== 'alienware' && platform !== 'iOS' && (gpuVendor === 'nvidia' || gpuVendor === 'ati') && gpuTerms && gpuTerms.length) {
      const queryStringTerms = gpuTerms.join('+');

      const pricewatchLink = `http://www.pricewatch.com/search?q=${queryStringTerms}&gallery=1&sortby=price&condition=new&discounted=1`;
      gpuShopLinks.push({
        tag: PRICEWATCH_LABEL,
        href: pricewatchLink
      });

      const tweakersLink = `https://tweakers.net/pricewatch/zoeken/?keyword=${queryStringTerms}`;
      gpuShopLinks.push({
        tag: TWEAKERS_LABEL,
        href: tweakersLink
      });

      const neweggLink = `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=PRICE&PageSize=36&Description=${queryStringTerms}`;
      gpuShopLinks.push({
        tag: NEWEGG_LABEL,
        href: neweggLink
      });

      const amazonUsLink = `https://www.amazon.com/s?tag=${AMAZON_US_TAG}&keywords=${queryStringTerms}`
      gpuShopLinks.push({
        tag: AMAZON_US_LABEL,
        href: amazonUsLink
      });

      const amazonUkLink = `https://www.amazon.co.uk/s/?tag=${AMAZON_UK_TAG}&field-keywords=${queryStringTerms}`
      gpuShopLinks.push({
        tag: AMAZON_UK_LABEL,
        href: amazonUkLink
      });

      const amazonCaLink = `https://www.amazon.ca/s/?tag=${AMAZON_CA_TAG}&field-keywords=${queryStringTerms}`
      gpuShopLinks.push({
        tag: AMAZON_CA_LABEL,
        href: amazonCaLink
      });

      const amazonFrLink = `https://www.amazon.fr/s/?tag=${AMAZON_UK_TAG}&field-keywords=${queryStringTerms}`
      gpuShopLinks.push({
        tag: AMAZON_FR_LABEL,
        href: amazonFrLink
      });

      const amazonEsLink = `https://www.amazon.es/s/?tag=${AMAZON_UK_TAG}&field-keywords=${queryStringTerms}`
      gpuShopLinks.push({
        tag: AMAZON_ES_LABEL,
        href: amazonEsLink
      });

      const amazonDeLink = `https://www.amazon.de/s/?tag=${AMAZON_UK_TAG}&field-keywords=${queryStringTerms}`
      gpuShopLinks.push({
        tag: AMAZON_DE_LABEL,
        href: amazonEsLink
      });

      const amazonItLink = `https://www.amazon.it/s/?tag=${AMAZON_UK_TAG}&field-keywords=${queryStringTerms}`
      gpuShopLinks.push({
        tag: AMAZON_IT_LABEL,
        href: amazonEsLink
      });

      gpuLinksMarkup = gpuShopLinks.map(
        function(link, i) {
          return <li><a href={link.href}>{link.tag}</a></li>;
        },
        this
      );

      gpuLinks = <div><span className={styles.shoplinksLabel}>GPU:&nbsp;</span><ul className={styles.shoplinks}>{gpuLinksMarkup}</ul></div>
          
    }
    
    return <div>
    {gpuLinks}
    </div>;

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
          marginBottom: '3rem'
        }
      : {};

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
          <div className="col-xs-12 col-sm-5">
            <div className={styles.systemName}>
              {systemId}
            </div>
            {detailsMarkup}
            {shopLinksMarkup}
          </div>
          <div className="col-xs-12 col-sm-5">
            <div className={styles.samplesOuter}>
              <div className={styles.samplesInner}>
                {samples}<br />Logs
              </div>
            </div>
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
