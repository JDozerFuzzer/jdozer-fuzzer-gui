

Ext.define('fuzzer.FuzzerRunning', {
    alternateClassName: 'FuzzerRunning',
    constructor: function (config) {
        this.initConfig(config);
    },
    listener: function () {
        this._subs();
    },
    build: function () {
        this._buildBar();
        return this._bar;
    },
    _buildBar: function () {
        this._bar = new Ext.Window({
            //border: 0,
            //constrain: true,
            title: 'Fuzzer Running...',
            closable: true,
            layout: 'hbox',
            draggable: true,
            resizable: true,
            frame: true,
            width: 700,
            //height: 400,
            x: 1000,
            y: 30,
            //headerPosition: 'left',
            items: [this._buildStatusCodeCountGrid(), this._buildTaggingGrid()]
        });
        return this._bar;
    },
    _buildStatusCodeCountGrid: function () {
        this._statusCodeCountGrid = new Ext.grid.Panel({
            //title: 'Status Code Count',
            id: 'running-status-code-count-grid',
            height: 220,
            border: 0,
            columns: [{
                text: 'Status Code',
                dataIndex: 'statusCode',
                width: 100,
                align: 'center',
                renderer: function (value) {
                    var color;
                    if (value >= 200 && value < 300)
                        color = '#4CAF50';
                    else if (value >= 300 && value < 400)
                        color = '#FFC107';
                    else if (value >= 400 && value < 500)
                        color = '#FF9800';
                    else if (value >= 500)
                        color = '#F44336';
                    else
                        color = '#757575';
                    return `<span style="color: ${color}; font-weight: bold;">${value}</span>`;
                }
            }, {
                text: 'Count',
                dataIndex: 'count',
                width: 100,
                align: 'center',
                renderer: function (value) {
                    return `<span style="font-weight: bold;">${value}</span>`;
                }
            }, {
                text: 'Percentage',
                dataIndex: 'percentage',
                width: 100,
                align: 'center',
                renderer: function (value, meta, record) {
                    var total = 0;
                    this.store.each(function (record) {
                        total += record.get('count');
                    });

                    if (total === 0) return '0%';

                    var percentage = (record.get('count') / total * 100).toFixed(2);
                    return `<span style="color: #2196F3;">${percentage}%</span>`;
                }
            }],
            store: this._buildStatusCodeCountStore(),
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            }
        });

        return this._statusCodeCountGrid;

    },
    _buildStatusCodeCountStore: function () {
        this._statusCodeCountStore = new Ext.data.Store({
            fields: ['statusCode', 'count'],
            sorters: [{
                property: 'count',
                direction: 'DESC'
            }],
            addOrUpdateStatusCode: function (statusCode) {
                var existingRecord = this.findRecord('statusCode', statusCode);
                if (existingRecord) {
                    var currentCount = existingRecord.get('count') || 0;
                    existingRecord.set('count', currentCount + 1);
                } else {
                    this.add({
                        statusCode: statusCode,
                        count: 1
                    });
                }
                this.sort('count', 'DESC');
            }
        })

        return this._statusCodeCountStore;
    },
    _subs: function () {
        this.build();
        this._bar.show();
        eventBroker.addListener('status-code-runtime', this._responsesReceived, this);
        eventBroker.addListener('fuzzer-running-tagging', this._taggingReceived, this);
    },
    _responsesReceived: function (payload) {
        this._statusCodeCounter(payload);
    },
    _statusCodeCounter: function (data) {
        this.addStatusCode(data.statusCode);
    },
    addStatusCode: function (statusCode) {
        var statusCodeInt = parseInt(statusCode);
        if (statusCodeInt && !isNaN(statusCodeInt)) {
            this._statusCodeCountStore.addOrUpdateStatusCode(statusCodeInt);
        }
    },
    _buildTaggingStore: function () {
        this._taggingStore = new Ext.data.Store({
            fields: ['tag', 'count', 'caseId'],
            sorters: [{
                property: 'count',
                direction: 'DESC'
            }],
            addOrUpdateTag: function (tag) {
                var existingRecord = this.findRecord('tag', tag);
                if (existingRecord) {
                    var currentCount = existingRecord.get('count') || 0;
                    existingRecord.set('count', currentCount + 1);
                } else {
                    this.add({
                        tag: tag,
                        count: 1
                    });
                }
                this.sort('count', 'DESC');
            }
        })

        return this._taggingStore;
    },
    _buildTaggingGrid: function () {
        this._taggingGrid = new Ext.grid.Panel({
            //title: 'Tagging',
            id: 'running-tagging-grid',
            height: 220,
            border: 0,
            columns: [{
                text: 'Tag',
                dataIndex: 'tag',
                width: 100,
                align: 'center',
                renderer: function (value) {
                    return `<span style="font-weight: bold;">${value}</span>`;
                }
            }, {
                text: 'Count',
                dataIndex: 'count',
                width: 100,
                align: 'center',
                renderer: function (value) {
                    return `<span style="font-weight: bold;">${value}</span>`;
                }
            }, {
                text: 'Percentage',
                dataIndex: 'percentage',
                width: 100,
                align: 'center',
                renderer: function (value, meta, record) {
                    var total = 0;
                    this.store.each(function (record) {
                        total += record.get('count');
                    });

                    if (total === 0) return '0%';

                    var percentage = (record.get('count') / total * 100).toFixed(2);
                    return `<span style="color: #2196F3;">${percentage}%</span>`;
                }
            }],
            store: this._buildTaggingStore(),
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            }
        });

        return this._taggingGrid;
    },
    _taggingReceived: function (data) {
        this._addTag(data);
    },
    _addTag: function (data) {
        if (data.name) {
            this._taggingStore.addOrUpdateTag(data.name);
        }
    }
});

/**
const fuzzerRunning = new FuzzerRunning();
fuzzerRunning.build();
fuzzerRunning._bar.show();
 */