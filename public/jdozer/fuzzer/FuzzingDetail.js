
var XXX;

Ext.define('fuzzer.FuzzingDetail', {
    alternateClassName: 'FuzzingDetail',
    constructor: function (cfg) {
        this.initConfig(cfg);
        //this.subs();
    },
    initComponent: function (requestId) {

        this._window = new Ext.Window({
            title: 'Fuzzing Details',
            width: 700,
            height: 600,
            modal: true,
            autoScroll: true,
            resizable: false,
            border: 0,
            items: [{
                xtype: 'form',
                id: 'request-details',
                items: [{
                    title: 'API Info',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        readOnly: true
                    },
                    bodyStyle: 'padding: 10px',
                    height: 185,
                    frame: false,
                    border: false,
                    defaultType: 'textfield',
                    items: this._getOperationItems()
                }, {
                    xtype: 'tabpanel',
                    activeTab: 0,
                    autoScroll: true,
                    frame: false,
                    defaults: {
                        bodyStyle: 'padding: 10px',
                        defaults: {
                            collapsible: true,
                            collapsed: true,
                            layout: 'anchor',
                            defaultType: 'textfield',
                            defaults: {
                                anchor: '100%',
                                labelWidth: 150,
                                maxWidth: 644,
                                bodyStyle: 'padding: 10px',
                                readOnly: true
                            }
                        }
                    },
                    items: [{
                        title: 'Request Data',
                        defaultType: 'fieldset',
                        items: [{
                            title: 'Headers',
                            items: this._getReqHeadersItems()
                        }, {
                            title: 'Payload',
                            items: this._getReqPayloadItems()
                        }, {
                            title: 'Query Parameters',
                            items: this._getReqQueryItems()
                        }, {
                            title: 'Path Parameters',
                            items: this._getReqPathItems()
                        }]
                    }, {
                        title: 'Response Data',
                        defaultType: 'fieldset',
                        items: [{
                            title: 'Headers',
                            items: this._getResHeadersItems()
                        }, {
                            title: 'Payload',
                            items: this._getResPayloadItems()
                        }]
                    }]
                }]
            }]
        });

        this._window.show();
        this._window.mask();
        this.store(requestId);

        return this._window;

    },

    _afterLoad: function (store, records, successful, operation, eOpts) {

        if (successful && records.length === 1) {
            this._window.items.getByKey('request-details').getForm().loadRecord(records[0]);
            this._window.unmask();
        } else {
            this._window.close();
            Ext.MessageBox.show({
                title: 'ERROR',
                msg: 'An error occurred, the selected request does not exist :(',
                buttons: Ext.MessageBox.OK,
                icon: 'error'
            });

        }
    },

    store: function (requestId) {
        this._store = new Ext.data.Store({
            autoDestroy: true,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: this._getUrl(requestId),
                actionMethods: {
                    read: 'GET'
                },
                reader: {
                    type: 'json',
                    idProperty: 'requestId'
                }
            },
            fields: [{
                name: 'requestId',
                type: 'string',
                mapping: 'req_id',
            }, {
                name: 'operation',
                type: 'string',
                mapping: 'operation'
            }, {
                name: 'method',
                type: 'string',
                mapping: 'method'
            }, {
                name: 'time',
                type: 'string',
                mapping: 'time'
            }, {
                name: 'fuzzerId',
                type: 'string',
                mapping: 'fuzzerId'
            }, {
                name: 'requestUrl',
                type: 'string',
                mapping: 'requestUrl'
            }, {
                name: 'statusCode',
                type: 'string',
                mapping: 'statusCode'
            }, {
                name: 'requestHeaders',
                type: 'string',
                mapping: 'requestHeaders'
            }, {
                name: 'requestHeadersValid',
                type: 'string',
                mapping: '// Implementation to fetch fuzzing details by request idrequestHeadersValid'
            }, {
                name: 'requestHeadersMessage',
                type: 'string',
                mapping: 'requestHeadersMessage'
            }, {
                name: 'requestHeaderProperty',
                type: 'string',
                mapping: 'requestHeadersProperty'
            }, {
                name: 'requestPayload',
                type: 'string',
                mapping: 'requestPayload'
            }, {
                name: 'requestPayloadValid',
                type: 'string',
                mapping: 'requestPayloadValid'
            }, {
                name: 'requestPayloadMessage',
                type: 'string',
                mapping: 'requestPayloadMessage'
            }, {
                name: 'requestPayloadProperty',
                type: 'string',
                mapping: '// Implementation to fetch fuzzing details by request idrequestPayloadProperty'
            }, {
                name: 'requestQuery',
                type: 'string',
                mapping: 'requestQuery'
            }, {
                name: 'requestQueryValid',
                type: 'string',
                mapping: 'requestQueryValid'
            }, {
                name: 'requestQueryMessage',
                type: 'string',
                mapping: 'requestQueryMessage'
            }, {
                name: 'requestQueryProperty',
                type: 'string',
                mapping: 'requestQueryProperty'
            }, {
                name: 'requestPath',
                type: 'string',
                mapping: 'requestPath'
            }, {
                name: 'requestPathValid',
                type: 'string',
                mapping: 'requestPathValid'
            }, {
                name: 'requestPathMessage',
                type: 'string',
                mapping: 'requestPathMessage'
            }, {
                name: 'requestPathProperty',
                type: 'string',
                mapping: 'requestPathProperty'
            }, {
                name: 'responseHeaders',
                mapping: 'responseHeaders'
            }, {
                name: 'responsePayload',
                type: 'string',
                mapping: 'responsePayload'
            }, {
                name: 'responsePayloadValid',
                type: 'string',
                mapping: 'responsePayloadValid'
            }, {
                name: 'responsePayloadErrors',
                type: 'string',
                mapping: 'responsePayloadErrors'
            }],
            listeners: {
                load: this._afterLoad,
                scope: this
            }
        });

        return this._store;
    },

    sub: function () {
        EventBroker.addListener('selectedResponse');
    },

    responseSelected: function (requestId) {
        console.debug('responseSelected', requestId);
    },

    _getResHeadersItems: function () {
        return [{
            xtype: 'displayfield',
            fieldLabel: 'Response Headers',
            name: 'responseHeaders',
            renderer: function (value) {
                console.debug(value);
            }
        }];
    },

    _getResPayloadItems: function () {
        return [{
            xtype: 'displayfield',
            fieldLabel: 'Response Payload',
            renderer: this._highlightCode,
            listeners: {
                afterrender: this._highlight,
                scope: this
            },
            name: 'responsePayload'
        }, {
            fieldLabel: 'Response Payload Valid',
            name: 'responsePayloadValid'
        }, {
            fieldLabel: 'Response Payload Errors',
            name: 'responsePayloadErrors'
        }];
    },

    _highlight: function (element) {
        const codeEl = element.getEl().query('code');
        Ext.Array.each(codeEl, (el) => {
            hljs.highlightElement(el);
        });
    },

    _highlightCode: function (value) {
        let json;
        try {
            json = JSON.stringify(JSON.parse(value), null, 2);
        } catch (e) {
            json = value;
        }
        return `<pre><code class="json">${Ext.htmlEncode(json)}</code></pre>`;
    },

    _getOperationItems: function () {
        return [{
            fieldLabel: 'Operation',
            name: 'operation',
        }, {
            fieldLabel: 'Method',
            name: 'method'
        }, {
            fieldLabel: 'URL',
            name: 'requestUrl'
        }, {
            fieldLabel: 'Status Code',
            name: 'statusCode'
        }, {
            fieldLabel: 'Time',
            name: 'time'
        }];
    },

    _getReqHeadersItems: function () {
        return [{
            fieldLabel: 'Headers',
            name: 'requestHeaders'
        }, {
            fieldLabel: 'Headers Valid',
            name: 'requestHeadersValid'
        }, {
            fieldLabel: 'Headers Message',
            name: 'requestHeadersMessage'
        }, {
            fieldLabel: 'Headers Property',
            name: 'requestHeadersProperty'
        }];
    },

    _getReqPayloadItems: function () {
        return [{
            xtype: 'displayfield',
            fieldLabel: 'Payload',
            name: 'requestPayload',
            renderer: this._highlightCode,
            listeners: {
                change: function (element, value, oldValue, eOpts) {
                    this._highlight(element);
                },
                scope: this
            }
        }, {
            fieldLabel: 'Payload Valid',
            name: 'requestPayloadValid'
        }, {
            fieldLabel: 'Payload Message',
            name: 'requestPayloadMessage'
        }, {
            fieldLabel: 'Payload Property',
            name: 'requestPayloadProperty'
        }];
    },

    _getReqQueryItems: function () {
        return [{
            xtype: 'displayfield',
            fieldLabel: 'Query Params',
            name: 'requestQuery',
            renderer: this._highlightCode,
            listeners: {
                change: this._highlight,
                scope: this
            }
        }, {
            fieldLabel: 'Query Params Valid',
            name: 'requestQueryValid'
        }, {
            fieldLabel: 'Query Message',
            name: 'requestQueryMessage'
        }, {
            fieldLabel: 'Query Property',
            name: 'requestQueryProperty'
        }]
    },

    _getReqPathItems: function () {
        return [{
            fieldLabel: 'Path',
            name: 'requestPath'
        }, {
            fieldLabel: 'Path Valid',
            name: 'requestPathValid'
        }, {
            fieldLabel: 'Path Message',
            name: 'requestPathMessage'
        }, {
            fieldLabel: 'Path Property',
            name: 'requestPathProperty'
        }];
    },

    _getUrl: function (requestId) {
        return `/bff/fuzzer/fuzzing/request/${requestId}/details`;
    }

});