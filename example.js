var express = require('express');
var app = express();

var UglifyJS = require("express-uglijs");
app.use('/static/js',UglifyJS.oldUGJS(__dirname+'/resources/js','cache'));
//UglifyJS.oldUGJS(path,cachePath);
//path为文件实际路径，cachePath为首次压缩后生成的压缩文件保存路径，默认在path目录下
//前台HTML代码<script src="static/js/jquer.js|index.js|others.js"></script>

app.get('/',function(req,res,next){
	res.end('~~~~~');
});

app.listen(config.port);

