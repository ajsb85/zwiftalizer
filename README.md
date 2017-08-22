# Zwiftalizer

Zwift log file analyzer - a web browser based drag and drop tool for reading Zwift log files

![screenshot1](https://github.com/mhanney/zwiftalizer/blob/master/screenshots/screencapture-localhost-8080-1472101188829.png)

![screenshot2](https://github.com/mhanney/zwiftalizer/blob/master/screenshots/screencapture-localhost-8080-1472101154779.png)

![screenshot3](https://github.com/mhanney/zwiftalizer/blob/master/screenshots/screencapture-localhost-8080-1472101207665.png)

## What is this?

This is a browser based tool to analyze the log file from the Zwift cycling
platform and output graphics, ANT+ device and network performance charts.
The code runs 100% in your web browser on your computer.

## 1.4.0 Changes (2017-08-19)

* Maintenance and some UI changes.
* Replaced Tabbed UI with single page showing all charts and recommendations.
* ANT+ signal charts - Added list of hh:mm:ss times where the ANT+ signal looked to be weak or lost.
* ANT+ signal charts - Simplifed to only signal strenght type of chart (removed Power meter, Smart Trainer, Kickr specific charts). 
The .fit file is more appropriate for rendering power over time, and not all PMs (Power2Max) have their power logged. It wasn't worth the maintenance.
* ANT+ signal charts - Added list of recommended ANT+ dongles and extension cables with AMZ associate links.
* Powersources - Country specific Smart Trainer and Power meter usage now needs at least 25 devices to qualify for rendering.
* Powersources - Smart Trainer and Power meter usage X axis labels cleaned up.
* Powersources - Recognition of more powermeter and smart trainer models - Quark DFour, Rotor Power Dual, Elite Direto.
* Loader - removed animation and confetti.
* Now works in Microsoft IE 11 and Edge.
* Updated React to version 15.6.1.
* Updated Webpack to version 3.5.2.
* Update Pondjs to version 0.8.7.
* Update React Timeseries Charts to version 0.12.8.


## 1.1.0 Changes (2017-05-13)

* Filters added to the Benchmarks report
* More detailed computer specs in the Benchmarks report, especially for Apple Mac and iOS models.
* Links to search Pricewatch, Tweakers, eBay and Amazon for each system in the Benchmarks report (not Apple products).
* Improved charting of ANT+ signals
* Power meter and smart trainer usage per country report added
* More power meter and smart trainer models recognized for improved labeling of the ANT+ charts
* Plain English opinion of ANT+ signal strength in the 'Analysis' tab with tips on how to improve signal strength
* BTLE signal plot now recognizes Kickr Snap and more Tacx trainers
* Added flare
* Recognition of more powermeter and smart trainers.
* Garmin Vector SS,
* Garmin Vector CP
* Garmin Vector S
* Garmin Vector 2
* Garmin Vector 2S
* Power2Max NG
* Four Eyes Precision
* Stages Power

## 1.0.3 Changes (2017-03-16)

* Recognition of more powermeter and smart trainers. Product codes contributed by [Shane Miller](https://www.youtube.com/user/gplama) (who owns more indoor trainers than shoes).
* Elite Drivo
* Elite Kura
* Elite Rampa
* ELite QUBO Digital Smart B+
* PowerTap P1 Pedals
* Tacx Flux
* CycleOps Hammer

* Changed the License so that copying this source code for commercial use is not allowed.

## 1.0.2 Changes (2017-03-08)

* Faster parsing - reuses the unix timestamp from the previous line conversion if the time in the next line is the same as the previous line.
* Smaller download without the Shop html bundle
* updated unit tests to use the callback version of the date conversion function


## 1.0.1 Changes (2017-03-07)

* The Firefox fix: Converting dates no longer blocks the main javascript thread, so it no longer throws warnings on Firefox, and all browsers will be more responsive to events while the long date conversion loop is executing.
* Removed the Store section


## 1.0 Changes (2017-02-14)

* 1 year in beta


## 0.9.9 Changes (2017-01-20)

* Enforced HTTPS only


## 0.9.8 Changes (2016-12-09)

* iOS update - parsing of Apple iOS device CPU, GPU and resolutions.


## 0.9.7 Changes (2016-11-27)

* Benchmarks - Added button to locate & highlight current system in the benchmarks.
* Graphics - Added opinionated score out of 10 badge and button to locate & highlight current system in the benchmarks.
* Added Analysis Tab. A wordy description of where the current system ranks compared to others and how the score was decided.
* Added BTLE Tab. Experimental attempt to plot Bluetooth Smart messages over time.


## 0.9.6 Changes (2016-11-22)

* Benchmarks - Added system count (absolute and percentage) in each Resolution/Profile group
* Benchmarks - Added opinionated score out of 10 and novelty caption for each Resolution/Profile group
* Benchmarks - Collapsible panels with state persisted to local storage
* Benchmarks - Default expanded panel is 1080 High, and whatever Resolution/Profile group the current system falls into
* Maintenance - Renamed Accessorize to Shop
* Maintenance - Fixed issue with gradient change data not rendering for Wahoo and Tacx trainers
* Maintenance - Removed battery level indicators (too many proprietary message types to support)
* Maintenance - ReactJS updated to version 15.3.2
* Maintenance - React Timeseries Charts updated to version 0.10.2
* Maintenance - PondJS updated to version 0.7.2
* Maintenance - Updated chart styles


## 0.9.1 Changes (2016-08-24)

* ANT+ Device signal per channel
* ANT+ Device signal is POSITIVE (assumed sample rate minus RxFails per second)
* ANT+ Basic device (4Hz) and Advanced device (8Hz) sample rates guessed (experimental)
* ANT+ Device to channel mapped correctly
* ANT+ Device battery level indicator (if device broadcasts it)
* ANT+ Power source identification (experimental)
* ANT+ Device manufacturer and model identification (experimental)
* ANT+ Powermeter reading line chart for crank and wheel based meters (including Kickr, not including Power2Max)
* ANT+ Powermeter calibration (current zero offset value) displayed (not including Power2Max)
* ANT+ Powermeter calibration auto-zero enabled displayed (true/false/unsupported)
* ANT+ reconnects now shows max value per 10s rollup (to exaggerate bars)
* ANT+ reconnects chart zoom (mouse wheel)
* ANT+ reconnects chart pan (click and drag)
* ANT+ Wahoo Kickr gradient changes line chart
* ANT+ FE-C gradient changes line chart (Tested with Tacx Neo logs)
* Network reconnect attempts chart
* Network phone connection attempts chart
* Network errors chart
* Graphics OpenGL major version and driver version
* Graphics shadow resolution
* Graphics min, avg, max FPS update to chart highlighted area
* Graphics line chart zoom (mouse wheel)
* Graphics line chart pan (click and drag brush area)
* Graphics line chart tracker (vertical bar)
* Graphics line chart using 15s avg rollups for performance
* Tabbed sections for ANT+, Network and Graphics
* Redux for managing state
* Replaced Dropzone.js with React Dropzone
* Parser function mini-library for improved testing with fewer side effects
* More unit tests
* Activity Date Time changed from ANSI to more humanly readable format
* Styles overhaul (CSS modules)
* Removed opinions and incorrect assumptions from 'help' modal windows
* Removed Pondjs and react-timeseries-charts source code from repo
* Using pondjs 0.6.0 from npm
* Using react-timeseries-charts 0.9.2 from npm


## 0.3.1 Changes (2016-04-05)

* Can now parse logs shorter than 3 minutes again
* Logs longer than 3 minutes skip the first 3 minutes of FPS data
* Logs shorter than 3 minutes include all FPS data
* Removed dependency on jQuery
* Removed dependency on Bootstrap JavaScript
* Replaced jQuery ajax with qwest (for the demo)
* Replaced Bootstrap.js with bootstrap.native


## 0.3.0 Additions (2016-02-26)

* ANT+ Power Meter message count per second
* ANT+ Smart Trainer message count per second
* ANT+ message failure count per device per second
* ANT+ reconnects count (global, per second)
* FPS chart points reduced to 3 sec averages
* Pan Zoom with mouse wheel
* Demo mode
* [ESnet's React Timeseries Charts](https://github.com/esnet/react-timeseries-charts), Copyright of The Regents of the University of California, through Lawrence Berkeley National Laboratory.
* Unit tests in Tape.js
* Help screens


## 0.2.0 Additions (2016-01-25)

* Graphics Profile
* Graphics Resolution
* Platform (PC or Mac)
* CPU Vendor
* GPU Vendor
* Basic System Info
* Log Date, Time and Duration
* Faster parsing
* Unit tests

## What's it written in?

This application is written entirely in ES6 JavaScript and uses ReactJS,
React Dropzone, Twitter Bootstrap and ESnet's React Timeseries Charts.
The run-time javascript is built using nodejs, babel and webpack.

## Why?

I created this because there wasn't a cross platform, easy to use, zero
dependency log reader for end users. I use several machines for Zwift and wanted
an easy way to see how each one performs without installing anything.

## What is Zwift?

Zwift is a "massively multiplayer online game" where cyclists compete against
one another in virtual, three-dimensional worlds. To participate, riders need a
bike, a stationary trainer, and basic wireless sensors that measure speed and
cadence. For more accurate data, Zwift's gamers use a power meter or smart
trainer that measures the actual force cyclists apply to the pedals. Riders also
need a computer and a n ANT+ dongle.

## How do I use it?

Go to [http://zwiftalizer.com/](http://zwiftalizer.com/) and drop your file onto the dotted box.

## How can I contribute?

Clone this repository then do the following:

Assuming node and npm are installed and in your path, cd to the cloned directory
and run the following commands to install the node dependencies needed to build
the source.

```
npm install --no-optional
```

For development, run webpack from the npm script labeled `dev` (defined in
package.json)

```
npm run dev
```

To make a release build, run the npm script labeled `release` (defined in
package.json)

```
npm run release

```

To run the tests

```
npm run test

```

## Acknowledgements and References

* [ReactJS](https://facebook.github.io/react/) &mdash; a JavaScript library for building user interfaces (Facebook Inc)

* [react-timeseries-charts](https://github.com/esnet/react-timeseries-charts) Declarative and modular timeseries charting components for React

* [pond](https://github.com/esnet/pond) Immutable timeseries data structures used within ESnet tools

* [d3](http://d3js.org/) &mdash;a JavaScript library for manipulating documents based on data

* [Bootstrap](https://github.com/twbs/bootstrap) &mdash; Modern UI components and interactions

* [nodejs](https://github.com/joyent/node) &mdash; evented I/O for v8 javascript

* [Tape](https://github.com/substack/tape) &mdash; tap-producing test harness for node and browsers

* [webpack](https://webpack.github.io/) &mdash; Webpack is a module bundler for JavaScript. Webpack takes modules with dependencies and generates static assets representing those modules.

* [Zwift](http://zwift.com/) &mdash; GLOBAL. CYCLING. COMMUNITY.

##Licenses


### ESnet React Timeseries Charts License

"ESnet React Timeseries Charts, Copyright (c) 2015, The Regents of the
University of California, through Lawrence Berkeley National Laboratory (subject
to receipt of any required approvals from the U.S. Dept. of Energy). All rights
reserved."

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

(1) Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

(2) Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation and/
or other materials provided with the distribution.

(3) Neither the name of the University of California, Lawrence Berkeley National
Laboratory, U.S. Dept. of Energy nor the names of its contributors may be used
to endorse or promote products derived from this software without specific prior
written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

You are under no obligation whatsoever to provide any bug fixes, patches, or
upgrades to the features, functionality or performance of the source code
("Enhancements") to anyone; however, if you choose to make your Enhancements
available either publicly, or directly to Lawrence Berkeley National Laboratory,
without imposing a separate written license agreement for such Enhancements,
then you hereby grant the following license: a  non-exclusive, royalty-free
perpetual license to install, use, modify, prepare derivative works, incorporate
into other computer software, distribute, and sublicense such enhancements or
derivative works thereof, in binary and source code form.

### ESnet Pond License

ESnet Timeseries Library (Pond), Copyright (c) 2015, The Regents of the
University of California, through Lawrence Berkeley National Laboratory (subject
to receipt of any required approvals from the U.S. Dept. of Energy).  All rights
reserved."

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

(1) Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

(2) Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation and/or
other materials provided with the distribution.

(3) Neither the name of the University of California, Lawrence Berkeley National
Laboratory, U.S. Dept. of Energy nor the names of its contributors may be used
to endorse or promote products derived from this software without specific prior
written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

You are under no obligation whatsoever to provide any bug fixes, patches, or
upgrades to the features, functionality or performance of the source code
("Enhancements") to anyone; however, if you choose to make your Enhancements
available either publicly, or directly to Lawrence Berkeley National Laboratory,
without imposing a separate written license agreement for such Enhancements,
then you hereby grant the following license: a  non-exclusive, royalty-free
perpetual license to install, use, modify, prepare derivative works, incorporate
into other computer software, distribute, and sublicense such enhancements or
derivative works thereof, in binary and source code form.


### Zwiftalizer

Copyright (c) 2016 Michael Hanney

[License](https://github.com/mhanney/zwiftalizer/blob/master/LICENSE.md) &mdash; License, Terms and conditions
