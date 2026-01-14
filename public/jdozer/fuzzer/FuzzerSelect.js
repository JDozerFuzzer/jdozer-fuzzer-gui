
Ext.define('fuzzer.FuzzerSelect', {
    alternateClassName: 'FuzzerSelect',
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    initComponent: function () {
        this._combobox = new Ext.form.ComboBox({
            fieldLabel: 'Select Fuzzer',
            id: 'fuzzer-selector',
            store: this.store(),
            displayField: 'displayName',
            valueField: 'id',
            listeners: {
                select: {
                    scopre: this,
                    fn: (cmb, row) => {
                        this.pubSelected(row[0].data.fuzzerId);
                    }
                }
            }
        });
        return this._combobox;
    },
    store: function () {
        this._store = new Ext.data.Store({
            autoDestroy: true,
            autoLoad: false,
            fields: [{
                name: 'fuzzerId',
                type: 'string',
                mapping: 'id'
            }, {
                name: 'name',
                type: 'string',
                mapping: 'name'
            }, {
                name: 'version',
                type: 'string',
                mapping: 'version'
            }, {
                name: 'displayName',
                type: 'string',
                convert: function (v, rec) {
                    return rec.get('name') + ' - v' + rec.get('version');
                }
            }],
            proxy: {
                type: 'ajax',
                url: `/jdozer-fuzzer/bff/fuzzers`,
                actionMethods: {
                    read: 'GET'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                reader: {
                    type: 'json',
                    idProperty: 'id'
                }
            }
        });

        return this._store;
    },
    pubSelected: function (fuzzerId) {
        eventBroker.fireEvent('selectedFuzzerId', fuzzerId);
    }
});