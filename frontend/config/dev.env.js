
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  api: {
    signIn: '"http://local.temo.xyz:8081/album/api/user/signIn"',
    signOut: '"http://local.temo.xyz:8081/album/api/user/signOut"',
    add: '"http://local.temo.xyz:8081/album/api/image/add"',
    getProfile: '"http://local.temo.xyz:8081/album/api/user/getProfile"',
    getTagAll: '"http://local.temo.xyz:8081/album/api/tag/getAll"',
    getIndex: '"http://local.temo.xyz:8081/album/api/tag/getIndex"'
  }
})
