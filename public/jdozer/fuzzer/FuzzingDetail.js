
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
    _setter: function (data) {
        const form = this._window.items.getByKey('request-details').getForm();
        form.setValues({
            'fzz-operationId': data.request.operationId,
            'fzz-method': data.request.method,
            'fzz-url': data.request.url,
            'fzz-statusCode': data.response.statusCode,
            'fzz-time': data.response.timings.phases.total
        });
        this._setRequestHeaders(data);
        this._setRequestPayload(data);
        this._setRequestPathParam(data);
        this._setRequestQueryParam(data);
        this._setResponseHeaders(data);
        this._setResponsePayload(data);
        this._window.unmask();
    },
    _setResponsePayload: function (data) {
        const form = this._window.items.getByKey('request-details').getForm();
        if (data.response.payload) {
            const payload = data.response.payload;
            form.setValues({
                'fzz-response-payload': atob(payload),
                'fzz-response-payload-valid': data.response.audit.payload.isValid,
                'fzz-response-payload-errors': data.response.audit.payload.errors.map(e => e.message).join('<br />')
            });
        } else {
            form.setValues({
                'fzz-response-payload': '# No payload found'
            });
        }
    },
    _setResponseHeaders: function (data) {
        const form = this._window.items.getByKey('request-details').getForm();
        if (data.response.headers) {
            const headers = data.response.headers;
            form.setValues({
                'fzz-response-headers': JSON.stringify(headers)
            });
        } else {
            form.setValues({
                'fzz-response-headers': '# No headers found'
            });
        }
    },
    _setRequestQueryParam: function (data) {
        const form = this._window.items.getByKey('request-details').getForm();
        if (data.request.mutations.query) {
            const query = data.request.mutations.query;
            form.setValues({
                'fzz-request-query': atob(query.data),
                'fzz-request-query-valid': query.valid,
                'fzz-request-query-message': query.message,
                'fzz-request-query-property': query.property
            });
        } else {
            form.getFields().keys.filter(key => key.startsWith('fzz-request-query')).forEach(key => {
                form.findField(key).disable();
            });
        }
    },
    _setRequestPathParam: function (data) {
        const form = this._window.items.getByKey('request-details').getForm();
        if (data.request.mutations.path) {
            const path = data.request.mutations.path;
            form.setValues({
                'fzz-request-path': atob(path.data),
                'fzz-request-path-valid': path.valid,
                'fzz-request-path-message': path.message,
                'fzz-request-path-property': path.property
            });
        } else {
            form.getFields().keys.filter(key => key.startsWith('fzz-request-path')).forEach(key => {
                form.findField(key).disable();
            });
        }
    },
    _setRequestPayload: function (data) {
        const form = this._window.items.getByKey('request-details').getForm();
        if (data.request.mutations.payload) {
            const payload = data.request.mutations.payload;
            form.setValues({
                'fzz-request-payload': atob(payload.data),
                'fzz-request-payload-valid': payload.valid,
                'fzz-request-payload-message': payload.message,
                'fzz-request-payload-property': payload.property
            });
        } else {
            form.getFields().keys.filter(key => key.startsWith('fzz-request-payload')).forEach(key => {
                form.findField(key).disable();
            });
        }
    },
    _setRequestHeaders: function (data) {
        const form = this._window.items.getByKey('request-details').getForm();
        if (data.request.mutations.headers) {
            const headers = data.request.mutations.headers;
            form.setValues({
                'fzz-request-headers': headers.data,
                'fzz-request-headers-valid': headers.valid,
                'fzz-request-headers-message': headers.message,
                'fzz-request-headers-property': headers.property
            });
        } else {
            form.getFields().keys.filter(key => key.startsWith('fzz-request-headers')).forEach(key => {
                form.findField(key).disable();
            });
        }
    },
    store: function (requestId) {
        this._data = Ext.Ajax.request({
            url: this._getUrl(requestId),
            scope: this,
            success: function (response) {
                const data = JSON.parse(response.responseText);
                this._setter(data);
            },
            failure: function (resp, opts) {
                console.error(resp);
                console.error(opts);
            }
        });


        /**
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
                            idProperty: 'request.uuid'
                        }
                    },
                    fields: [{
                        name: 'requestId',
                        type: 'string',
                        mapping: 'request.uuid',
                    }, {
                        name: 'operation',
                        type: 'string',
                        mapping: 'request.operationId'
                    }, {
                        name: 'method',
                        type: 'string',
                        mapping: 'request.method'
                    }, {
                        name: 'time',
                        type: 'string',
                        mapping: 'response.timings.phases.total'
                    }, {
                        name: 'requestUrl',
                        type: 'string',
                        mapping: 'request.url'
                    }, {
                        name: 'statusCode',
                        type: 'string',
                        mapping: 'response.statusCode'
                    }, {
                        name: 'requestHeaders',
                        type: 'string',
                        mapping: 'request.headers'
                    }, {
                        name: 'requestHeadersValid',
                        type: 'string',
                        mapping: 'request.mutations.headers.valid'
                    },/** {
                        name: 'requestHeadersMessage',
                        type: 'string',
                        mapping: 'request.mutations.headers.message'
                    }, {
                        name: 'requestHeaderProperty',
                        type: 'string',
                        mapping: 'request.mutations.headers.property'
                    }, {
                        name: 'requestPayload',
                        type: 'string',
                        mapping: 'request.payload'
                    }, {
                        name: 'requestPayloadValid',
                        type: 'string',
                        mapping: 'request.mutations.payload.valid'
                    }, {
                        name: 'requestPayloadMessage',
                        type: 'string',
                        mapping: 'request.mutations.payload.message'
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
        */
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
            name: 'fzz-response-headers',
            id: 'fzz-response-headers',
            renderer: this._highlightCode,
            listeners: {
                afterrender: this._highlight,
                scope: this
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
            name: 'fzz-response-payload',
            id: 'fzz-response-payload'
        }, {
            fieldLabel: 'Response Payload Valid',
            name: 'fzz-response-payload-valid',
            id: 'fzz-response-payload-valid'
        }, {
            fieldLabel: 'Response Payload Errors',
            name: 'fzz-response-payload-errors',
            id: 'fzz-response-payload-errors'
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
            name: 'fzz-operationId',
            id: 'fzz-operationId'
        }, {
            fieldLabel: 'Method',
            name: 'fzz-method',
            id: 'fzz-method'
        }, {
            fieldLabel: 'URL',
            name: 'fzz-url',
            id: 'fzz-url'
        }, {
            fieldLabel: 'Status Code',
            name: 'fzz-statusCode',
            id: 'fzz-statusCode'
        }, {
            fieldLabel: 'Time',
            name: 'fzz-time',
            id: 'fzz-time'
        }];
    },
    _getReqHeadersItems: function () {
        return [{
            fieldLabel: 'Headers',
            name: 'fzz-request-headers',
            id: 'fzz-request-headers'
        }, {
            fieldLabel: 'Headers Valid',
            name: 'fzz-request-headers-valid',
            id: 'fzz-request-headers-valid'
        }, {
            fieldLabel: 'Headers Message',
            name: 'fzz-request-headers-message',
            id: 'fzz-request-headers-message'
        }, {
            fieldLabel: 'Headers Property',
            name: 'fzz-request-headers-property',
            id: 'fzz-request-headers-property'
        }];
    },
    _getReqPayloadItems: function () {
        return [{
            xtype: 'displayfield',
            fieldLabel: 'Payload',
            name: 'fzz-request-payload',
            id: 'fzz-request-payload',
            renderer: this._highlightCode,
            listeners: {
                change: function (element, value, oldValue, eOpts) {
                    this._highlight(element);
                },
                scope: this
            }
        }, {
            fieldLabel: 'Payload Valid',
            name: 'fzz-request-payload-valid',
            id: 'fzz-request-payload-valid'
        }, {
            fieldLabel: 'Payload Message',
            name: 'fzz-request-payload-message',
            id: 'fzz-request-payload-message'
        }, {
            fieldLabel: 'Payload Property',
            name: 'fzz-request-payload-property',
            id: 'fzz-request-payload-property'
        }];
    },
    _getReqQueryItems: function () {
        return [{
            xtype: 'displayfield',
            fieldLabel: 'Query Params',
            name: 'fzz-request-query',
            id: 'fzz-request-query',
            renderer: this._highlightCode,
            listeners: {
                change: this._highlight,
                scope: this
            }
        }, {
            fieldLabel: 'Query Params Valid',
            name: 'fzz-request-query-valid',
            id: 'fzz-request-query-valid'
        }, {
            fieldLabel: 'Query Message',
            name: 'fzz-request-query-message',
            id: 'fzz-request-query-message'
        }, {
            fieldLabel: 'Query Property',
            name: 'fzz-request-query-property',
            id: 'fzz-request-query-property'
        }]
    },
    _getReqPathItems: function () {
        return [{
            fieldLabel: 'Path',
            name: 'fzz-request-path',
            id: 'fzz-request-path',
            renderer: this._highlightCode,
            listeners: {
                change: this._highlight,
                scope: this
            }
        }, {
            fieldLabel: 'Path Valid',
            name: 'fzz-request-path-valid',
            id: 'fzz-request-path-valid'
        }, {
            fieldLabel: 'Path Message',
            name: 'fzz-request-path-message',
            id: 'fzz-request-path-message'
        }, {
            fieldLabel: 'Path Property',
            name: 'fzz-request-path-property',
            id: 'fzz-request-path-property'
        }];
    },
    _getUrl: function (requestId) {
        return `/jdozer-fuzzer/bff/fuzzer/${fuzzer.Fuzzer.getId()}/request/${requestId}/details`;
    }
});