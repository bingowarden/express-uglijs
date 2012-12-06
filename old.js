var url = require('url'),
	urlparser = url.parse,
	pathnatvie = require('path'),
	fs = require('fs');
var uglifyjs = require("uglify-js");
var crypto = require('crypto');

function MD5Str(str){
	var md5 = crypto.createHash('md5');
	md5.update(str);
	return md5.digest('hex');
}

exports.uglifyjs = function(path,cache){
	console.log('old')
	if(!path) {
		if (!root) throw new Error('path required');
		return;
	}else{
        return function(req,res,next){
			var pathname = urlparser(req.url).pathname;
			var cacheName = MD5Str(pathname);
			var cachePath = pathnatvie.join(path,cache,cacheName) + '.js';
			fs.exists(cachePath,function(exists){
				if(exists){
					res.sendfile(cachePath,{maxAge:5000});
				}else{
					createCache();
				}
			});
			function createCache(){
				var files = [];
				if(pathname.indexOf('|')==-1){
					files.push(pathname);
				}else{
					files = pathname.split('|');
				}
				var yibuarr = [],content=[];
				for(var i=0;i<files.length;i++){
					var extname = pathnatvie.extname(files[i]);
					if(extname!='.js') continue;
					yibuarr.push(
						(function(i){
							var realPath = pathnatvie.join(path,files[i]);
							return function(nextCall){
								fs.readFile(realPath,function(err,data){
									content.push(data);
									if(i==files.length-1){
										fs.writeFile(cachePath,uglifyjs(content.join('')),'utf-8',function(err){
											if(err) next(err);
											else {
												res.sendfile(cachePath);
											}
										});
									}else{
										nextCall();
									}
								});
							}
						})(i))
				}
				yibu(yibuarr);
			}
		}
	}
}

function yibu(arr){
	var len = arr.length;
	var newArr = arr.map(function(oldfn){
		return function(idx){
			if(idx==len) return;
			else{
				oldfn(function(){
					newArr[idx+1](idx+1);
				});
			}
		}
	});
	newArr[0](0);
}

