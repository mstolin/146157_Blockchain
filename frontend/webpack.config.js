module.exports = function (webpackEnv) {
  return {
    resolve: {
      fallback: {
        zlib: require.resolve("browserify-zlib"),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
      }
    }
  }
}
