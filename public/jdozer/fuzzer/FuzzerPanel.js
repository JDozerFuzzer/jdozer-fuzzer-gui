

Ext.define(`fuzzer.FuzzerPanel`, {
    alternateClassName: 'FuzzerPanel',
    build: function () {
        this.fuzzerPanel = new Ext.Panel({
            layout: 'anchor',
            title: 'Fuzzers',
            border: 0,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    (new FuzzerSelect()).initComponent(),
                    '-',
                    (new FuzzerForm()).formButton()
                ]
            }, {
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['All rights reserved JDozer - Powered by Cristían Sáez V.']
            }],
            items: [{
                //height: '100%',
                defaults: {
                    defaults: {
                        //anchor: '100%'
                    }
                },
                items: [new FuzzerDetails().build(), new EngineMetrics().build()]
            }, {
                layout: {
                    type: 'column'
                },
                height: '100%',
                defaults: {
                    //layout: 'anchor',
                    columnWidth: 1 / 2,
                    defaults: {
                        anchor: '100%'
                    },
                    height: 600
                },
                border: 0,
                items: [
                    (new StatusCodeGrid()).initComponent(),
                    (new ResponseGrid()).initComponent()
                ]
            }]
        });

        return this.fuzzerPanel;
    },
    requires: [
        'fuzzer.FuzzerSelect',
        'fuzzer.StatusCodeGrid',
        'fuzzer.ResponseGrid',
        'fuzzer.FuzzerForm',
        'fuzzer.FuzzerDetails',
        'fuzzer.EngineMetrics'
    ]
});