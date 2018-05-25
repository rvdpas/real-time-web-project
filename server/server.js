const path = require('path');
const http = require('http');
const express = require('express');
var Twitter = require('twitter');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
var port = process.env.PORT || 8000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// configure dotenv
require('dotenv').config();

app.use(express.static(publicPath));

// Setting Twitter credentials
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.get('/', function(req, res) {
  res.render('index.html');
});

io.on('connection', (socket) => {
	socket.on('join', (params, callback) => {
		if (! isRealString(params.name) || ! isRealString(params.room)) {
			return callback('Name and room name are required');
		}

		client.get('search/tweets', {q: params.room}, function(err, tweets, res) {
			io.to(params.room).emit('new Tweet', tweets);
		});

		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);

		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		
		callback();
	});

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
		}
	});
});

server.listen(port, function() {
    console.log("App is running on port " + port);
});