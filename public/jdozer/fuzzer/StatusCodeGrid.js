
Ext.define('fuzzer.StatusCodeGrid', {
    alternateClassName: 'StatusCodeGrid',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this.subs();
    },
    initComponent: function () {
        this._grid = new Ext.grid.Panel({
            title: 'List Status Codes',
            width: '30%',
            stateful: true,
            viewConfig: {
                stripeRows: true
            },
            columns: [{
                text: 'Operation',
                xtype: 'templatecolumn',
                tpl: `{operation}`,
                flex: 1
            }, {
                text: 'Method',
                xtype: 'templatecolumn',
                tpl: `{method}`,
                width: 90
            }, {
                text: 'Cant',
                xtype: 'templatecolumn',
                tpl: `{cant}`,
                width: 70
            }, {
                text: 'Status Code',
                xtype: 'templatecolumn',
                tpl: `{statusCode}`,
                renderer: this.statusColor
            }],
            store: this.store(),
            listeners:{
                select: function (row) {
                    this.pubSelected(row.selected.items[0].data);
                },
                scope: this
            } 
        });

        return this._grid;
    },
    store: function () {
        this._store = new Ext.data.Store({
            autoDestroy: true,
            autoLoad: false,
            fields: [{
                name: 'operation',
                type: 'string',
                mapping: 'operation'
            }, {
                name: 'method',
                type: 'string',
                mapping: 'method'
            }, {
                name: 'url',
                type: 'string',
                mapping: 'url'
            }, {
                name: 'cant',
                type: 'number',
                mapping: 'cant'
            }, {
                name: 'fuzzerId',
                type: 'string',
                mapping: 'fuzzerId'
            }, {
                name: 'statusCode',
                type: 'number',
                mapping: 'statusCode'
            }],
            proxy: {
                type: 'ajax',
                url: undefined,
                actionMethods: {
                    read: 'GET'
                },
                reader: {
                    type: 'json',
                    idProperty: undefined
                }
            }
        });

        return this._store;

    },
    pubSelected: function(rowData) {
        eventBroker.fireEvent('selectedStatusCode', rowData);
    },
    subs: function () {
        eventBroker.addListener('selectedFuzzerId', this.fuzzerSelected, this);
    },
    fuzzerSelected: function (fuzzerId) {
        this._store.proxy.url = this.getUrl(fuzzerId);
        this._store.reload();
    },
    getUrl: function (fuzzerId) {
        return `/jdozer-fuzzer/bff/fuzzer/${fuzzerId}/status_codes`;
    },
    statusColor: function (value, arg2, arg3) {
        let color = (arg3.data.statusCode > 499 ? "#1d1d4e" : (arg3.data.statusCode > 299 ? "#3f3f88" : (arg3.data.statusCode > 199 ? "#5f5fbf" : "#9a9ae0")));
        return `<span style="color:${color};">${arg3.data.statusCode}</span>`;
    }
});