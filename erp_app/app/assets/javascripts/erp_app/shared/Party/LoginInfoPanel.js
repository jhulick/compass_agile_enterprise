Ext.define("CompassAE.ErpApp.Shared.Party.LoginInfoPanel", {
    extend: 'Ext.form.Panel',
    alias: 'widget.partylogininfopanel',

    layout: 'hbox',
    title: 'Login Info',

    userId: null,
    loginPath: null,
    websiteId: null,
    partyId: null,
    user: null,
    autoScroll: true,
    fieldSetHeights: 250,

    dockedItems: {
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: function(btn) {
                btn.up('form').save(btn);
            }
        }]
    },

    initComponent: function() {
        var me = this;

        me.addEvents(
            /*
             * @event userinformationloaded
             * Fires when user information is loaded
             * @param {CompassAE.ErpApp.Shared.Party.LoginInfoPanel} this panel
             * @param {Object} User information
             */
            'userinformationloaded'
        );

        me.on('afterrender', function() {
            if (me.user) {
                me.setFields();
            } else if (me.userId) {
                me.load();
            } else {
                me.setupForNewUser();
            }
        });

        me.on('activate', function() {
            if (me.user) {
                me.setFields();
            } else if (me.userId) {
                me.load();
            } else {
                me.setupForNewUser();
            }
        });

        me.items = [{
            xtype: 'fieldset',
            height: me.fieldSetHeights,
            width: 450,
            bodyPadding: '5px',
            style: {
                marginLeft: '10px',
                marginRight: '10px',
                padding: '5px'
            },
            defaults: {
                width: 400
            },
            itemId: 'loginInfoFieldSet',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Username',
                name: 'username',
                allowBlank: false,
                itemId: 'username'
            }, {
                xtype: 'textfield',
                vtype: 'email',
                fieldLabel: 'Email',
                allowBlank: false,
                name: 'email',
                itemId: 'email'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Password',
                itemId: 'password',
                name: 'password',
                inputType: 'password'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Password Confirmation',
                itemId: 'passwordConfirmation',
                name: 'password_confirmation',
                inputType: 'password'
            }]
        }, {
            xtype: 'fieldset',
            height: me.fieldSetHeights,
            width: 450,
            style: {
                marginLeft: '10px',
                marginRight: '10px',
                padding: '5px'
            },
            defaults: {
                width: 400
            },
            itemId: 'activityFieldSet',
            items: [{
                xtype: 'displayfield',
                fieldLabel: 'Last Login',
                itemId: 'lastLogin'
            }, {
                xtype: 'displayfield',
                fieldLabel: 'Last Logout',
                itemId: 'lastLogout'
            }, {
                xtype: 'displayfield',
                fieldLabel: 'Last Activity',
                itemId: 'lastActivity'
            }, {
                xtype: 'displayfield',
                fieldLabel: '# Failed Logins',
                itemId: 'faildLogins'
            }]
        }];

        me.callParent(arguments);
    },

    setupForNewUser: function() {
        var me = this;

        me.down('#password').allowBlank = false;
        me.down('#passwordConfirmation').allowBlank = false;
        if (!me.down('#autoActivate')) {
            me.down('#loginInfoFieldSet').add({
                xtype: 'radiogroup',
                fieldLabel: 'Auto Activate?',
                labelWrap: true,
                itemId: 'autoActivate',
                columns: [75, 75],
                items: [{
                    boxLabel: 'Yes',
                    name: 'auto_activate',
                    inputValue: 'yes',
                    checked: true
                }, {
                    boxLabel: 'No',
                    name: 'auto_activate',
                    inputValue: 'no'
                }]
            });
        }
    },

    save: function(btn) {
        var me = this;

        if (me.isValid()) {
            btn.disable();

            var mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: me
            });
            mask.show();

            Compass.ErpApp.Utility.ajaxRequest({
                url: (me.user ? ('/api/v1/users/' + me.userId) : '/api/v1/users'),
                method: (me.user ? 'PUT' : 'POST'),
                params: Ext.apply({
                    login_url: me.loginPath,
                    party_id: me.partyId,
                    website_id: me.websiteId
                }, me.getValues()),
                errorMessage: 'Could not save Login Info',
                success: function(response) {
                    me.user = response.user;
                    me.setFields();
                    btn.enable();
                    mask.hide();

                    me.fireEvent('userinformationloaded', me, me.user);
                },
                failure: function() {
                    btn.enable();
                    mask.hide();
                }
            });
        }
    },

    load: function() {
        var me = this;

        var mask = new Ext.LoadMask({
            msg: 'Please wait...',
            target: me
        });
        mask.show();

        Compass.ErpApp.Utility.ajaxRequest({
            url: '/api/v1/users/' + me.userId,
            method: 'GET',
            errorMessage: 'Could not load Login Info',
            success: function(response) {
                if (response.user) {
                    me.user = response.user;
                    me.setFields();
                }

                me.fireEvent('userinformationloaded', me, me.user);

                mask.hide();
            },
            failure: function() {
                mask.hide();
            }
        });
    },

    setFields: function(user) {
        var me = this;

        me.down('#username').setValue(me.user.username);
        me.down('#email').setValue(me.user.email);
        me.down('#password').reset();
        me.down('#passwordConfirmation').reset();
        me.down('#faildLogins').setValue((me.user.failed_login_count || 0));

        if (me.down('#autoActivate')) {
            me.down('#autoActivate').destroy();
        }

        // add Status
        if (!me.down('#status')) {
            me.down('#loginInfoFieldSet').insert(0, {
                xtype: 'radiogroup',
                fieldLabel: 'Status',
                labelWrap: true,
                itemId: 'status',
                columns: 3,
                items: [{
                    boxLabel: 'Active',
                    name: 'status',
                    inputValue: 'active',
                    checked: (me.user.activation_state == 'active')
                }, {
                    boxLabel: 'Pending',
                    name: 'status',
                    inputValue: 'pending',
                    checked: (me.user.activation_state == 'pending')
                }, {
                    boxLabel: 'Inactive',
                    name: 'status',
                    inputValue: 'inactive',
                    checked: (me.user.activation_state == 'inactive')
                }]
            });
        }

        if (me.user.last_login_at) {
            me.down('#lastLogin').setValue(Ext.util.Format.date(me.user.last_login_at, 'F j, Y, g:i a'));
        } else {
            me.down('#lastLogin').setValue('Has not logged in');
        }

        if (me.user.last_login_at) {
            me.down('#lastLogin').setValue(Ext.util.Format.date(me.user.last_login_at, 'F j, Y, g:i a'));
        } else {
            me.down('#lastLogin').setValue('Has not logged in');
        }

        if (me.user.last_logout_at) {
            me.down('#lastLogout').setValue(Ext.util.Format.date(me.user.last_logout_at, 'F j, Y, g:i a'));
        } else {
            me.down('#lastLogout').setValue('Has not logged out');
        }

        if (me.user.last_activity_at) {
            me.down('#lastActivity').setValue(Ext.util.Format.date(me.user.last_activity_at, 'F j, Y, g:i a'));
        } else {
            me.down('#lastActivity').setValue('Has not had activity');
        }
    }
});