const jwt = require('koa-jwt')
const { jwtSecret } = require('../utils/config')

module.exports = jwt({ secret: jwtSecret })