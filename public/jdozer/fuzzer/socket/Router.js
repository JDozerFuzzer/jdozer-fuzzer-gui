

Ext.define('fuzzer.socket.Router', {
    alternateClassName: 'Router',
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    inbound: function (event) {
        try {
            if (event.channel === 'jdozer:fuzzer:engine') {
                this._engineRouter(event.message);
            }
        } catch (e) {
            console.error('Error in inbound:', e);
            throw e;
        }
    },
    _engineRouter: function (message) {
        try {
            if (message.eventType === 'prepare-cases') {
                eventBroker.fireEvent('fuzzer-engine-cases-prepared', message.payload);
            }
            if (message.eventType === 'cases-loaded') {
                eventBroker.fireEvent('fuzzer-engine-cases-loaded', message.payload);
            }
            if (message.eventType === 'request-created') {
                eventBroker.fireEvent('fuzzer-engine-request-created', message.payload);
            }
            if (message.eventType === 'response-received') {
                eventBroker.fireEvent('fuzzer-engine-response-received', message.payload);
            }
            if (message.eventType === 'attack-completed') {
                eventBroker.fireEvent('fuzzer-engine-attack-completed', message.payload);
            }
        } catch (e) {
            console.error('Error in _engineRouter:', e);
            throw e;
        }
    }
});