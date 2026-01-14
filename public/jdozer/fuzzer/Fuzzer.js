

Ext.define('fuzzer.Fuzzer', {
    alternateClassName: 'Fuzzer',
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    statics: {
        getId: function () {
            return Ext.getCmp('fuzzer-selector').getValue();
        }
    }
});