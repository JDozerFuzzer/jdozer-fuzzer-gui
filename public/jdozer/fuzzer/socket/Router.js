

Ext.define('fuzzer.socket.Router', {
    alternateClassName: 'Router',
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    inbound: function (event) {
        try {
            if (event.headers.entityType === 'fuzzer-processor') {
                this._fromProcessorRouter(event);
            } else if (event.headers.entityType === 'fuzzer-seeder') {
                this._fromSeederRouter(event);
            } else if (event.headers.entityType === 'fuzzer-vectors') {
                this._fromVectorsRouter(event);
            } else if (event.headers.entityType === 'fuzzer-engine') {
                if (event.headers.eventType === 'engine-started') {
                    this._fuzzerStarted(event.payload);
                }
            }
        } catch (e) {
            console.error('Error in inbound:', e);
            throw e;
        }
    },
    _fromVectorsRouter: function (message) {
        try {
            if (message.headers.eventType === 'builder-successful') {
                eventBroker.fireEvent('vectors-builder-successful', message.payload);
            }
        } catch (e) {
            console.error('Error in _fromVectorsRouter:', e);
            throw e;
        }
    },
    _fromSeederRouter: function (message) {
        try {
            console.log('📩 Evento de seeder:', message);
            if (message.headers.eventType === 'read-contract') {
                eventBroker.fireEvent('read-contract', message.payload);
            }
        } catch (e) {
            console.error('Error in _fromSeederRouter:', e);
            throw e;
        }
    },
    _fromProcessorRouter: function (message) {
        try {
            /**
            if (message.headers.eventType === 'prepare-cases') {
                eventBroker.fireEvent('fuzzer-engine-cases-prepared', message.payload);
            }
            if (message.eventType === 'cases-loaded') {
                eventBroker.fireEvent('fuzzer-engine-cases-loaded', message.payload);
            }
            if (message.eventType === 'request-created') {
                eventBroker.fireEvent('fuzzer-engine-request-created', message.payload);
            }
            */
            if (message.headers.eventType === 'status-code-runtime') {
                eventBroker.fireEvent('status-code-runtime', message.payload);
            }
            /**
            if (message.eventType === 'attack-completed') {
                eventBroker.fireEvent('fuzzer-engine-attack-completed', message.payload);
            }
            */
        } catch (e) {
            console.error('Error in _engineRouter:', e);
            throw e;
        }
    },
    _fuzzerStarted: function (data) {
        try {
            console.log('📩 Evento de fuzzer started:', data);
            eventBroker.fireEvent('fuzzer-started', data);
        } catch (e) {
            console.error('Error in _fuzzerStarted:', e);
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