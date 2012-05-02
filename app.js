// Express
var express = require('express');
var app = express.createServer();
var util = require('util');
var uglify = require('uglify-js');

// Configuration
app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.logger());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var clean_ast = function(ast) {
	for (var key in ast) {
		if (ast.hasOwnProperty(key)) {
			if (key === "scope") {
				var obj = ast[key];
				delete obj.body;
				delete obj.children;
				delete obj.parent;
				//delete obj.refs;
			} else if (key === "obj_scope") {
				var obj_scope = {};
				for (var i = 0, len = ast[key].length; i < len; i++) {
					obj_scope[i] = ast[key][i];
				}
				ast[key] = obj_scope;
			} else if (typeof ast[key] === "object") {
				clean_ast(ast[key]);
			}
		}
	}
}

app.post('/', function(req, res) {
	var ast = uglify.parser.parse(req.body.input);
	ast = uglify.uglify.ast_mangle(ast);
	clean_ast(ast);
	res.send({output: util.inspect(ast, false, null)});
});


app.listen(3000);
