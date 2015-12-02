
var fs = require('fs');
var url = require('url');
var storage = require('node-persist');
storage.init();

var baseDir = "C:\\Users\\mud\\Dropbox\\Blog\\";

fs.readdir(baseDir, handler)

function handler(err, files) {

	if (!files) {
		return;
	}

	files.forEach(function (file) {

		if (file.indexOf(".md") < 0) {
			return;
		}
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
			if(!uri.host){
				return;
			}
			var key = uri.host.replace(".","_");
			var byHost = storage.getItem(key);
			console.log(byHost);
			if (byHost) {
				byHost.count = byHost.count++;
				storage.setItem(key, byHost);
			} else {
				storage.setItem(key, {count:1});
			}
			
		}).on('close', function () {
			console.log('Have a great day!');
			console.log(storage.values());		
		});
	});

}