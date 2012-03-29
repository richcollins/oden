var url = require("url");
var ideal = require("ideal");
var oden = module.parent.exports;

oden.Url = ideal.Proto.clone().newSlots({
	type: "oden.Url",
	
	protocol: "http:",
	host: "localhost",
	port: "80",
	path: "/",
	queryMap: null
}).setSlots({
	init: function()
	{
		this.setQueryMap(ideal.map());
	},
	
	setString: function(urlString)
	{
		var nodeUrl = url.parse(urlString, true);
		this.performSets({
			protocol: nodeUrl.protocol,
			host: nodeUrl.hostname,
			path: nodeUrl.pathname,
			queryMap: ideal.map(nodeUrl.query)
		});
		return this;
	},
	
	resource: function()
	{
		if (this.queryMap().isEmpty())
		{
			return this.path();
		}
		else
		{
			return this.path() + "?" + this.queryMap().map(function(k, v){ return k = "=" + v }).join("&");
		}
	}
});

String.prototype.asUrl = function()
{
	return oden.Url.clone().setString(String(this));
}