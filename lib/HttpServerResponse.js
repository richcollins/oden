var ideal = require("ideal");
var oden = module.parent.exports;
var zlib = require('zlib');

oden.HttpServerResponse = ideal.Observable.clone().newSlots({
	type: "oden.HttpServerResponse",
	
	contentType: "text/plain",
	statusCode: 200,
	body: "default oden.HttpServerResponse.body",
	headers: null,
	gzips: false,
	startTime: null,
	
	isSent: false,
	
	nodeResponse: null
}).setSlots({
	init: function()
	{
		ideal.Observable.init.call(this);
		this.setHeaders(map());
	},
	
	send: function()
	{
		if (this.isSent())
		{
			return;
		}
		
		this.setIsSent(true);
		if (!this.headers().lowerCased().hasKey('content-type'))
		{
			this.setHeader('Content-Type', this.contentType());
		}
		
		if (this.gzips())
		{
			var self = this;
			zlib.gzip(this.body(), function(error, result){
				if (error)
				{
					self.justSend();
				}
				else
				{
					self.setHeader('Content-Encoding', "gzip");
					self.setBody(result).justSend();
				}
			})
		}
		else
		{
			this.justSend();
		}
		return this;
	},
	
	justSend: function()
	{
		if (this.startTime())
		{
			console.log((new Date().getTime() - this.startTime()) + "ms");
		}
		
		this.sendNotification("send");
		
		this.setHeader('Content-Length', this.body().length);
		this.nodeResponse().writeHead(this.statusCode(), this.headers().jsMap());
		this.nodeResponse().end(this.body());
	},
	
	setHeader: function(name, value)
	{
		this.headers().atPut(name, value);
		return this;
	}
});