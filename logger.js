const fs = require("fs");
const { Console } = console;

const Log = (() => {
    let logger;

    function logRef () {
        return {
            log: function() {
                if ( logger ) {
                    logger.log(...arguments);
                } else {
                    console.log(...arguments);
                }
            },
            error: function() {
                if ( logger ) {
                    logger.error(...arguments);
                } else {
                    console.error(...arguments);
                }
            },
            warn: function() {
                if ( logger ) {
                    logger.warn(...arguments);
                } else {
                    console.warn(...arguments);
                }
            }
        }
    }

    function createLogger ( logFilePath ) {
        // Custom simple logger
        try {
            const output = fs.createWriteStream(logFilePath);
            const errorOutput = fs.createWriteStream(logFilePath);
            logger = new Console({ stdout: output, stderr: errorOutput });
        } catch ( e ) {
            throw new Error("Logger failed");
        }
    }

    global.Logger = logRef();

    return {
        createLogger
    };
})();

module.exports = Log;
