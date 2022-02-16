const { WHITE_LIST } = require('../config/constants')

var corsOptionsDelegate = function (req, callback) {
  var corsOptions = { origin: true, credentials: true }
  if (WHITE_LIST.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true }
  } else {
    corsOptions = { origin: false }
  }
  corsOptions = { origin: true, credentials: true }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

module.exports = corsOptionsDelegate
