

Ext.define(`fuzzer.FuzzerDetails`, {
    alternateClassName: 'FuzzerDetails',
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    build: function () {
        this.panel = new Ext.Panel({
            title: 'Fuzzer',
            border: 0,
            bodyPadding: '20 20 20 20',
            width: '100%',
            frame: true,
            layout: 'anchor',
            defaults: {
                labelWidth: 150,
                width: 500,
                readOnly: true
            },
            defaultType: 'textfield',
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        fieldLabel: 'Fuzzer Name',
                        value: 'Test Text'
                    }, {
                        fieldLabel: 'Version',
                        value: '1.0.0'
                    }, {
                        fieldLabel: 'Server',
                        value: 'TESTING - http://localhost:3000/api'
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        fieldLabel: 'Users',
                        value: 50
                    }, {
                        fieldLabel: 'Duration Time',
                        value: '10'
                    }]
                }]
            }]
        });
        return this.panel;
    },
    requires: ['fuzzer.StatusCodeGrid']
});