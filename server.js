// require modules
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var Twitter = require('twitter');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// configure dotenv
require('dotenv').config();

// create variable for user's input
var userInput = '';

var users = {};

// Set View Engine
app.set('view engine', 'ejs' );

// set dynamic files to public map
app.set('views', path.join(__dirname, 'views'));

// use body-parser for middle ware
app.use(bodyParser.urlencoded({ extended: false }));

// set static files to public map
app.use(express.static(path.join(__dirname, 'public')));

// Setting Twitter credentials
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// load index page
app.get('/', function(req, res) {
  res.render('index.ejs');
});

// Get search results
app.get('/results', function(req, res) {
  res.render('results.ejs');
});

io.sockets.on('connection', function(socket) {
  socket.on('send message', function(data) {
    io.sockets.emit('new message', {msg: data, nick: socket.nickname});
  });

  socket.on('new user', function(data, callback) {
    if (data in users) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
      updateNicknames();
    }
  });

  // updates nicknames if someone leaves or joins
  function updateNicknames() {
    io.sockets.emit('usernames', Object.keys(users));
  };

  socket.on('disconnect', function(data) {
    if (!socket.nickname) return;
    delete users[socket.nickname];
    updateNicknames();

    console.log('user disconnected');
    io.emit('disconnect');
  });
});

io.on('connection', function(socket) {
  socket.join('test');
});

// Post tweets to results page
app.post('/results', function(req, res) {
  room = userInput;
  userInput = '';
  userInput = req.body.hash;

  client.get('search/tweets', {q: userInput}, function(err, tweets, res) {
    io.emit('new tweet', tweets);
  });

  res.render('results.ejs');
});

server.listen(process.env.PORT || 8080, function() {
  console.log("Server started on port 8080...");
});
