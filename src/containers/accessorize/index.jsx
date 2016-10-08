import React from 'react'

import structure from '../../styles/structure.css'
import styles from './styles.css'

class Accessorize extends React.Component {

  createAmzBanner() {
    return {
      __html: '<script type="text/javascript">\namzn_assoc_placement = "adunit0";\namzn_assoc_search_bar = "true";\namzn_assoc_tracking_id = "zwiftalizer-20";\namzn_assoc_ad_mode = "manual";\namz' +
          'n_assoc_ad_type = "smart";\namzn_assoc_marketplace = "amazon";\namzn_assoc_region = "US";\namzn_assoc_title = "Sponsored Links";\namzn_assoc_linkid = "c416d87a7c2565f3002a13b4a2421' +
          '166";\namzn_assoc_asins = "B01FLKSM7Q,B00F0T5OPM,B0112VE4NO,B00MCF5Q2I,B001C6DBXE,B01JK56Y6E";\n</script>\n<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US"></s' +
          'cript>'
    }
  }

  render() {

    // style="border:none !important; margin:0px !important;"
    return (

      <div className="container-fluid">
        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>&nbsp;</div>
              <div className={styles.accessorizeHeading}>
                The Tested Best Accessories For Zwift
              </div>

              <div className={styles.accessorizeBoxContent}>
                <div dangerouslySetInnerHTML={this.createAmzBanner()}></div>
              </div>

              <div className={styles.accessorizeBoxContent}>

                <p>
                  This list of Zwift related devices is considered to be 'the best' by members of the Zwift community. I personally own all of these except the Vornado fan.
                </p>

                <p>
                  The Zwiftalizer runs on Amazon Web Services (AWS) and is mirrored in 29 locations across 5 continents. Buying something from this list will generate a 2.5% to 4% commission that
                  will directly offset the AWS charges. All links are to Amazon USA. Sorry friends in Canada, UK, EU, South America, Australia. I can not run affiliate links outside of the USA
                  because of complicated tax rules.
                </p>

              </div>
            </div>
          </div>
        </div>

        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>Best ANT+ USB Dongle</div>
              <div className={styles.accessorizeBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-2">
                      <div className={styles.accessorizeProduct}>
                        <div className="center-block">
                          <iframe
                            marginwidth="0"
                            marginheight="0"
                            scrolling="no"
                            frameborder="0"
                            src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=zwiftalizer-20&marketplace=amazon&region=US&placement=B004YJS3LG&asins=B004YJS3LG&linkId=079eed667d7049e9a962baf05905e50f&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"></iframe>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-offset-1 col-sm-7">
                      <div className={styles.accessorizeProduct}>
                        <h2>Suunto Movestick Mini</h2>
                        <p>This is&nbsp;<strong>THE BEST</strong>&nbsp;ANT+ stick available anywhere.</p>
                        <p>
                          DC Rainmaker made this call way back in February 2012
                        </p>
                        <p>
                          See&nbsp;
                          <a href="http://www.dcrainmaker.com/2012/02/much-better-usb-ant-stick-for-your.html" target="_blank">A much better USB ANT+ stick [than Garmin's]</a>
                        </p>
                        <p>
                          Price varies, but is usually not more than $30 USD.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>Best USB Extension Cable</div>
              <div className={styles.accessorizeBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-2">
                      <div className={styles.accessorizeProduct}>
                        <div className="center-block">
                          <iframe
                            marginwidth="0"
                            marginheight="0"
                            scrolling="no"
                            frameborder="0"
                            src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=zwiftalizer-20&marketplace=amazon&region=US&placement=B00NH11PEY&asins=B00NH11PEY&linkId=7ddd529a875ffcbe6c3ccc1c6ac580a9&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"></iframe>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-offset-1 col-sm-7">
                      <div className={styles.accessorizeProduct}>
                        <h2>AmazonBasics USB 2.0 Extension Cable - A-Male to A-Female - 9.8 Feet (3 Meters)</h2>

                        <ul>
                          <li>One 9.8-foot-long (3 meters) USB 2.0 A-Male to A-Female high-speed extension cable</li>
                          <li>Extends your USB connection to your computer by 9.8 feet</li>
                          <li>Constructed with corrosion-resistant, gold-plated connectors for optimal signal clarity and shielding to minimize interference</li>
                          <li>Features shielding that provides protection against noise from electromagnetic and radio-frequency signals, keeping your signal clear with less loss of bandwidth for higher
                            performance</li>
                          <li>The Male 'A' connector plugs into your computer and the ANT+ stick plugs into the Female 'A' connector.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>Best multi-pack CR2032 Coin Cell Batteries</div>
              <div className={styles.accessorizeBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-2">
                      <div className={styles.accessorizeProduct}>
                        <div className="center-block">
                          <iframe
                            marginwidth="0"
                            marginheight="0"
                            scrolling="no"
                            frameborder="0"
                            src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=zwiftalizer-20&marketplace=amazon&region=US&placement=B008XBK7PG&asins=B008XBK7PG&linkId=e33c4b047fb215ba3e619b75d2b7af78&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"></iframe>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-offset-1 col-sm-7">
                      <div className={styles.accessorizeProduct}>
                        <h2>Sony CR2032 Lithium Coin Cell 3V 20 Pack</h2>
                        <ul>
                          <li>10 year shelf life</li>
                          <li>Genuine Sony Packaging with date code on each blister</li>
                          <li>Not Counterfeit</li>
                          <li>Lightweight, High Voltage and High Energy Density</li>
                          <li>Excellent Discharge Characteristics</li>
                          <li>Outstanding Temperature Characteristics</li>
                          <li>Excellent Long-Term Reliability</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={structure.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={structure.boxHeadingLast}>Best Wired Earbud Headphones</div>
              <div className={styles.accessorizeBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-2">
                      <div className={styles.accessorizeProduct}>
                        <div className="center-block">
                          <iframe
                            marginwidth="0"
                            marginheight="0"
                            scrolling="no"
                            frameborder="0"
                            src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=zwiftalizer-20&marketplace=amazon&region=US&placement=B003EM8008&asins=B003EM8008&linkId=ab5f3ecfd5354bdf88ce0a340e919316&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"></iframe>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-offset-1 col-sm-7">
                      <div className={styles.accessorizeProduct}>
                        <h2>Panasonic ErgoFit In-Ear Earbud Headphones RP-HJE120-K (Black) Dynamic Crystal Clear Sound, Ergonomic Comfort-Fit</h2>
                        <p>
                          I was sceptical of the reviews when I bought these in-ear buds becuase I am an total audiophile snob who owns Bose, Sennheiser and Etymotic earphones that cost literally 30 times
                          more than these. They are incredible. They are even comfortable. I would choose them over the Etymotic set I own, that cost 15 times more, any day.
                        </p>
                        <ul>
                          <li>Black ultra-soft ErgoFit in-ear earbud headphones conform instantly to your ears</li>
                          <li>Eight vivid fashion color options with color-matching earbuds and cords</li>
                          <li>Wider frequency response for fuller listening enjoyment</li>
                          <li>Long 3.6-ft cord threads comfortably through clothing and bags</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export {Accessorize}
