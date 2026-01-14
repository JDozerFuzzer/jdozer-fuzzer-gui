

Ext.define('fuzzer.vectors.VectorsSummary', {
    alternateClassName: 'VectorsSummary',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this._subs();
    },
    build: function () {
        return this._buildGrid();
    },
    _buildGrid: function () {
        this._grid = new Ext.grid.Panel({
            title: 'Summary of Vectors by Operation',
            store: this._buildStore(),
            frame: true,
            height: 350,
            columns: [
                { text: 'Operation ID', dataIndex: 'operationId', flex: 1 },
                { text: 'Description', dataIndex: 'description', flex: 1 },
                { text: 'OWASP Category', dataIndex: 'owaspCategory', flex: 1 },
                { text: 'Subcategory', dataIndex: 'subcategory', flex: 1 },
                { text: 'Context', dataIndex: 'context', flex: 1 },
                { text: 'Tags', dataIndex: 'tags', flex: 1 },
                { text: 'Technique', dataIndex: 'technique', flex: 1 },
                { text: 'Browser Specific', dataIndex: 'browserSpecific', flex: 1 }
            ],
            features: [this._buildGrouping()]
        });
        return this._grid;
    },
    _buildStore: function () {
        this._store = Ext.create('Ext.data.Store', {
            storeId: 'vectors-summary-store',
            groupField: 'operationId',
            fields: [
                { name: 'operationId', type: 'string' },
                { name: 'id', type: 'number' },
                { name: 'description', type: 'string' },
                { name: 'owaspCategory', type: 'string' },
                { name: 'subcategory', type: 'string' },
                { name: 'context', type: 'string' },
                { name: 'tags', type: 'string' },
                { name: 'technique', type: 'string' },
                { name: 'browserSpecific', type: 'string' }
            ],
            data: []
        });
        return this._store;
    },
    _buildGrouping: function () {
        this._grouping = new Ext.grid.feature.Grouping({
            groupHeaderTpl: '{name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
            hideGroupedHeader: true,
            startCollapsed: true,
            id: 'vectors-grouping'
        });
        return this._grouping;
    },
    _subs: function () {
        eventBroker.addListener('selectedFuzzerId', this._setter, this);
    },
    _setter: function (fuzzerId) {
        this.data = Ext.Ajax.request({
            url: `/jdozer-fuzzer/bff/fuzzer/${fuzzerId}/vectors/summary`,
            scope: this,
            success: function (response) {
                const v = JSON.parse(response.responseText);
                this._store.add(v);
            }
        });
    }
});