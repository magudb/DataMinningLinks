
var fs = require('fs');
var _ = require("lodash");
var url = require('url');
var storage = require('node-persist');
storage.initSync({
	logging:false
});

var baseDir = "C:\\Users\\mud\\Dropbox\\Blog\\";

var files = fs.readdirSync(baseDir)

handler(files)

function hostCount(uri, rawUrl, next) {
	if (!uri.hostname) {		
		return;
	}

	var urlObject = {
		host: uri.host,
		path: uri.path,
		query: uri.query,
		url: rawUrl
	}

	var key = "host_" + uri.hostname.replace(/\s+/g, '_').replace(/[^a-zA-Z-]/g, '_');

	var byHost = storage.getItem(key);

	if (byHost) {
		byHost.count = byHost.count + 1;
		if(!byHost.uris){
			byHost.uris = [urlObject];
		}
		byHost.uris.push(urlObject);
		storage.setItemSync(key, byHost);
	} else {
		byHost = { 'count': 1, 'uris': [urlObject], host: uri.host }
		storage.setItemSync(key, byHost);
	}

	next(uri);
}

function linksCount(uri) {
	if (!uri.path) {		
		return;
	}
	var hostAndPath = uri.host + uri.path;
	if(uri.path.length<2){
		hostAndPath = uri.host + "home";
	}
	
	var key = "path_" +hostAndPath.replace(/\s+/g, '').replace(/[^a-zA-Z-]/g, '').replace(/-/g, '');

	var byPath = storage.getItem(key);

	if (byPath) {
		byPath.count = byPath.count + 1;
		storage.setItemSync(key, byPath);
	} else {
		byPath = { count: 1, host: uri.host, path: uri.path }
		storage.setItemSync(key, byPath);
	}
}

function handler(files) {

	if (!files) {
		return;
	}

	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		if (file.indexOf(".md") < 0) {
			return;
		}

		console.log("Reading " + file);
		var fullPath = baseDir + file;

		var rl = require('readline').createInterface({
			input: require('fs').createReadStream(fullPath)
		});

		rl.on('line', function (line) {
			var myArray = line.match(/\[([^\]]+)\]\(([^)]+)\)/i)

			if (!myArray) {
				return;
			}

			var uri = url.parse(myArray[2]);
			
			hostCount(uri, myArray[2], linksCount);

		}).on('close', function () {
			console.log('Have a great day!');
		});
	};

}