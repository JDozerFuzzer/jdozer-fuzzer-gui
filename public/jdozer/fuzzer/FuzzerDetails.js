

Ext.define(`fuzzer.FuzzerDetails`, {
    alternateClassName: 'FuzzerDetails',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this._subs();
    },
    build: function () {
        this.panel = new Ext.Panel({
            title: 'Fuzzer Details',
            border: 0,
            //width: '700',
            bodyPadding: '15 5 5 5',
            layout: 'anchor',
            defaults: {
                width: 400,
                readOnly: true,
                padding: '0 40 0 0',
                labelWidth: 120
            },
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'Fuzzer Name',
                id: 'fuzzer_name'

            }, {
                fieldLabel: 'Version',
                id: 'fuzzer_version'
            }, {
                fieldLabel: 'Server',
                id: 'fuzzer_server'
            }]
        });
        return this.panel;
    },
    setter: function (fuzzerId) {
        this.data = Ext.Ajax.request({
            url: `/jdozer-fuzzer/bff/fuzzer/${fuzzerId}`,
            scope: this,
            success: function (response) {
                const f = JSON.parse(response.responseText);
                this.panel.items.get('fuzzer_name').setValue(f.name);
                this.panel.items.get('fuzzer_version').setValue(f.version);
                this.panel.items.get('fuzzer_server').setValue(f.server.url);
            }
        });
    },
    _subs: function () {
        eventBroker.addListener('selectedFuzzerId', this.setter, this);
    }
});