const path = require('path')
const { addWebpackAlias, override } = require('customize-cra')
const { addReactRefresh } = require('customize-cra-react-refresh')

module.exports = override(
  addWebpackAlias({
    '@api': path.resolve('src', 'api'),
    '@assets': path.resolve('src', 'assets'),
    '@components': path.resolve('src', 'components'),
    '@containers': path.resolve('src', 'containers'),
    '@contexts': path.resolve('src', 'contexts'),
  }),
  addReactRefresh({ disableRefreshCheck: true }),
)
