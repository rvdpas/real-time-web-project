# Real-time Web

## What's this repo about?
In this repository, you will find code to used for the end assignment of Real-time web. In this subject i've build real-time applications, which means that multiple users can visit the same url at the same time and see each others changes. An example of this is the chat application i've build in week 1.

## Socket.io
Socket.IO enables real-time bidirectional event-based communication. ~[Socket.io](https://socket.io/)

## Api
I've used the Twitter api to receive tweets of a users input. The first thing you need to do if you want to do this yourself is to create an app in the twitter settings on twitter.com. If you don't have an account yet, you can create it here. You will get an api and some tokens. To use this in our code we first need to require twitter.
```
var Twitter = require('twitter');
```
The next thing we need to do is saving our api key in an .env file. It looks like this:
```
var client = new Twitter({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token_key: ACCESS_TOKEN_KEY,
  access_token_secret: ACCESS_TOKEN_SECRET
});
```

To get the Tweets of a particular subject we can use the twitter get function:
```
client.get('search/tweets', {q: userInput}, function(err, tweets, res) {
 // code goes here
}

```

## How to work with Socket.io
To start of you should get the npm package in your server.js

```
var socketio = require('socket.io');
```

Socket.io has a function to detect if someone connected to your app
```

```
io.sockets.on('connection', function(socket) {
    console.log('A user connected to your app');
}
```

They also have a function if a user disconnects from your app
```
socket.on('disconnect', function(data) {
    console.log('A user disconnected from you app');
}
```
 

## Data life cycle


### Wishlist

### Tooling
- [Templating with EJS](http://www.embeddedjs.com/)
- [Twitter Api](https://www.npmjs.com/package/twitter)
- [Socket.io for real-time](https://socket.io/)

### Installation
Clone or download the repository  
```
git clone https://github.com/rvdpas/real-time-web-project.git
```

Run npm install in the root folder  
```
npm install
```

Start the server and visit the chat app on localhost:3000
```
node server.js
```

### Live
