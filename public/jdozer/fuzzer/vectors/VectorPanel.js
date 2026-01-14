

Ext.define('fuzzer.vectors.VectorPanel', {
    alternateClassName: 'VectorPanel',
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    build: function () {
        this._panel = new Ext.Panel({
            title: 'Vectors',
            border: 0,
            width: '100%',
            items: [new MutationsValidations().build()] // new VectorsSummary().build(), new VectorsStatusCode().build(),
        });
        return this._panel;
    },
    requires: [
        'fuzzer.vectors.VectorsSummary',
        'fuzzer.vectors.VectorsStatusCode',
        'fuzzer.mutations.MutationsValidations'
    ]
});