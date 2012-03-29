var ideal = require("ideal");
var oden = module.parent.exports;

oden.HttpRequest = ideal.Observable.clone().newSlots({
	type: "oden.HttpRequest",
	
	nodeRequest: null
}).setSlots({
});