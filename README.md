#olin.js #2 — express & mongo

We'll be covering the basics of Express and MongoDB (through Mongoose). Install MongoDB with the following commands on Ubuntu:

```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10;
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | sudo tee /etc/apt/sources.list.d/10gen.list;
sudo apt-get update;
sudo apt-get install mongodb-10gen;
```

If you're on OSX, run:

```
brew install mongodb
```

## Express

Now that we've explored Node.js a little, we will abstract the details away with the [express](http://expressjs.com/) development framework.
Before, in the Node Beginner's Book, our code looked a lot like this:

```js
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);
```

Let's write the equivalent code in Express. First, run `git clone https://github.com/olinjs/olinjs-2.git` as in the last
lesson to clone this repository. Next, in the `olinjs-2/` folder, run the command `npm install`. (If this triggers lots of
lines with errors, run `sudo npm install` instead, or send us an email).

Next, create a file named `app.js` in that folder and paste in the following:

```js
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);
```

Inside the `olinjs-2/` folder, run the command `node app`. While that's running,
go to `http://localhost:3000` in your web browser and you should see the following:

```
hello world
```

Great! You're so cool.

Express makes writing web servers in Node much easier. Here are some of the important differences between the examples you did in the book and Express:

* **Routing**. Instead of trying to parse the URL the user is at ourselves, we can just tell Express to match an individual path with a function.  
* **Sending a response**. Express takes care of setting many obvious response headers for you. Express will also handle sending files like images, music, audio, or `.html` files from a folder easily.
* **Handling templates (kinda).** We haven't gotten here yet, but we'll touch on this later. 

Let's go back to our `app.js`. We want more than just hello world. Let's make Express show the string `hello olin` when we go to `http://localhost:3000/olin`.

Delete what was in `app.js` and replace it with the following:

```js
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/olin', function(req, res){
  res.send('hello olin');
});

app.listen(3000);
```

So what does `app.get` do? It tells express that every time we have a `GET` request from a client (the browser). We'll learn more about this in Routing.

###Routing

Before we talk about routing, let's talk a bit about clients vs servers. For our purposes, we can think of **clients** as the things that view webpages, such as our browsers. On the other hand, **servers** are the things that give our browsers the things to render.

Routing is the process of serving up different pages for different urls. When you go to www.mycoolsite.com/ your computer goes out on the internet and asks mycoolsite's server for a page. Mycoolsite's server then sees that request and sends back information to your computer in the form of html. This html is then rendered on your browser.

If you go to www.mycoolsite.com/olin mycoolsite's servers obviously can't send you the same data it sent www.mycoolsite.com/. So mycoolsite's servers needs to differentiate ```/``` from ```/olin```. This process is known as routing.

In the Node beginner book, we did routing through something like 

```js
var pathname = url.parse(request.url).pathname;
route(handle, pathname, response, request);
```

Now, instead of us writing parsers for the route, in Express we can do something like 

```js
app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/olin', function(req, res){
  res.send('hello olin');
});
```

These two routes are for the index page (/) and the olin page (/olin). 

So what does `app.get` do? It tells express that we want to execute the second argument (the anonymous function) every time the server has a `GET` request at that specific route. The `GET` request is specified by the http standard. There are many more than just the `GET` request, and you can [view the entire list on wikipedia](http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). But for now, all you need to know are

* `GET` returns a resource (such as a message or an html page). This is used for when your browser wants to read information from a server.
* `POST` is used for when your browser wants to send information over to the server. For example, when you fill out an online form, that data is sent over to the server as `POST` data.


###Generating an Express app

Express also comes with a set of nifty tools to get you started. You can make a new Express app by going into a directory and running 

```
$ express

   create : .
   create : ./package.json
   create : ./app.js
   create : ./public
   create : ./public/javascripts
   create : ./public/images
   create : ./public/stylesheets
   create : ./public/stylesheets/style.css
   create : ./routes
   create : ./routes/index.js
   create : ./routes/user.js
   create : ./views
   create : ./views/layout.jade
   create : ./views/index.jade

   install dependencies:
     $ cd . && npm install

   run the app:
     $ node app
```

This creates a series of directories `public`, `routes`, and `views`. The public directory is used for client side assets such as images and client side javascript. Views are used to store the .jade template files which we will cover later. Right now our focus will be on the routes directory.

The routes directory holds all of the logic behind our routes. The actual routing is done in `app.js` with the following lines

```js
app.get('/', routes.index);
app.get('/users', user.list);
```

If you go to the `routes/index` file, you'll see

```js
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
```

###App configuration

There are some initial configurations we want our app to do, such as running on a specific port, using routes, and setting up the public directory. This is all done in the `app.configure` function.

