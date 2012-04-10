var fs = require("fs");
var path = require("path");
var ideal = require("ideal");
var oden = module.parent.exports;


oden.Directory = oden.File.clone().newSlots({
	
}).setSlots({
	directories: function()
	{
		return this.items().filterPerform("isDirectory");
	},
	
	items: function()
	{
		var self = this;
		return this.cached("readdirSync", function(){ return fs.readdirSync(self.path()) }).map(function(name){
			return self.itemAt(name);
		});
	},
	
	itemAt: function(name)
	{
		return oden.File.withPath(this.path() + "/" + name).asFileOrDirectory();
	}
})

oden.File.setSlots({
	asFileOrDirectory: function()
	{
		if (this.isFile())
		{
			return this;
		}
		else if (this.isDirectory())
		{
			return this.asDirectory();
		}
		else
		{
			throw "Unknown Item Type";
		}
	},
	
	isDirectory: function()
	{
		return this.stat().isDirectory();
	},

	isFile: function()
	{
		return this.stat().isFile();
	},
	
	asDirectory: function()
	{
		return oden.Directory.withPath(this.path());
	}
});