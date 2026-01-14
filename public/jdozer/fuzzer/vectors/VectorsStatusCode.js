

Ext.define('fuzzer.vectors.VectorsStatusCode', {
    alternateClassName: 'VectorsStatusCode',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this._subs();
    },
    build: function () {
        return this._buildGrid();
    },
    _buildGrid: function () {
        this._grid = new Ext.grid.Panel({
            title: 'Summary of Vectors by Status Code',
            store: this._buildStore(),
            border: 1,
            frame: true,
            height: 350,
            columns: [
                { text: 'Operation ID', dataIndex: 'operationId', flex: 1 },
                { text: 'Status Code', dataIndex: 'statusCode', flex: 1 },
                { text: 'Count', dataIndex: 'count', flex: 1 },
                { text: 'Subcategory', dataIndex: 'subcategory', flex: 1 },
                { text: 'Context', dataIndex: 'context', flex: 1 },
                { text: 'Tags', dataIndex: 'tags', flex: 1 },
                { text: 'Technique', dataIndex: 'technique', flex: 1 }
            ]
        });
        return this._grid;
    },
    _buildStore: function () {
        this._store = Ext.create('Ext.data.Store', {
            storeId: 'vectors-status-code-store',
            groupField: 'operationId',
            fields: [
                { name: 'operationId', type: 'string' },
                { name: 'id', type: 'number' },
                { name: 'description', type: 'string' },
                { name: 'subcategory', type: 'string' },
                { name: 'context', type: 'string' },
                { name: 'tags', type: 'string' },
                { name: 'technique', type: 'string' },
                { name: 'count', type: 'number' },
                { name: 'statusCode', type: 'string' },
                { name: 'requests', type: 'array' }
            ],
            data: []
        });
        return this._store;
    },
    _subs: function () {
        eventBroker.addListener('selectedFuzzerId', this._setter, this);
    },
    _setter: function (fuzzerId) {
        this.data = Ext.Ajax.request({
            url: `/jdozer-fuzzer/bff/fuzzer/${fuzzerId}/vectors/status_codes`,
            scope: this,
            success: function (response) {
                const vs = JSON.parse(response.responseText);
                let rows = [];
                for (const v of vs) {
                    rows = rows.concat(Object.keys(v.statusCodes).map(stsCode => {
                        return {
                            operationId: v.operationId,
                            id: v.id,
                            description: v.description,
                            owaspCategory: v.owaspCategory,
                            subcategory: v.subcategory,
                            context: v.context,
                            tags: v.tags,
                            technique: v.technique,
                            browserSpecific: v.browserSpecific,
                            statusCode: stsCode,
                            count: v.statusCodes[stsCode].count,
                            requests: v.statusCodes[stsCode].requests
                        };
                    }));
                }
                this._store.add(rows);
            }
        });
    }
});