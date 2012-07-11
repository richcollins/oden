var http = require('http');
var ideal = require("ideal");
var crypto = require('crypto')

ideal.Object_shallowCopyTo({
	sha1String: function()
	{
		var sha1 = crypto.createHash('sha1');
		sha1.update(String(this));
		return sha1.digest('hex');
	},

	md5String: function(prefix)
	{
		var md5 = crypto.createHash('md5');
		md5.update(String(this));
		return md5.digest('hex');
	}
}, String.prototype);