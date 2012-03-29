[
	"Url",
	
	"HttpClientRequest",
	"HttpClientResponse",
	
	"HttpServerRequest",
	"HttpServerResponse",
	"HttpServerResponder",
	"HttpServer",
].forEach(function(name){
	require(__dirname + "/" + name + ".js");
});