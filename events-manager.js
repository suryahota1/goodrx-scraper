const EventsManager = (() => {

    const eventTypeCbMap = {};
    let eventSubCount = 1;

    function subscribeToEvent ( eventType, cb ) {
        if ( !eventTypeCbMap.hasOwnProperty(eventType) ) {
            eventTypeCbMap[eventType] = {};
        }
        eventTypeCbMap[eventType][eventSubCount] = cb;
        return eventSubCount++;
    }

    function notifyEvent ( eventType, data ) {
        if ( eventTypeCbMap.hasOwnProperty(eventType) ) {
            const cbs = Object.keys(eventTypeCbMap[eventType]);
            for ( let i = 0; i < cbs.length; i++ ) {
                eventTypeCbMap[eventType][cbs[i]](data);
            }
        }
    }

    function removeEventSubscription ( eventType, eId ) {
        if ( eventTypeCbMap[eventType] && eventTypeCbMap[eventType][eId] ) {
            delete eventTypeCbMap[eventType][eId];
        }
    }

    return {
        subscribeToEvent,
        notifyEvent,
        removeEventSubscription
    }
})();

module.exports = EventsManager;
