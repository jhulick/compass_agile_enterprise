Ext.ns("Compass.ErpApp.Organizer.Applications");

Compass.ErpApp.Organizer.Layout = function (config) {

    this.layoutConfig = config;

    //used to build accordion menu
    var accordionMenuItems = [];
    var menu = Ext.create('Ext.menu.Menu', {

        items: [
            {
                text: 'Preferences',
                iconCls: 'icon-gear',
                handler: function () {
                    var win = Ext.create("Compass.ErpApp.Organizer.PreferencesWindow", {iconCls: 'icon-gear'});
                    win.show();
                    win.setup();
                }
            },
            {
                text: 'Profile',
                iconCls: 'icon-user',
                handler: function () {
                    var win = Ext.create("Ext.window.Window", {
                        title: 'Profile',
                        iconCls: 'icon-user',
                        items: [
                            {xtype: 'shared_profilemanagementpanel', title: ''}
                        ]
                    });
                    win.show();
                }
            }
        ]
    });

    this.toolBar = Ext.create("Ext.toolbar.Toolbar", {
        ui: 'cleantoolbar-dark',
        dock: 'top',
        height: 50,
        style: {
            paddingLeft: '22px',
            paddingRight: '15px'
        },
        items: [
            {
                ui: 'cleanbutton',
                text: 'Menu',
                iconCls: 'icon-info',
                menu: menu
            },
            ' ',
            {
                xtype: 'label',
                style: 'color:white;',
                text: 'Welcome',
                itemId: 'organizerWelcomeMsg'
            }
        ]
    });

    this.addToToolBar = function (item) {
        this.toolBar.add(item);
    };

    this.setupLogoutButton = function () {
        this.toolBar.add("->");
        this.toolBar.add({
            ui: 'cleanbutton',
            text: 'Logout',
            xtype: 'button',
            iconCls: "icon-exit",
            defaultAlign: "right",
            'listeners': {
                scope: this,
                'click': function () {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to logout?', function (btn) {
                        if (btn == 'no') {
                            return false;
                        }
                        else if (btn == 'yes') {
                            var defaultLogoutUrl = '/session/sign_out';
                            if (Compass.ErpApp.Utility.isBlank(this.layoutConfig) || Compass.ErpApp.Utility.isBlank(this.layoutConfig["logout_url"])) {
                                window.location = defaultLogoutUrl;
                            }
                            else {
                                window.location = this.layoutConfig["logout_url"];
                            }
                        }
                    });
                }
            }
        });
    };

    this.centerPanel = Ext.create("Ext.Panel", {
        cls: 'masterPanel',

        id: 'erp_app_viewport_center',
        style: {
            marginRight: '20px',
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px'
        },
        region: 'center',
        layout: 'card',
        activeItem: 0,
        items: []
    });

    this.bottomBar = Ext.create("Ext.toolbar.Toolbar", {
        ui: 'cleantoolbar-dark',
        dock: 'bottom',
        height: 50,
        style: {
            paddingLeft: '22px',
            paddingRight: '15px'
        },
        items: [
            "->",
            {
                ui: 'cleanbutton',
                xtype: "trayclock"
            }
        ]
    });

    this.addApplication = function (config) {
        var menuItems = [],
            cardHolderId = 'cardHolder' + '_' + config.id;

        Ext.each(config.menuItems, function (menuItem) {
            menuItems.push({
                    xtype: 'image',
                    style: {
                        cursor: 'pointer'
                    },
                    filtersPanelId: 'customerFilters',
                    src: menuItem.imgSrc,
                    height: 50,
                    width: 50,
                    cls: 'shortcut-image-button',
                    listeners: {
                        render: function (component) {
                            component.getEl().on('click', function (e) {
                                var cardHolder = Ext.getCmp(cardHolderId);

                                if (menuItem.filterPanel) {
                                    var filterPanel = cardHolder.down('#filterPanel' + "_" + menuItem.tabItemId);

                                    cardHolder.getLayout().setActiveItem(filterPanel, {transitionType: 'crossFade'});
                                }

                                var masterPanel = Ext.getCmp(config.id),
                                    tab = masterPanel.down('#' + menuItem.tabItemId);

                                masterPanel.setActiveTab(tab);

                            }, component);
                        }
                    }
                },
                {
                    html: menuItem.title,
                    style: {
                        cursor: 'pointer'
                    }
                });

            if (menuItem.filterPanel) {
                menuItems.push({
                    xtype: 'panel',
                    hidden: true,
                    itemId: 'filterPanel' + "_" + menuItem.tabItemId,
                    frame: false,
                    header:false,
                    bodyPadding: '5px',
                    style: {
                        borderRadius: '5px'
                    },
                    dockedItems: [
                        {
                            xtype: 'toolbar',

                            dock: 'top',
                            items: [
                                {
                                    ui: '',
                                    text: '<',
                                    handler: function (btn) {
                                        var cardHolder = Ext.getCmp(cardHolderId),
                                            menuPanel = cardHolder.down('#menuItems');

                                        cardHolder.getLayout().setActiveItem(menuPanel, {transitionType: 'crossFade'});
                                    }
                                }
                            ]
                        }
                    ],
                    items: menuItem.filterPanel
                });
            }
        });

        var menuPanel = {
            xtype: 'panel',
            title: config.title,
            layout: 'transitioncard',
            id: cardHolderId,
            listeners: {
                render: function (c) {
                    /*
                     *  We want a listener on each DOM element within this menu to ensure the center panel is set
                     *  properly when they are clicked. This is because this custom panel does not use the default
                     *  menu tree panel type, and hence does not inherit the switching behavior automatically.
                     */
                    c.items.each(function (item) {
                        // Wait until each item is rendered to add the click listener, as the panel usually renders before the items within the panel
                        item.on('render', function () {
                            this.getEl().on('click', function () {
                                Compass.ErpApp.Organizer.Layout.setActiveCenterItem(config.id);
                            });
                        });
                    });
                }
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'menuItems',
                    layout: {
                        type: "vbox",
                        align: "center"
                    },
                    items: menuItems
                }
            ]
        };

        accordionMenuItems.push(menuPanel);

        //Create the main tab panel which will house instances of the main Task Types
        var masterPanel = Ext.create('Ext.tab.Panel', {
            id: config.id,
            itemId: config.id,
            //These tasks we always want open
            items: config.tabs
        });

        this.centerPanel.add(masterPanel);

        masterPanel.addListener('tabchange', function (tabPanel, newCard, oldCard, eOpt) {
            var cardHolder = Ext.getCmp(cardHolderId),
                menuPanel = cardHolder.down('#menuItems');

            var itemId = newCard.itemId;
            result = Ext.Array.findBy(config.menuItems, function (item) {
                if (item.tabItemId == itemId) {
                    return true;
                }
            });

            if (Ext.isEmpty(result.filterPanel)) {
                cardHolder.getLayout().setActiveItem(menuPanel, {transitionType: 'crossFade'});
            }
            else {
                var filterPanel = cardHolder.down('#filterPanel' + "_" + result.tabItemId);
                cardHolder.getLayout().setActiveItem(filterPanel, {transitionType: 'crossFade'});
            }
        });
    };

    this.setup = function () {
        this.westPanel = {
            id: 'erp_app_viewport_west',
            style: {
                marginRight: '10px',
                marginLeft: '20px',
                borderRadius: '5px'
            },
            region: 'west',
            width: 200,
            split: true,
            layout: 'accordion',
            items: accordionMenuItems
        };

        this.viewPort = Ext.create('Ext.container.Viewport', {
            border: false,
            layout: 'fit',
            items: [
                {
                    xtype: 'panel',
                    border: false,
                    layout: 'border',
                    dockedItems: [
                        this.toolBar,
                        this.bottomBar
                    ],
                    items: [
                        this.westPanel,
                        this.centerPanel,
                        this.eastPanel
                    ]
                }
            ]
        });
        this.viewPort.down('#organizerWelcomeMsg').setText('Welcome: ' + currentUser.description);
    };
};

Compass.ErpApp.Organizer.Layout.setActiveCenterItem = function (panel_id, menu_id, loadRemoteData) {
    // set panel as active
    var panel = Ext.getCmp('erp_app_viewport_center').down('#' + panel_id);
    if (panel)
        Ext.getCmp('erp_app_viewport_center').layout.setActiveItem(panel);

    var menu = Ext.getCmp('erp_app_viewport_west').down('#' + menu_id);
    if (menu)
        menu.expand();

    if (loadRemoteData === undefined || loadRemoteData) {
        var hasLoad = ( (typeof panel.loadRemoteData) != 'undefined' );
        if (hasLoad) {
            panel.loadRemoteData();
        }
    }
};



