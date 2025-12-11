/**
 * EventBroker
 */


Ext.define('fuzzer.EventBroker', {
    alternateClassName: 'EventBroker',
    extend: 'Ext.util.Observable',
    constructor: function (cfg) {
        this.attributes = {
            eventType: 'defaultType',
            entityType: 'defaultEntity'
        };
        this.addEvents({
            'selectedFuzzerId': true,
            'selectedStatusCode': true,
            'selectedResponse': true
        });
        this.listeners = {
            repositories: function (event) {
                console.debug(`${this.$className}: ${JSON.stringify(event)}`);
            }
        }

        this.callParent(cfg);
    }
});