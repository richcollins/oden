var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpServerResponse = ideal.Observable.clone().newSlots({
	type: "oden.HttpServerResponse",
	
	contentType: "text/plain",
	statusCode: 200,
	body: "default oden.HttpServerResponse.body",
	
	nodeResponse: null
}).setSlots({
	send: function()
	{
		this.nodeResponse().writeHead(this.statusCode(), { 'Content-Type': this.contentType() });
		this.nodeResponse().end(this.body());
		return this;
	}
});