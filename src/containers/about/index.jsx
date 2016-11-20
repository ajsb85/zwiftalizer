import React from 'react'

import structure from '../../styles/structure.css'
import editorial from '../../styles/editorial.css'

class About extends React.Component {

  render() {

    return (
      <div className="container-fluid">
        <div className={editorial.boxesWrapOuter}>
          <div className={structure.boxesWrapInner}>
            <div className={structure.boxLast}>
              <div className={editorial.editorialBoxHeading}>About the Zwiftalizer</div>
              <div className={editorial.editorialBoxContent}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">

                      <h3>What does the Zwiftalizer technology stack look like?</h3>

                      <h4>AWS Route 53, API Gateway, Lambda, DynamoDB, S3, CloudFront, JavaScript everywhere</h4>

                      <div className={editorial.architectureDiagramWrapper}>
                        <img src="/img/architecture.png" alt="architecture diagram"/>
                      </div>

                      <p></p>

                      <p>
                        One of the goals of this project was to create an easy to use, cross-platform tool for Zwifters to inspect their log files without having to install any software. The minimum
                        requirement to run the tool is any modern web browser that supports HTML 5 (canvas), CSS 3, and JavaScript. Chrome, Edge and Safari are preferred. Firefox, Opera and Internet
                        Explorer might work, but are not tested.
                      </p>
                      <p>
                        A second goal was to make a useful application using only AWS services instead of paying for traditional web and database server hosting.
                      </p>

                      <h4>The Front End</h4>
                      <p>
                        The front end HTML, CSS and JavaScript is served by AWS CloudFront in every edge location available around the globe. The parser runs entirely in the browser so does not need a
                        server for uploading or processing. The HTML, CSS and JavaScript sits in an S3 bucket, with Route 53 DNS pointing to the CloudFront distribution in front of the S3 bucket. Bucket
                        hosting is virtually free (3 cents a month). The domain name costs $12 a year, plus 50c per month for hosting the zone file in Route 53. This is the biggest cost. Bandwidth out and
                        CloudFront invalidations are the next biggest cost.
                      </p>
                      <p>
                        The programming language is JavaScript, sort of. The app is written in ES2015 spec JavaScript (which not all browsers support yet). It is similar to writing for NodeJS, uses React
                        for UI components, Redux for state management and React Timeseries charts for the graphs. The modular codebase is transpiled and minified using Babel and Webpack. This converts it
                        into to a single 'bundle.js' file that is compatible with older browsers. The images are baked into the CSS, which is then in-lined into the React components at run-time. This
                        reduces the number of requests for assets, but increases the wait time between first byte downloading and the app being ready to run. React router is used to switch between the
                        'pages' (single page app). CloudFront further reduces the size of the JavaScript bundle using gzip compression.
                      </p>
                      <p>
                        The parser functions are simple Regex pattern matches, with some functions brought in from Underscore and PondJS to make things like 3 second averages (which reduces the amount of
                        points the charts have to draw, making interactions much quicker).
                      </p>
                      <p>
                        Once the JavaScript has loaded no more requests are made. The initial load time is between 2 and 5 seconds depending on where you are in the World and how close you are to an AWS
                        edge location (mirror).
                      </p>

                      <h3>
                        How are the systems identified in the Benchmarks report
                      </h3>
                      <p>
                        A system is identified by its OS, CPU and GPU 'signature'. A system appears no more than once in each resolution-profile table. When a user uploads a log from a system that already
                        exists in the database then the averages are taken again for all instances of that type of system at that resolution and profile.
                      </p>
                      <h3>
                        Benchmarks Frequently Asked Questions
                      </h3>
                      <h4>
                        Q: Why is my system listed under '1440 High' when I chose '1440 Ultra' in the game? (or '1080 Basic' when I chose '1080 High').
                      </h4>
                      <p>
                        A: Resolution and profile are actually two separate things. Resolution is the number of horizontal lines in the picture. Profile is the level of detail of items rendered - things
                        like road texture, walls, buildings, clothing, skin, and special effects like lighting, reflections, dust and shadows. Profile is set by the game engine code depending on the
                        capabilities of your GPU. It can not be set manually.
                      </p>
                      <h4>
                        Q: Why do some systems appear to be capped at 60 FPS?
                      </h4>
                      <p>
                        A: It is most probably because the frame rate is set to synchronize with the refresh rate of the display. The refresh rate of the vast majority of HD TVs is 60Hz.
                      </p>
                      <h4>
                        Q: What's the tech behind this report?
                      </h4>
                      <p>
                        A: AWS API Gateway, AWS Lambda (nodejs, ramda), AWS DynamoDB, AWS S3, AWS CloudFront, AWS Route 53. See the&nbsp;<a href="https://github.com/mhanney/serverless-zwiftalizer" target="_blank">serverless-zwiftalizer</a>&nbsp; github repo for more details.
                      </p>
                      <h4>
                        Q: Why was this report made?
                      </h4>
                      <p>
                        A: To know when enough is enough (the point of diminishing returns - 4th gen Core i3 + Nvidia GTX 960 with a 1080 TV, for example). To make informed purchasing decisions. To learn
                        new tech.
                      </p>

                      <h3>What does the Benchmarks backend look like?</h3>

                      <h4>Lambda and DynamoDB</h4>

                      <p>
                        The Benchmarks backend is fully event driven using AWS Lambda as the only computing service. When the functions are not being called, there are no charges. There are only two
                        Lambda functions, written in NodeJS, and two DynamoDB tables - one for the raw log summaries, and one for the benchmarks. There are two secondary indexes to support the queries and
                        scans needed to make the benchmarks report. The 'serverless' benchmarks system was developed using the&nbsp;<a href="https://github.com/serverless/serverless" target="_blank">serverless</a>&nbsp;framework.
                      </p>
                      <p>
                        On reading a log, the web client posts a benchmarks summary to the first Lambda functions via the AWS API Gateway. This is an AJAX POST. The function simply inserts records into
                        DynamoDB.
                      </p>
                      <p>
                        The second Lambda function is triggered by the DynamoDB benchmarks table update and dumps a new benchmarks data file to an S3 bucket in JSON format.
                      </p>
                      <p>
                        The front end reads the JSON file from S3 via an AJAX get request on page load. The S3 bucket location on the benchmarks JSON is deliberately excluded from the CloudFront CDN so
                        that it is always up to date. The client never reads from DynamoDB directly.
                      </p>
                      <p>
                        Something like the first million Lambda invocations per month are free. The DynamoDB usage is tiny and also well under the free tier. Lambda and DynamoDB free tiers do not expire
                        after the first 12 months.
                      </p>

                      <h3>Privacy Policy</h3>

                      <p>
                        The log reader code runs entirely on your computer. Your log file does not get uploaded anywhere. A fragment of computer performance data is optionally uploaded to a database to be
                        included in the benchmarks report. No personal data is every uploaded.
                      </p>
                      <p>
                        The following data is included in the upload: Operating System type (Windows or Mac), CPU make and model, GPU make and model, RAM, min FPS, avg FPS, max FPS, resolution, profile,
                        date, time and duration of the activity in the log.
                      </p>

                      <h3>Support</h3>

                      <p>This is a free, open source project by members of the Zwift community and is not connected to Zwift LLC in any way. Use of the tool comes with no guarantee or support. You can
                        follow progress on&nbsp;
                        <a href="https://github.com/mhanney/zwiftalizer/" target="_blank">Github</a>,&nbsp;
                        <a href="https://twitter.com/zwiftalizer" target="_blank">Twitter</a>
                        &nbsp;and sometimes in the&nbsp;
                        <a href="https://www.facebook.com/groups/zwiftCoders/" target="_blank">Facebook Zwift Coders group</a>.
                      </p>

                      <h3>Copyrights and licenses</h3>

                      <p>ReactJS is copyright of&nbsp;
                        <a href="https://code.facebook.com/projects/" target="_blank">Facebook Open Source</a>
                      </p>

                      <p>React Timeseries Charts and Pond.js are copyright of&nbsp;
                        <a href="http://www.es.net/" target="_blank">ESNet</a>&nbsp;- the Department of Energy's dedicated science network, and The Regents of the University of California through Lawrence Berkeley National Laboratory.</p>

                      <p>The glue code between those two heavy weights is copyright Mike Hanney</p>

                      <p>
                        <a href="https://github.com/mhanney/zwiftalizer/blob/master/LICENSE.md" target="_blank">The full licenses can be found here</a>
                      </p>

                      <p>Ride on!&nbsp;<em>Mike</em>
                      </p>

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
export {About}
