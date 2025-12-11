
Ext.define('fuzzer.ResponseGrid', {
    alternateClassName: 'ResponseGrid',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this.subs();
    },
    initComponent: function () {
        this._grid = new Ext.grid.Panel({
            title: 'Responses List',
            width: '50%',
            statefull: true,
            viewConfig: {
                stripeRows: true
            },
            columns: [{
                text: 'Response',
                xtype: 'templatecolumn',
                tpl: `{payload}`,
                flex: 1
            }, {
                text: 'Response Error',
                xtype: 'templatecolumn',
                tpl: `{payloadErrors}`,
                width: 240
            }, {
                text: 'Response Valid',
                xtype: 'templatecolumn',
                tpl: `{payloadValid}`,
                renderer: function (value, meta, record, index) {
                    console.debug(value, meta);
                    console.debug(record, index);
                    if (record.data.payloadValid) {
                        this.items
                    }
                    return record.data.payloadValid;
                }
            }, {
                text: 'Time',
                xtype: 'templatecolumn',
                tpl: '{time}',
                width: 170
            }],
            store: this.store(),
            listeners: {
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
                name: 'payload',
                type: 'string',
                mapping: 'payload'
            }, {
                name: 'time',
                type: 'string',
                mapping: 'time'
            }, {
                name: 'fuzzingId',
                type: 'string',
                mapping: 'fuzzingId'
            }, {
                name: 'requestId',
                type: 'string',
                mapping: 'requestId'
            }, {
                name: 'statusCode',
                type: 'number',
                mapping: 'statusCode'
            }, {
                name: 'payloadValid',
                type: 'boolean',
                mapping: 'payloadValid'
            }, {
                name: 'payloadErrors',
                type: 'string',
                mapping: 'payloadErrors'
            }],
            proxy: {
                type: 'ajax',
                url: undefined,
                actionMethods: {
                    read: 'GET'
                },
                reader: {
                    type: 'json',
                    idProperty: 'requestId'
                }
            }
        });

        return this._store;
    },
    pubSelected: function (data) {
        eventBroker.fireEvent('selectedResponse', data);
        (new FuzzingDetail()).initComponent(data.requestId);
    },
    subs: function () {
        eventBroker.addListener('selectedStatusCode', this.statusCodeSelected, this);
        eventBroker.addListener('selectedFuzzerId', () => { this._store.removeAll() }, this);
    },
    statusCodeSelected: function (data) {
        this._store.proxy.url = this._getUrl(data.fuzzerId, data.operation, data.statusCode);
        this._store.reload();
    },
    _getUrl: function (fuzzerId, operation, statusCode) {
        return `/bff/fuzzer/${fuzzerId}/${operation}/${statusCode}`;
    },
    requires: ['fuzzer.FuzzingDetail']
});