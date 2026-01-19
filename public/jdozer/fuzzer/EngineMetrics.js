

Ext.define('fuzzer.EngineMetrics', {
    alternateClassName: 'EngineMetrics',
    constructor: function (cfg) {
        this.initConfig(cfg);
        this._subs();
    },
    build: function () {
        this._panel = new Ext.Panel({
            title: 'Metrics',
            border: 0,
            minWidth: 1200,
            layout: 'column',
            bodyPadding: 0,
            items: [this._buildVirtualUsersOperationsGrid(), this._buildStatusCodeGrid(), this._buildPathsGrid()]
        });
        return this._panel;
    },
    _buildVirtualUsersOperationsGrid: function () {
        this._virtualUsersOperationsGrid = new Ext.grid.Panel({
            store: this._buildVirtualUsersOperationsStore(),
            stateful: false,
            collapsible: false,
            multiSelect: false,
            disableSelection: true,
            stateId: 'stateGrid',
            height: 350,
            frame: true,
            border: 0,
            columnWidth: 0.3,
            title: 'Users by Operation',
            viewConfig: {
                stripeRows: true,
                enableTextSelection: false
            },
            columns: [{
                text: 'Operation',
                flex: 1,
                sortable: true,
                dataIndex: 'name'
            }, {
                text: 'Cant',
                sortable: true,
                align: 'right',
                dataIndex: 'cant'
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                layout: 'column',
                defaults: {
                    labelAlign: 'top',
                    padding: 10,
                    columnWidth: 0.3333333333
                },
                defaultType: 'displayfield',
                items: [{
                    fieldLabel: 'Created',
                    id: 'metrics_users_created',
                    value: 0
                }, {
                    fieldLabel: 'Completed',
                    id: 'metrics_users_completed',
                    value: 0
                }, {
                    fieldLabel: 'Skipped',
                    id: 'metrics_users_skipped',
                    value: 0
                }]
            }]
        });
        return this._virtualUsersOperationsGrid;
    },
    _buildVirtualUsersOperationsStore: function () {
        this._virtualUsersOperationsStore = new Ext.data.ArrayStore({
            storeId: 'metrics-store-vusers-by-operations',
            fields: [{
                name: 'name',
                type: 'string'
            }, {
                name: 'cant',
                type: 'number'
            }],
            data: []
        });
        return this._virtualUsersOperationsStore;
    },
    _buildStatusCodeGrid: function () {
        this._statusCodeGrid = new Ext.grid.Panel({
            store: this._buildStatusCodeStore(),
            height: 350,
            //width: 200,
            title: 'Status Codes Count',
            frame: true,
            border: 0,
            columnWidth: 0.2,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: false
            },
            columns: [{
                text: 'Status Code',
                flex: 1,
                sortable: true,
                dataIndex: 'code'
            }, {
                text: 'Cant',
                flex: 1,
                sortable: true,
                dataIndex: 'cant'
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                defaults: {
                    labelWidth: 120,
                    padding: 10
                },
                defaultType: 'displayfield',
                items: [{
                    labelAlign: 'top',
                    fieldLabel: 'Total Responses',
                    width: 200,
                    id: 'metrics_status_code_reponses',
                    value: 0
                }]
            }]
        });
        globalThis._statusCodeGrid = this._statusCodeGrid;
        return this._statusCodeGrid;
    },
    _buildStatusCodeStore: function () {
        this._statusCodeStore = new Ext.data.ArrayStore({
            storeId: 'metrics-store-status-code',
            fields: [{
                name: 'code',
                type: 'number'
            }, {
                name: 'cant',
                type: 'number'
            }],
            data: []
        });
        return this._statusCodeStore;
    },
    _buildPathsGrid: function () {
        this._pathsGrid = new Ext.grid.Panel({
            height: 350,
            //width: '100%',
            //minWidth: 600,
            title: 'Status Code by Endpoints',
            frame: true,
            border: 0,
            columnWidth: 0.5,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: false
            },
            columns: [{
                text: 'Path',
                flex: 1,
                sortable: true,
                dataIndex: 'endpoint'
            }, {
                text: 'Code',
                sortable: true,
                align: 'right',
                dataIndex: 'code'
            }, {
                text: 'Cant',
                sortable: true,
                align: 'right',
                dataIndex: 'cant'
            }],
            store: this._buildPathsStore()
        });
        return this._pathsGrid;
    },
    _buildPathsStore: function () {
        this._pathsStore = new Ext.data.ArrayStore({
            storeId: 'metrics-store-paths',
            fields: [{
                name: 'endpoint',
                type: 'string'
            }, {
                name: 'code',
                type: 'number'
            }, {
                name: 'cant',
                type: 'number'
            }],
            data: []
        });
        return this._pathsStore;
    },
    _setter: function (fuzzerId) {
        Ext.Ajax.request({
            url: `/jdozer-fuzzer/bff/fuzzer/${fuzzerId}/engine-metrics`,
            scope: this,
            success: function (response) {
                const m = JSON.parse(response.responseText);

                this._virtualUsersOperationsGrid.down('#metrics_users_created').setValue(m.vusers.created);
                this._virtualUsersOperationsGrid.down('#metrics_users_completed').setValue(m.vusers.completed);
                this._virtualUsersOperationsGrid.down('#metrics_users_skipped').setValue(m.vusers.skipped);
                this._virtualUsersOperationsStore.add(m.vusers.byOperations);

                this._statusCodeGrid.down('#metrics_status_code_reponses').setValue(m.http.responses);
                this._statusCodeStore.add(m.http.codes);

                this._pathsStore.add(m.endpoints);

                return;
            }
        });
    },
    _subs: function () {
        eventBroker.addListener('selectedFuzzerId', this._setter, this);
    },
});