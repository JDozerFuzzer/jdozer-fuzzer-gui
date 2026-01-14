
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
                text: 'Duration',
                xtype: 'templatecolumn',
                tpl: `{totalTime}ms`,
                width: 100
            }, {
                text: 'Request',
                width: 190,
                renderer: function (value, meta, record, index) {
                    if (record.data.reqIsValid) {
                        return `<span style="color: #00FF55;">Valid request sender</span>`;
                    }
                    return `<span style="color: #FF5500;">Invalid request sender</span>`;
                }
            }, {
                text: 'Response',
                width: 280,
                flex: 1,
                renderer: function (value, meta, record, index) {
                    if (record.data.payloadIsValid) {
                        return `<span style="color: #00FF55;">Valid response receiver</span>`;
                    }
                    return `<span style="color: #FF5500;">Invalid response receiver:<br />${record.data.payloadErrorMessage}</span>`;
                }
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
                name: 'id',
                type: 'string',
                mapping: 'id'
            }, {
                name: 'statusCode',
                type: 'number',
                mapping: 'statusCode'
            }, {
                name: 'method',
                type: 'string',
                mapping: 'method'
            }, {
                name: 'statusMessage',
                type: 'string',
                mapping: 'statusMessage'
            }, {
                name: 'totalTime',
                type: 'number',
                mapping: 'totalTime'
            }, {
                name: 'reqIsValid',
                type: 'boolean',
                mapping: 'reqIsValid'
            }, {
                name: 'payloadIsValid',
                type: 'boolean',
                mapping: 'payloadIsValid'
            }, {
                name: 'payloadErrorMessage',
                type: 'string',
                mapping: 'payloadErrorMessage'
            }, {
                name: 'statusCodeIsValid',
                type: 'boolean',
                mapping: 'statusCodeIsValid'
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
        (new FuzzingDetail()).initComponent(data.id);
    },
    subs: function () {
        eventBroker.addListener('selectedStatusCode', this.statusCodeSelected, this);
        eventBroker.addListener('selectedFuzzerId', () => { this._store.removeAll() }, this);
    },
    statusCodeSelected: function (data) {
        this._store.proxy.url = this._getUrl(data.fuzzerId, data.operation, data.method, data.statusCode);
        this._store.reload();
    },
    _getUrl: function (fuzzerId, operation, method, statusCode) {
        const fuzzerIdX = fuzzer.Fuzzer.getId();
        return `/jdozer-fuzzer/bff/fuzzer/${fuzzerIdX}/${operation}/${method}/responses/${statusCode}`;
    },
    requires: ['fuzzer.FuzzingDetail']
});