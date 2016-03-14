module.exports = {
  entry: "./client.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
	test   : /.js$/,
	loader : 'babel-loader',
	query: {
	  presets: ['es2015']
	},
      }
    ]
  },
  devtool: 'source-map',
};
