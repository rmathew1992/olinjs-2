
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');;

var app = express();


mongoose.connect(process.env.MONGOLAB_URI || 'localhost', 'test');

var schema = mongoose.Schema({ name: 'string' });
var Cat = mongoose.model('Cat', schema);


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/users/new', user.new);
app.get('/cats/new',function(req,res){
	var kitty = new Cat({ name: 'Zildjian' });
	kitty.save(function (err) {
  		if (err) 
			return console.log("error",err);// ...
  		res.send('meow');
	});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
