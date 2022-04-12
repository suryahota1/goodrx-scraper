const ErrorHandler = require("./error-handler");
const { EventError } = require("./ErrorTypes");

class EventTracker {

    #eventTypeCbMap = {};
    #eventUID = 1;

    constructor () {

    }

    subscribeToEvent ( eventType, cb ) {
        if ( this.#eventTypeCbMap.hasOwnProperty(eventType) ) {
            this.#eventTypeCbMap[eventType][this.#eventUID] = cb;
            return this.#eventUID++;
        } else {
            throw new EventError(ErrorHandler.MESSAGE.NO_SUCH_EVENT + " " + eventType, ErrorHandler.CODE.NO_SUCH_EVENT);
        }
    }

    notifyEvent ( eventType, data ) {
        if ( this.#eventTypeCbMap.hasOwnProperty(eventType) ) {
            const cbs = Object.keys(this.#eventTypeCbMap[eventType]);
            for ( let i = 0; i < cbs.length; i++ ) {
                this.#eventTypeCbMap[eventType][cbs[i]](data);
            }
        }
    }

    removeEventSubscription ( eventType, eId ) {
        if ( this.#eventTypeCbMap[eventType] && this.#eventTypeCbMap[eventType][eId] ) {
            delete this.#eventTypeCbMap[eventType][eId];
        } else {
            throw new EventError(ErrorHandler.MESSAGE.NO_SUCH_EVENT, ErrorHandler.CODE.NO_SUCH_EVENT);
        }
    }

    removeAllSubscriptions () {
        this.#eventTypeCbMap = {};
        this.#eventUID = 1;
    }

    defineEvents ( events = [] ) {
        for ( let i = 0; i < events.length; i++ ) {
            this.#eventTypeCbMap[events[i]] = {};
        }
    }
}

module.exports = EventTracker;
