var http = require('http');
var cx = require("crux");
var oden = module.parent.exports;

oden.HttpServer = cx.Proto.clone().newSlots({
	type: "oden.HttpServer",
	
	ip: "127.0.0.1",
	port: 5000,
	responderProto: oden.HttpResponder
}).setSlots({
	newResponder: function()
	{
		return this.responderProto().clone().setServer(this);
	},
	
	start: function()
	{
		var self = this;
		http.createServer(function(req, res){
			self.newResponder().setNodeRequest(req).setNodeResponse(res).respond();
		}).listen(this.port(), this.ip());
		
		return this;
	}
});