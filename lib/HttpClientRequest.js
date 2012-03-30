var url = require("url");
var http = require("http");
var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpClientRequest = ideal.Observable.clone().newSlots({
	type: "oden.HttpClientRequest",
	
	url: null,
	method: "GET",
	
	error: null,
	response: null
}).setSlots({
	init: function()
	{
		ideal.Observable.init.call(this);
		this.setUrl(oden.Url.clone());
	},
	
	start: function()
	{
		var self = this;
		var url = this.url();
		var nodeRequest = http.request({
			host: url.host(),
			port: url.port(),
			method: this.method(),
			path: url.resource(),
			agent: false
		}, function(response){
			self.receivedResponse(response);
		});
		
		nodeRequest.on('error', function(e){
			self.failed(e);
		});
		
		nodeRequest.end();
		
		return this;
	},
	
	receivedResponse: function(nodeResponse)
	{
		var response = oden.HttpClientResponse.clone().setNodeResponse(nodeResponse);
		response.addObserver(this);
		response.start();
		this.setResponse(response);
		this.sendNotification("receivedResponse");
	},
	
	httpClientResponseEnded: function()
	{
		this.sendNotification("completed");
	},
	
	failed: function(error)
	{
		this.setError(error);
		this.sendNotification("failed");
	}
});

String.prototype.httpGet = function()
{
	return oden.HttpClientRequest.clone().setUrl(this.asUrl()).start();
}