```js
app.configure(function(){
  app.set('port', process.env.PORT || 3000); // sets up the port
  app.set('views', __dirname + '/views'); // sets the path for views
  app.set('view engine', 'jade'); // sets the engine that the views are rendered with
  app.use(express.favicon()); // default favicon
  app.use(express.logger('dev')); // error logging
  app.use(express.bodyParser()); // 
  app.use(express.methodOverride());
  app.use(app.router); // 
  app.use(express.static(path.join(__dirname, 'public'))); // sets the path for public files (css & js)
});
```

## Mongo

[MongoDB](http://en.wikipedia.org/wiki/Mongodb) is a NoSQL database system that stores data in a form similar to JSON. We'll be using it as our primary method of storage.

In order to use Mongo locally, we need to start up the Mongo [daemon](http://en.wikipedia.org/wiki/Daemon_(computing). Open up your terminal and type this in
```
$ mongod
all output going to: /usr/local/var/log/mongodb/mongo.log
```

As long as ```mongod``` is running, you'll be able to access your MongoDB locally through the default 27017 Mongo port and through your console. Access it through the console by opening up a new tab in your terminal and typing

```
$ mongo
MongoDB shell version: 2.2.0
connecting to: test
>
```

We can see all the dbs we have on our box by typing 

```
> show dbs
local (empty)
```

Let's create a new database and a new entry in that database.

```
> use test
switched to db test
> db.users.insert({'name':'alice'})
> db.users.find()
{ "_id" : ObjectId("51007865e481634f390b162f"), "name" : "alice" }
> db.users.insert({'name': 'bob', 'grade': 'A', 'assignments':[{1: 'A', 2: 'B'}]})
> db.items.find()
{ "_id" : ObjectId("51007865e481634f390b162f"), "name" : "alice" }
{ "_id" : ObjectId("510078bee481634f390b1630"), "name" : "bob", "grade" : "A", 
  "assignments" : [ { "1" : "A", "2" : "B" } ] }
> show dbs
local (empty)
test  0.203125GB
```

Mongo creates a database for us as soon as we start inserting items into it. It stores data in what's known as a `collection`. So in our case, users would be a collection. Items within a collection don't have to be consistant with each other (alice only has a name while bob has a name and a grade).

We can also delete items

```
> db.users.remove({'name': 'alice'})
> db.users.find()
{ "_id" : ObjectId("510078bee481634f390b1630"), "name" : "bob", "grade" : "A", 
  "assignments" : [ { "grade" : "A", "grade" : "B" } ] }
```

modify items

```
> db.users.update({'name': 'bob'}, {$set: {'class': 2013}})
> db.users.find()
{ "_id" : ObjectId("510078bee481634f390b1630"), "assignments" : [ { "grade" : "A", "grade" : "B" } ], 
  "class" : 2013, "grade" : "A", "name" : "bob" }
```

and search for items

```
> db.users.find({'grade': 'A'})
{ "_id" : ObjectId("510078bee481634f390b1630"), "assignments" : [ { "grade" : "A", "grade" : "B" } ], 
  "class" : 2013, "grade" : "A", "name" : "bob" }
```

There are loads more Mongo commands that can be found through [their documentation](http://docs.mongodb.org/manual/).

## Mongoose

[Mongoose](http://mongoosejs.com/) is a javascript wrapper for MongoDB that allows us to save javascript objects into our db without having to deal with the underlying Mongo commands. Install it by opening up a console and typing

```
npm install mongoose
```

You configure Mongoose to save objects using a [schema](http://mongoosejs.com/docs/guide.html). In a schema we define what kind of data we expect an object to have.

```js
var userSchema = mongoose.Schema({
    name: String,
    grade: String,
    class: Number
})
```

We can now use this schema to create and save users

```
var User = mongoose.model('User', userSchema);
var bob = new User({name: 'bob', grade: 'A', class: '2013'});
bob.save(function (err) {
  if (err)
    console.log("Problem saving bob", err);
});
```

## Deploying

If we want Heroku to use a MongoDB, we have to use a 3rd party extension, Mongolab. Mongolab gives you a small amount of space on their cloud database servers. You get a special [URI](http://en.wikipedia.org/wiki/URI) that you can use to connect to your Mongolab database. Fork this repo and type in

```
$ heroku create
Creating arcane-dusk-9739... done, stack is cedar
$ heroku addons:add mongolab:starter
Adding mongolab:starter on arcane-dusk-9739... done, v6 (free)
```

Now you can check the Heroku configuration variables to check the URI of your mongo instance
```
=== arcane-dusk-9739 Config Vars
MONGOLAB_URI: mongodb://heroku_app<app number>:<magic secret stuff>.mongolab.com:<port>/heroku_app<app number>
PATH:         bin:node_modules/.bin:/usr/local/bin:/usr/bin:/bin
```

The MONGOLAB_URI is the URI that you need to use to connect to your database. 
