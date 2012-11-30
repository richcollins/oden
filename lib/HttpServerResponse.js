var ideal = require("ideal");
var oden = module.parent.exports;
var zlib = require('zlib');

oden.HttpServerResponse = ideal.Observable.clone().newSlots({
	type: "oden.HttpServerResponse",
	
	contentType: "text/plain",
	charset: "utf-8",
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
			this.setHeader('Content-Type', this.contentType() + "; charset=" + this.charset());
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
		this.sendNotification("send");
		
		var body = this.body()
		this.setHeader('Content-Length', new Buffer(body, "utf8").length);
		this.nodeResponse().writeHead(this.statusCode(), this.headers().jsMap());
		this.nodeResponse().end(body);
	},
	
	setHeader: function(name, value)
	{
		this.headers().atPut(name, value);
		return this;
	}
});