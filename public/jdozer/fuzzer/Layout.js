

Ext.define(`fuzzer.Layout`, {
    alternateClassName: `Layout`,
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    build: function () {
        this.layoutPanel = new Ext.Panel({
            layout: {
                type: 'anchor'
            },
            //height: '100%',
            border: 0,
            bodyStyle: {
                background: '#292929'
            },
            title: 'Aggressive Fuzzing Platform for HTTP APIs',
            items: [
                new Ext.Img({
                    src: 'img/JDozerFuzzer2.png',
                    width: 500,
                    padding: '30'
                }),
                (new FuzzerPanel()).build()
            ],
            renderTo: Ext.getBody()
        });

        const ws = new WebSocketClient();

        return this;
    },
    requires: ['fuzzer.FuzzerPanel', 'fuzzer.socket.WebSocketClient', 'fuzzer.Fuzzer']
});