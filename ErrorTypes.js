class ScrapingError extends Error {
    constructor(message, status, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ScrapingError);
        }

        this.name = 'ScrapingError';
        this.message = message;
        this.status = status;
        this.timestamp = new Date();
    }
}

class OutputError extends Error {
    constructor(message, status, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OutputError);
        }

        this.name = 'OutputError';
        this.message = message;
        this.status = status;
        this.timestamp = new Date();
    }
}

class EventError extends Error {
    constructor(message, status, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventError);
        }

        this.name = 'EventError';
        this.message = message;
        this.status = status;
        this.timestamp = new Date();
    }
}

module.exports.ScrapingError = ScrapingError;
module.exports.OutputError = OutputError;
module.exports.EventError = EventError;
