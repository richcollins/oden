var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpServerResponder = ideal.Observable.clone().newSlots({
	type: "oden.HttpServerResponder",
	
	server: null,
	request: null,
	response: null,
	
	nodeRequest: null,
	nodeResponse: null
}).setSlots({
	request: function()
	{
		if (!this._request)
		{
			this._request = oden.HttpServerRequest.clone().setNodeRequest(this.nodeRequest()).setServer(this.server());
		}
		
		return this._request;
	},
	
	willRespond: function()
	{
		this.request().start();
		return this;
	},
	
	response: function()
	{
		if (!this._response)
		{
			this._response = oden.HttpServerResponse.clone().setNodeResponse(this.nodeResponse());
		}
		
		return this._response;
	},
	
	respond: function()
	{
		this.response().performSets({
			contentType: 'text/plain',
			status: 200,
			body: 'change oden.HttpServer.responderProto'
		}).send();
		
		return this;
	},
	
	allowCors: function()
	{
		var r = this.response();
		r.setHeader("Access-Control-Allow-Origin", "*");
		r.setHeader("Access-Control-Allow-Headers", this.request().headers().keys().join(","));
		return this;
	}
});