Ext.define("Compass.ErpApp.Desktop.Applications.RailsDbAdmin.SplashScreen", {
    title: 'Startup',
    extend: "Ext.panel.Panel",
    alias: 'widget.railsdbadmin_splash_screen',
    autoScroll: true,
    items: [
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><hr /><h2 style='margin: 3px 0px 0px 0px; color: #555; text-align: center'>Database Navigator</h2><hr /></div>"
        },
        {
            xtype: 'image',
            style: 'padding-left: 50%; margin-left: -400px;',
            src: '/images/splash/splash.png'   // src: 'http://placehold.it/800x250'
        },
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><p style='margin: 0px; color: #222; text-align: center; font-size: 16px; font-weight: 300;'>Click on the shortcuts below to get started.</p></div>"
        },
        {
            xtype: 'panel',
            layout: 'column',
            style: 'width: 480px; margin-top: 0px; margin-left: auto; margin-right: auto;',
            items: [

                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/splash/images/data-model-icon.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        self.initialConfig.module.setWindowStatus('Retrieving Docs...');
                                        self.initialConfig.module.openIframeInTab('Data Models', 'http://documentation.compassagile.com');
                                        self.initialConfig.module.clearWindowStatus();

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Browse the DB models</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/splash/images/console-icon.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

//Launch a console in a tab in the current app

                                        self.initialConfig.module.addConsolePanel();

//****** Launch a console as a separate desktop application ***********
//
//                                        var desktop = this.findParentByType('desktop');
//                                        var module = desktop.app.getModule('compass_console-win');
//
//                                        if (module) {
//                                            module.createWindow();
//                                        }
//********************************************************************
                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Open a console</p>"
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    height: 140,
                    width: 140,
                    style: 'margin: 10px 10px 10px 10px;',
                    bodyStyle: 'background: #ddd; padding: 20px; border-radius: 7px; border-color: #aaa !important;',
                    border: true,
                    bodyBorder: true,
                    overCls: 'shortcut-hover',
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/knitkit/splash/images/tutorials.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        self.initialConfig.module.setWindowStatus('Retrieving Docs...');
                                        self.initialConfig.module.openIframeInTab('Tutorials', 'http://tutorials.compassagile.com');
                                        self.initialConfig.module.clearWindowStatus();

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Learn More!</p>"
                        }
                    ]
                }
            ]
        }
    ],
    constructor: function (config) {
        self = this;

        config = Ext.apply({
            //placeholder
        }, config);
        this.callParent([config]);
    }

});