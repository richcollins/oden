var url = require('url');
var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpServerRequest = ideal.Observable.clone().newSlots({
	type: "oden.HttpServerRequest",
	
	url: null,
	
	server: null,
	nodeRequest: null,
	body: "",
	hasReceivedBody: false
}).setSlots({
	setNodeRequest: function(nodeRequest)
	{
		this._nodeRequest = nodeRequest;
		nodeRequest.setEncoding('utf8');
		var self = this;
		var data = "";
		nodeRequest.on('data', function(chunk){
			data += chunk;
			self.setBody(data);
		});
		nodeRequest.on('end', function(){
			self.setHasReceivedBody(true);
			self.sendNotification('receivedBody');
		});
		return this;
	},
	
	url: function()
	{
		if (!this._url)
		{
			this._url = oden.Url.clone().setString(this.nodeRequest().url).setHost(this.host()).setPort(this.port());
		}
		
		return this._url;
	},
	
	path: function()
	{
		return this.url().path();
	},
	
	queryMap: function()
	{
		return this.url().queryMap();
	},
	
	ip: function()
	{
		return (this.headers().lowerCased().at('x-forwarded-for') || '').split(",").first() || this.nodeRequest().connection.remoteAddress;
	},
	
	host: function()
	{
		return this.headers().lowerCased().at('host') || this.ip();
	},
	
	port: function()
	{
		return this.server().port();
	},
	
	isGet: function()
	{
		return this.method() == "GET";
	},
	
	method: function()
	{
		return this.nodeRequest().method;
	},
	
	headers: function()
	{
		return map(this.nodeRequest().headers);
	},
	
	acceptsGzip: function()
	{
		return Object_perform(this.headers().lowerCased().at('accept-encoding'), "contains", "gzip");
	}
});