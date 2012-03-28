[
	"HttpRequest",
	"HttpResponse",
	"HttpResponder",
	"HttpServer",
].forEach(function(name){
	require(__dirname + "/" + name + ".js");
});