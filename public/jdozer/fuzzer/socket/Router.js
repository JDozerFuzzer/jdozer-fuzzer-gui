

Ext.define('fuzzer.socket.Router', {
    alternateClassName: 'Router',
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    inbound: function (event) {
        try {
            if (event.headers.entityType === 'fuzzer-processor') {
                this._fromProcessorRouter(event);
            } else if (event.entityType === 'tagging' && event.eventType === 'running') {
                this._taggingRouter(event);
            }
        } catch (e) {
            console.error('Error in inbound:', e);
            throw e;
        }
    },
    _fromProcessorRouter: function (message) {
        try {
            if (message.headers.eventType === 'prepare-cases') {
                eventBroker.fireEvent('fuzzer-engine-cases-prepared', message.payload);
            }
            if (message.eventType === 'cases-loaded') {
                eventBroker.fireEvent('fuzzer-engine-cases-loaded', message.payload);
            }
            if (message.eventType === 'request-created') {
                eventBroker.fireEvent('fuzzer-engine-request-created', message.payload);
            }
            if (message.headers.eventType === 'status-code-runtime') {
                eventBroker.fireEvent('status-code-runtime', message.payload);
            }
            if (message.eventType === 'attack-completed') {
                eventBroker.fireEvent('fuzzer-engine-attack-completed', message.payload);
            }
        } catch (e) {
            console.error('Error in _engineRouter:', e);
            throw e;
        }
    },
    _taggingRouter: function (message) {
        try {
            eventBroker.fireEvent('fuzzer-running-tagging', JSON.parse(atob(message.data)));
        } catch (e) {
            console.error('Error in _taggingRouter:', e);
            throw e;
        }
    }
});