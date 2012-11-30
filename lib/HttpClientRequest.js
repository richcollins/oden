var url = require("url");
var http = require("http");
var https = require("https");
var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpClientRequest = ideal.Observable.clone().newSlots({
	type: "oden.HttpClientRequest",
	
	url: null,
	method: "GET",
	headers: null,
	maxRedirects: 0,
	body: "",
	
	nodeRequest: null,
	
	error: null,
	response: null
}).setSlots({
	init: function()
	{
		ideal.Observable.init.call(this);
		this.setUrl(oden.Url.clone());
		this.setHeaders(ideal.map({
			Accept: "*/*"
		}));
	},
	
	setUrlString: function(urlString)
	{
		this.url().setString(urlString);
		return this;
	},
	
	start: function()
	{
		var self = this;
		var url = this.url();
		
		var nodeRequest = (url.isHttp() ? http : https).request({
			auth: url.auth(),
			host: url.host(),
			port: url.port(),
			method: this.method(),
			path: url.resource(),
			agent: false,
			headers: this.headers().jsMap()
		});
		
		nodeRequest.end(this.body());
		
		nodeRequest.on('response', function(response){
			self.receivedResponse(response);
		});
		
		nodeRequest.on('error', function(e){
			self.failed(e);
		});
		
		nodeRequest.end();
		
		this.setNodeRequest(nodeRequest);
		
		return this;
	},
	
	setHeader: function(name, value)
	{
		this.headers().atPut(name, value);
		return this;
	},
	
	receivedResponse: function(nodeResponse)
	{
		var response = oden.HttpClientResponse.clone().setNodeResponse(nodeResponse);
		if (response.isRedirect() && this.maxRedirects() > 0)
		{
			this.setUrlString(response.headers().lowerCased().at("location"));
			this.setMaxRedirects(this.maxRedirects() - 1);
			this.start();
		}
		else
		{
			response.addObserver(this);
			response.start();
			this.setResponse(response);
			this.sendNotification("receivedResponse");
		}
	},
	
	httpClientResponseEnded: function()
	{
		this.sendNotification("completed");
	},
	
	failed: function(error)
	{
		this.setError(error);
		this.sendNotification("failed");
	},
	
	cancel: function()
	{
		if (this.nodeRequest())
		{
			this.nodeRequest().abort();
		}
		
		this.removeAllObservers();
		return this;
	}
});

String.prototype.httpGet = function()
{
	return oden.HttpClientRequest.clone().setUrl(this.asUrl()).start();
}