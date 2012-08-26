var url = require("url");
var http = require("http");
var ideal = require("ideal");
var zlib = require('zlib');
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
	
	isSuccess: function()
	{
		var code = parseInt(this.statusCode());
		return code >= 200 && code < 300;
	},
	
	start: function()
	{
		var self = this;
		
		this.setBody("");
		var chunks = [];
		var length = 0;
		
		var nodeResponse = this.nodeResponse();
		nodeResponse.on("data", function(chunk){
			length += chunk.length;
			chunks.append(chunk);
		});
		nodeResponse.on("end", function(){
			var body = new Buffer(length);
			var i = 0;
			chunks.forEach(function(chunk){
				chunk.copy(body, i);
				i = i + chunk.length;
			});
			
			console.log("[" + nodeResponse.headers["content-encoding"] + "]");
			if (nodeResponse.headers["content-encoding"] == "gzip")
			{
				zlib.gunzip(body, function(error, result){
					if (error)
					{
						self.setBody("");
						self.sendNotification("failed");
					}
					else
					{
						self.setBody(result.toString("utf8"));
						self.sendNotification("ended");
					}
				})
			}
			else if (nodeResponse.headers["content-encoding"] == "deflate")
			{
				zlib.inflate(body, function(error, result){
					if (error)
					{
						self.setBody("");
						self.sendNotification("failed");
					}
					else
					{
						self.setBody(result.toString("utf8"));
						self.sendNotification("ended");
					}
				})
			}
			else
			{
				self.setBody(body.toString("utf8"));
				self.sendNotification("ended");
			}
		});
		
		return this;
	},
	
	headers: function()
	{
		return map(this.nodeResponse().headers);
	}
});