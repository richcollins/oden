var cx = require("crux");
var oden = module.parent.exports;

oden.HttpResponder = cx.Observable.clone().newSlots({
	type: "oden.HttpResponder",
	
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
			this._request = oden.HttpResponse.clone().setNodeRequest(this.nodeRequest());
		}
		
		return this._request;
	},
	
	response: function()
	{
		if (!this._response)
		{
			this._response = oden.HttpResponse.clone().setNodeResponse(this.nodeResponse());
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
	}
});