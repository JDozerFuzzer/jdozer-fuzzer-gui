
Ext.define('fuzzer.FuzzerForm', {
    alternateClassName: 'FuzzerForm',
    formButton: function () {
        this._formButton = new Ext.Button({
            text: 'New Fuzzer',
            handler: () => {
                this.initComponent();
            },
            scope: this
        });

        return this._formButton;
    },
    _formContainer: function () {
        this._form = new Ext.FormPanel({
            title: 'Create Fuzzing Testing',
            frame: false,
            bodyPadding: '10 10 0',
            fileUpload: true,
            defaults: {
                anchor: '100%',
                msgTarget: 'side',
                labelWidth: 70,
                allowBlank: false
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Name',
                name: 'name'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Version',
                name: 'version'
            }, {
                xtype: 'filefield',
                name: 'contract',
                emptyText: 'select contract',
                fieldLabel: 'Contract',
                buttonText: 'Examine'
            }
                /**
                {
                    xtype: 'hiddenfield',
                    name: 'owner',
                    value: globalThis.CURRENT_USER_TMP
    
                }
                */
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        this._window.close();
                    },
                    scope: this
                }, {
                    text: 'Create',
                    disabled: true,
                    formBind: true,
                    handler: function () {

                        var form = this._form.getForm();
                        if (form.isValid()) {
                            let xForm = this._formData(form);
                            Ext.Ajax.request({
                                url: 'jdozer-fuzzer/bff/fuzzer',
                                rawData: xForm,
                                method: 'POST',
                                headers: { 'Content-Type': null },
                                success: function (res) {
                                    if (res.status === 202) {
                                        this._window.close();
                                        Ext.Msg.alert('Success', 'Fuzzer created successfully');
                                    } else {
                                        console.warn('Unexpected status code', res.status);
                                        this._window.close();
                                    }
                                },
                                failure: function (res) {
                                    let resPayload = Ext.decode(res.responseText);
                                    Ext.MessageBox.show({
                                        title: 'Send error',
                                        msg: `${resPayload.message.join('<br />')}`,
                                        buttons: Ext.MessageBox.OK,
                                        icon: 'x-message-box-error'
                                    });
                                },
                                scope: this
                            });
                        }
                    },
                    scope: this
                }]
        });

        return this._form;
    },

    _formData: function (form) {
        var formData = new FormData();
        var fields = form.getFields().items;

        Ext.each(fields, (field) => {
            console.debug(field.getName());
            if (field.getName()) {
                if (field.xtype === 'filefield') {
                    let file = field.fileInputEl.dom.files[0];
                    if (file) {
                        formData.append(field.getName(), file);
                    }
                } else {
                    console.debug(field.getValue());
                    formData.append(field.getName(), field.getValue());
                }
            }
        });
        XXX = formData;
        return formData;
    },

    initComponent: function () {
        this._window = new Ext.Window({
            title: 'New Fuzzer',
            //width: 500,
            //height: 500,
            modal: true,
            autoScroll: false,
            resizable: false,
            border: 0,
            items: [this._formContainer()]
        });

        this._window.show();
    },

});
