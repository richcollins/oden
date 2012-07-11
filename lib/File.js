var fs = require("fs");
var path = require("path");
var ideal = require("ideal");
var oden = module.parent.exports;

oden.File = ideal.Proto.clone().newSlots({
	path: null,
	encoding: "utf8",
	caches: true,
	cache: {}
}).setSlots({
	withPath: function(path)
	{
		return this.clone().setPath(path);
	},
	
	name: function()
	{
		return path.basename(this.path());
	},
	
	cached: function(key, fn)
	{
		if (this.caches())
		{
			key = key + this.path();
			var cache = this.cache();
			var v = cache[key];
			if (v === undefined)
			{
				v = fn();
				cache[key] = v;
			}
			return v;
		}
		else
		{
			return fn();
		}
	},
	
	exists: function()
	{
		var self = this;
		return this.cached("existsSync", function() { return fs.existsSync(self.path()) });
	},
	
	stat: function()
	{
		var self = this;
		return this.cached("statSync", function() { return fs.statSync(self.path()) });
	},
	
	contents: function()
	{
		var self = this;
		return this.cached("readFileSync", function() { return fs.readFileSync(self.path(), self.encoding()) });
	},
	
	resolvePath: function()
	{
		this.setPath(path.normalize(this.path()));
		return this;
	}
})