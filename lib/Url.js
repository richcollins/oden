var url = require("url");
var ideal = require("ideal");
var oden = module.parent.exports;

oden.Url = ideal.Proto.clone().newSlots({
	type: "oden.Url",
	
	protocol: "http:",
	host: "localhost",
	username: null,
	password: null,
	port: "80",
	path: "/",
	queryMap: null
}).setSlots({
	init: function()
	{
		this.setQueryMap(ideal.map());
	},
	
	isHttp: function()
	{
		return this.protocol() == "http:";
	},
	
	setString: function(urlString)
	{
		var nodeUrl = url.parse(urlString, true);
		var query = url.parse(urlString).query;
		if (query && (query.split("=").length > 2) && (!query.contains("&")))
		{
			var q = {};
			q[query] = "";
			query = q;
		}
		else
		{
			query = nodeUrl.query;
		}
		
		var authParts = [];
		
		if (nodeUrl.auth)
		{
			authParts = nodeUrl.auth.split(":");
		}
		
		this.performSets({
			protocol: nodeUrl.protocol,
			username: authParts[0],
			password: authParts[1],
			port: nodeUrl.port || (nodeUrl.protocol == "http:" ? 80 : 443),
			host: nodeUrl.hostname,
			path: nodeUrl.pathname,
			queryMap: ideal.map(query)
		});
		return this;
	},
	
	auth: function()
	{
		if (this.username() && this.password())
		{
			return [this.username(), this.password()].join(":");
		}
		return null;
	},
	
	resource: function()
	{
		if (this.queryMap().isEmpty())
		{
			return this.path();
		}
		else
		{
			return this.path() + this.queryMap().queryString();
		}
	},
	
	toString: function()
	{
		var options = {
			protocol: this.protocol(),
			hostname: this.host(),
			port: this.port(),
			pathname: this.path(),
			auth: this.auth(),
			query: this.queryMap().jsMap()
		};
		
		if (String(options.port) == "80")
		{
			delete options.port;
		}
		return url.format(options);
	}
});

String.prototype.asUrl = function()
{
	return oden.Url.clone().setString(String(this));
}