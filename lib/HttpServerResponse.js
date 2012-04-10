var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpServerResponse = ideal.Observable.clone().newSlots({
	type: "oden.HttpServerResponse",
	
	contentType: "text/plain",
	statusCode: 200,
	body: "default oden.HttpServerResponse.body",
	headers: null,
	
	nodeResponse: null
}).setSlots({
	init: function()
	{
		ideal.Observable.init.call(this);
		this.setHeaders(map());
	},
	
	send: function()
	{
		if (!this.headers().lowerCased().hasKey('content-type'))
		{
			this.setHeader('Content-Type', this.contentType());
		}
		this.nodeResponse().writeHead(this.statusCode(), this.headers().jsMap());
		this.nodeResponse().end(this.body());
		return this;
	},
	
	setHeader: function(name, value)
	{
		this.headers().atPut(name, value);
		return this;
	}
});