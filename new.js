var UglifyJS = require('uglify-js2');
var url = require('url'),
	urlparser = url.parse,
	pathnatvie = require('path'),
	fs = require('fs');
var crypto = require('crypto');
var async = true;
	
exports.uglifyjs = function(path,cache){
	console.log('new')
	if(!path) {
		if (!root) throw new Error('path required');
		return;
	}else{
        return function(req,res,next){
			var pathname = urlparser(req.url).pathname;
			var files = [];
			if(pathname.indexOf('|')==-1){
				files.push(pathname);
			}else{
				files = pathname.split('|');
			}
			if(async){
				var cacheName = MD5Str(pathname);
				var cachePath = pathnatvie.join(path,cache,cacheName) + '.js';
				fs.exists(cachePath,function(exists){
					if(exists){
						res.sendfile(cachePath);
					}else{
						var fianalContent = '';
						for(var i=0;i<files.length;i++){
							var realPath = pathnatvie.join(path,files[i]);
							var result = UglifyJS.minify(realPath);
							fianalContent += result.code;
						}
						fs.writeFile(cachePath,fianalContent,'utf-8',function(err){
							if(err) next(err);
							else{
								res.sendfile(cachePath);
							}
						});
					}
				});
			}else{
				var yibuarr = [];
				for(var i=0;i<files.length;i++){
					var extname = pathnatvie.extname(files[i]);
					if(extname!='.js') continue;
					yibuarr.push(
						(function(i){
							var realPath = pathnatvie.join(path,files[i]);
							console.log(realPath)
							return function(next){
								fs.stat(realPath,function(err,stat){
									if(err){
										console.log(err)
										return;
										return next(err);
									}else{
										res.setHeader('Content-Type','text/javascript');
										var lastModified = stat.mtime.toUTCString();
										res.setHeader('Last-Modified',lastModified);
										
										var ifModifiedSince = "If-Modified-Since".toLowerCase();
										if(req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]){
											res.writeHead('304','Not Modified');
											res.end();
										}else{
											var result = UglifyJS.minify(realPath);
											fianalContent += result.code;
											if(i==files.length-1){
												res.writeHead('200','OK');
												res.end(fianalContent);
											}else{
												next();
											}
										}
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
				//arr[idx]();
			}
		}
	});
	newArr[0](0);
}

function MD5Str(str){
	var md5 = crypto.createHash('md5');
	md5.update(str);
	return md5.digest('hex');
}