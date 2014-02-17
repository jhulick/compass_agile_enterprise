Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.SplashScreen",{
    extend:"Ext.panel.Panel",
    alias:'widget.knitkit_splash_screen',
    title: 'Startup',
    items: [
        {
            html: "<div style='margin: 15px 50px 5px 50px;'><hr /><h2 style='margin: 3px 0px 0px 0px; color: #555; text-align: center'>Website Builder Home</h2><hr /></div>"
        },

        {
            xtype: 'image',
            style: 'padding-left: 50%; margin-left: -300px;',
             //src: 'http://placehold.it/600x250'
            src: '/images/knitkit/splash/splash.png'
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
                            src: '/images/knitkit/splash/images/browse-site.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        alert('Browse current site');

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>View the current site in a browser</p>"
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
                            src: '/images/knitkit/splash/images/find-themes.png',
                            height: 80,
                            width: 80,
                            style: 'margin: 0px 0px 5px 10px;',
                            listeners: {
                                render: function (component) {
                                    component.getEl().on('click', function (e) {

                                        //Which of these is cooler? Which is more useful?
                                        //window.open("http://themes.compassagile.com");

                                        self.initialConfig['centerRegion'].setWindowStatus('Finding themes...');
                                        self.initialConfig['centerRegion'].openIframeInTab('Find Themes', 'http://themes.compassagile.com');
                                        self.initialConfig['centerRegion'].clearWindowStatus();



                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Find themes</p>"
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

                                        self.initialConfig['centerRegion'].setWindowStatus('Retrieving Docs...');
                                        self.initialConfig['centerRegion'].openIframeInTab('Tutorials', 'http://tutorials.compassagile.com');
                                        self.initialConfig['centerRegion'].clearWindowStatus();

                                    }, component);
                                }
                            }
                        },
                        {
                            html: "<p style='background-color: #ddd; margin: 0px; text-align: center'>Learn more!</p>"
                        }
                    ]
                }
            ]
        }
    ],
    constructor: function (config) {
        self = this;

        config = Ext.apply({

           centerRegion : this.findParentByType('window')

        }, config);
        this.callParent([config]);
    }
});


