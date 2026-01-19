

Ext.define('fuzzer.FuzzerStatus', {
    alternateClassName: 'FuzzerStatus',
    constructor: function (config) {
        this.initConfig(config);
    },
    build: function () {
        this._buildBar();
        this._subs();
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
            frame: true,
            width: 700,
            height: 100,
            x: 1000,
            y: 30,
            //headerPosition: 'left',
            defaults: {
                padding: '2 0 2 0',
                style: {
                    fontWeight: 'bold'
                }
            },
            items: [{
                xtype: 'tbtext',
                text: 'Status Code Counts:',
                id: 'fuzzer-status-code-count',
                padding: '0 0 0 0'
            }, {
                xtype: 'tbtext',
                text: '500:',
                id: 'fuzzer-status-500',
                padding: '0 0 0 0'
            }, {
                xtype: 'tbtext',
                text: '1250',
                id: 'fuzzer-status-500-count',
                padding: '0 0 0 0',
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
                padding: '0 0 0 0',
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
                padding: '0 0 0 0',
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
                padding: '0 0 0 0',
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
        eventBroker.addListener('fuzzer-engine', this._engineLoader, this);
    },
    _engineLoader: function (event) {
        this._statusCodeLoader(event.data);
    },
    _statusCodeLoader: function (data) {
        if (data.statusCode === 500)
            this._bar.getComponent('fuzzer-status-500').setText(this._5XXCount++);
        if (data.statusCode === 400)
            this._bar.getComponent('fuzzer-status-400').setText(this._4XXCount++);
        if (data.statusCode === 200)
            this._bar.getComponent('fuzzer-status-200').setText(this._2XXCount++);
        if (data.statusCode === 100)
            this._bar.getComponent('fuzzer-status-100').setText(this._1XXCount++);
    }
});
