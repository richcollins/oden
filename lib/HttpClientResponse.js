var url = require("url");
var http = require("http");
var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpClientResponse = ideal.Observable.clone().newSlots({
	type: "oden.HttpClientResponse",
	
	body: null,
	nodeResponse: null
}).setSlots({
	statusCode: function()
	{
		return this.nodeResponse().statusCode;
	},
	
	start: function()
	{
		var self = this;
		
		this.setBody("");
		
		var nodeResponse = this.nodeResponse();
		nodeResponse.setEncoding('utf8');
		nodeResponse.on("data", function(data){
			self.setBody(self.body() + data);
		});
		nodeResponse.on("end", function(){
			self.sendNotification("ended");
		});
		
		return this;
	}
});