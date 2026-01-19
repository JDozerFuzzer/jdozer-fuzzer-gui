

Ext.define(`fuzzer.Layout`, {
    alternateClassName: `Layout`,
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    build: function () {
        this.layoutPanel = new Ext.Panel({
            layout: 'anchor',
            title: 'Aggressive Fuzzing Platform for HTTP API',
            bodyStyle: {
                background: '#292929'
            },
            height: 130,
            padding: '0 0 0 0',
            items: [new Ext.Img({
                src: 'img/JDozerFuzzer2.png',
                width: 500,
                padding: '20 20 20 20'
            })],
            renderTo: Ext.getBody()
        });
        (new FuzzerPanel()).build().render(Ext.getBody());
        const ws = new WebSocketClient();
        return this;
    },
    requires: [
        'fuzzer.FuzzerPanel',
        'fuzzer.socket.WebSocketClient',
        'fuzzer.Fuzzer'
    ]
});