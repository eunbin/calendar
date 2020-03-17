module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        path: {
          '^/api': ''
        }
      }
    }
  },
  outputDir: '../backend/public',
  indexPath: '../public/index.html',
  productionSourceMap: false
}
