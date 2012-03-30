var url = require('url');
var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpServerRequest = ideal.Observable.clone().newSlots({
	type: "oden.HttpServerRequest",
	
	nodeRequest: null
}).setSlots({
	queryMap: function()
	{
		return map(url.parse(this.nodeRequest().url, true).query);
	}
});