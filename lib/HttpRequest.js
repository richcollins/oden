var cx = require("crux.js");
var oden = module.parent.exports;

oden.HttpRequest = cx.Observable.clone().newSlots({
	type: "oden.HttpRequest",
	
	nodeRequest: null
}).setSlots({
});