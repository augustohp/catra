var Log = require('log')
  , util = require('util')
  , fs = require('fs')

Log.prototype.configureFromCli = function(argv) {
    logLevel = 'NOTICE'
    enableQuietMode = argv.q || false
    enableVerboseMode = argv.v || false
    streamToLog = argv.log ? fs.createWriteStream(argv.log) : process.stdout

    if (enableQuietMode) {
        logLevel = 'EMERGENCY'
    } else if (enableVerboseMode) {
        logLevel = 'DEBUG'
    }

    this.level = Log[logLevel.toUpperCase()]
    this.stream = streamToLog
};

module.exports = exports = new Log
