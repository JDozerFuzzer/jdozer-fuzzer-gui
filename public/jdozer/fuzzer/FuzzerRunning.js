

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
            border: 0,
            //constrain: true,
            title: 'Fuzzer Running...',
            closable: false,
            layout: 'hbox',
            draggable: false,
            resizable: false,
            frame: false,
            width: 700,
            height: 100,
            x: 1000,
            y: 30,
            //headerPosition: 'left',
            defaults: {
                padding: '2 10 2 0',
                style: {
                    fontWeight: 'bold'
                }
            },
            items: [{
                xtype: 'tbtext',
                text: 'Status Code Counts:',
                id: 'fuzzer-status-code-count'
            }, {
                xtype: 'tbtext',
                text: '500:',
                id: 'fuzzer-status-500'
            }, {
                xtype: 'tbtext',
                text: '1250',
                id: 'fuzzer-status-500-count',
                padding: '2 0 2 0',
                style: {
                    fontWeight: 'italic'
                }
            }, {
                xtype: 'tbtext',
                text: '400:',
                id: 'fuzzer-status-400'
            }, {
                xtype: 'tbtext',
                text: '1250',
                id: 'fuzzer-status-400-count',
                padding: '2 0 2 0',
                style: {
                    fontWeight: 'italic'
                }
            }, {
                xtype: 'tbtext',
                text: '200:',
                id: 'fuzzer-status-200'
            }, {
                xtype: 'tbtext',
                text: '1250',
                id: 'fuzzer-status-200-count',
                padding: '2 0 2 0',
                style: {
                    fontWeight: 'italic'
                }
            }, {
                xtype: 'tbtext',
                text: '100:',
                id: 'fuzzer-status-100'
            }, {
                xtype: 'tbtext',
                text: '1250',
                id: 'fuzzer-status-100-count',
                padding: '2 0 2 0',
                style: {
                    fontWeight: 'italic'
                }
            }]
        });
        return this._bar;
    },
    _5XXCount: 0,
    _4XXCount: 0,
    _2XXCount: 0,
    _1XXCount: 0,
    _subs: function () {
        this.build();
        this._bar.show();
        eventBroker.addListener('fuzzer-engine-response-received', this._responsesReceived, this);
    },
    _responsesReceived: function (payload) {
        this._statusCodeCounter(payload);
    },
    _statusCodeCounter: function (data) {
        if (data.statusCode === 500)
            this._bar.getComponent('fuzzer-status-500-count').setText(this._5XXCount++);
        if (data.statusCode === 400)
            this._bar.getComponent('fuzzer-status-400-count').setText(this._4XXCount++);
        if (data.statusCode === 200)
            this._bar.getComponent('fuzzer-status-200-count').setText(this._2XXCount++);
        if (data.statusCode === 100)
            this._bar.getComponent('fuzzer-status-100-count').setText(this._1XXCount++);
    }
});

/**
const fuzzerRunning = new FuzzerRunning();
fuzzerRunning.build();
fuzzerRunning._bar.show();
 */