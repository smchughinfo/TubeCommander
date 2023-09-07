var fs = require("fs");

var logFile = "C:\\TubeCommander\\error-log.txt";
const handleUncaughtException = (error) => {
    appendToErrorLog('Unhandled Exception:');
    appendToErrorLog(error.stack || error);
    process.exit(1);
};

const handleUnhandledRejection = (reason, promise) => {
    appendToErrorLog('Unhandled Promise Rejection:');
    appendToErrorLog(reason);
    process.exit(1); // Exit the process with a non-zero code
};

function appendToErrorLog(text) {
    fs.appendFileSync(logFile, text);
}

function logErrors() {
    process.on('uncaughtException', handleUncaughtException);
    process.on('unhandledRejection', handleUnhandledRejection);
}

module.exports = {
    LogErrors: logErrors
}