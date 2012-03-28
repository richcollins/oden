var cx = require("crux.js");
var oden = module.parent.exports;

oden.HttpResponse = cx.Observable.clone().newSlots({
	type: "oden.HttpResponse",
	
	contentType: "text/plain",
	status: 200,
	body: "default oden.HttpResponse.body",
	
	nodeResponse: null
}).setSlots({
	send: function()
	{
		this.nodeResponse().writeHead(this.status(), { 'Content-Type': this.contentType() });
		this.nodeResponse().end(this.body());
		return this;
	}
});