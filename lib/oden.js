[
	"Url",
	
	"HttpClientRequest",
	"HttpClientResponse",
	
	"HttpServerRequest",
	"HttpServerResponse",
	"HttpServerResponder",
	"HttpServer",
	
	"File",
	"Directory"
].forEach(function(name){
	require(__dirname + "/" + name + ".js");
});