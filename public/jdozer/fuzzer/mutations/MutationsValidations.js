

Ext.define('fuzzer.mutations.MutationsValidations', {
    alternateClassName: 'MutationsValidations',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this._subs();
    },
    build: function () {
        return this._buildGrid();
    },
    _buildGrid: function () {
        this._statusCodeAndMethodGrid = new Ext.grid.Panel({
            title: 'Summary of Mutations Validations',
            store: this._buildStore(),
            border: 1,
            frame: true,
            height: 350,
            width: '300',
            columns: [
                { text: 'Request', dataIndex: 'requestIsValid', flex: 1 },
                { text: 'Status Code', dataIndex: 'statusCodeIsValid', flex: 1 },
                { text: 'Response', dataIndex: 'responsePayloadIsValid', flex: 1 }
            ]
        });
        return this._statusCodeAndMethodGrid;
    },
    _buildStore: function () {
        this._store = new Ext.data.Store({
            storeId: 'mutations-store',
            fields: [
                {
                    name: 'requestId',
                    type: 'string',
                    mapping: 'requestId'
                },
                {
                    name: 'operationId',
                    type: 'string',
                    mapping: 'operationId'
                },
                {
                    name: 'requestIsValid',
                    type: 'boolean',
                    mapping: 'requestIsValid'
                },
                {
                    name: 'statusCodeIsValid',
                    type: 'boolean',
                    mapping: 'statusCodeIsValid'
                },
                {
                    name: 'responsePayloadIsValid',
                    type: 'boolean',
                    mapping: 'responsePayloadIsValid'
                }
            ],
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
            },
            data: []
        });
        return this._store;
    },
    _setter: function (data) {
        console.log(data);
        const fId = fuzzer.Fuzzer.getId();
        const url = `/jdozer-fuzzer/bff/fuzzer/${fId}/mutations/validations/${data.operation}/${data.method}/${data.statusCode}`;
        this._store.proxy.url = url;
        this._store.reload();
    },
    _subs: function () {
        eventBroker.addListener('selectedStatusCode', this._setter, this);
    },
    requires: ['fuzzer.Fuzzer']
});