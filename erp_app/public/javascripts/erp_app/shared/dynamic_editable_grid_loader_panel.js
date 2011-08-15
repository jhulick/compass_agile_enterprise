Ext.define("Compass.ErpApp.Shared.DynamicEditableGridLoaderPanel",{
    extend:"Ext.Panel",
    alias:'widget.shared_dynamiceditablegridloaderpanel',
    setupGrid: function(){
        var self = this;
        var config = this.initialConfig;
        var conn = new Ext.data.Connection();
        conn.request({
            url: config['setupUrl'],
            method: 'POST',
            params:config['params'],
            success: function(responseObject) {
                var response =  Ext.decode(responseObject.responseText);
                if(response.success){
                    self.add({
                        editable:config['editable'],
                        url:config['dataUrl'],
                        page:config['page'],
                        pageSize:config['pageSize'],
                        displayMsg:config['displayMsg'],
                        emptyMsg:config['emptyMsg'],
                        xtype:'shared_dynamiceditablegrid',
                        columns:response.columns,
                        fields:response.fields,
                        model:response.model,
                        validations:response.validations
                    });
                    self.getLayout().setActiveItem(0);
                }
                else{
                    var message = response.message
                    if(Compass.ErpApp.Utility.isBlank(message)){
                        message = config['loadErrorMessage']
                    }
                    Ext.Msg.alert('Error', message);
                }
            },
            failure: function() {
                Ext.Msg.alert('Error', 'Could not load grid.');
            }
        });
    },

    onRender: function() {
        Compass.ErpApp.Shared.DynamicEditableGridLoaderPanel.superclass.onRender.apply(this, arguments);
        this.setupGrid();
    },

    constructor : function(config) {
        config = Ext.apply({
            layout:'card'
        }, config);
        Compass.ErpApp.Shared.DynamicEditableGridLoaderPanel.superclass.constructor.call(this, config);
    }
});







