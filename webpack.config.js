var webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'public'),
  node_modules: path.join(__dirname, 'node_modules'),
};

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
    //'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

const common = {

  // Entry accepts a path or an object of entries. We'll be using the
  // latter form given it's convenient with more complex configurations.
  entry: {
    app: PATHS.app + '/containers/index.jsx'
  },

  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
        test: /\.(js|jsx)$/,

        loader: 'babel-loader',

        // Parse only app files! Without this it will go through entire project.
        // In addition to being slow, that will most likely result in an error.
        include: PATHS.app,

        // to be absolute sure we aren't babelizing node_modules, exclude that dir explicitly
        exclude: [
          path.resolve(PATHS.node_modules)
        ],

        // Options to configure babel with
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0', 'react'],
        }

      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=65536'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=[name].[ext]"
      }, {
        test: /\.log$/,
        loader: 'raw-loader'
      }
    ]
  },

  node: {
    Buffer: false
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },

  plugins: plugins

};

// Default configuration
if (TARGET === 'dev' || !TARGET) {

  module.exports = merge(common, {

    // enable sourcemaps for debugging js
    devtool: (process.env.DEBUG ? 'eval-source-map' : 'cheap-source-map'),

    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      //hot: true,
      //inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      //stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      //
      // If you use Vagrant or Cloud9, set
      // host: process.env.HOST || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices unlike default
      // localhost
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      //new webpack.HotModuleReplacementPlugin()
    ]

  });
}

if (TARGET === 'release') {

  module.exports = merge(common, {

    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compressor: {
          warnings: true
        }
      })
    ]
  });
}
