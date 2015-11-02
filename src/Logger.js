var Log = require('log')
var util = require('util')

Log.prototype.configureFromCli = function(argv) {
    logLevel = 'NOTICE'
    enableQuietMode = argv.q || false
    enableVerboseMode = argv.v || false
    streamToLog = argv.log || process.stdout

    if (enableQuietMode) {
        logLevel = 'EMERGENCY'
    } else if (enableVerboseMode) {
        logLevel = 'DEBUG'
    }

    this.level = Log[logLevel.toUpperCase()]
    this.stream = streamToLog
};

module.exports = exports = new Log
