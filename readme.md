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
![Data life cycle](https://github.com/rvdpas/real-time-web-project/blob/master/public/img/data-life-cycle.jpg)

## Proces
I started with brainstorming what kind of app to create. Last year i've tried something with the Spotify api, so this time I wanted something else. I got the idea of creating a chatroom based on interest with the Twitter API. Users would fill in a input field and based on the subject they would be placed in a room with likeminded. 

I created a basic starter package with Express, EJS and matching templates. The step I took next was trying to conenct with the Twitter API. In the Twitter docs i've found a lot of information and followed their guide on how to connect to the API. I had to create some keys to get the API key from Twitter.

```
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.get('search/tweets', {q: 'twitter'}, function(err, tweets, res) {

}
```

The results were based on a query that went along with the get request. I wanted to make it dynamic and based on the users input.
I created the form in the index.ejs

```
<h1>Enter a twitter subject</h1>
<form id="newHash" action="/results" method="POST">
    <input type="text" autofocus id="hash" name="hash" autocomplete="off" placeholder="Node, Trump, Ajax">
    <input type="submit" value="Enter hash">
</form>
``` 

```
var userInput = '';

client.get('search/tweets', {q: userInput}, function(err, tweets, res) {

}
```

The next step was to actually print the tweets based on the users input, so I created the newTweet function and used a socket to make it real time so multiple users could do the same search result.

Client:
```
socket.on('new tweet', newTweet);

// Create tweet shell and print it to the page
function newTweet(tweet) {
  var sortedTweets = tweet.statuses.filter(function(val) {
    return val.metadata.iso_language_code == 'en' || 'nl';
  });
  sortedTweets = sortedTweets.slice(0, 3);

  sortedTweets.forEach(function(tweet) {
    tweetsHolder.insertAdjacentHTML('afterbegin', '<li><strong>' + tweet.user.screen_name + '</strong>: ' + tweet.text + '</li>');
  });
};
```

Server.js
```
client.get('search/tweets', {q: userInput}, function(err, tweets, res) {
io.emit('new tweet', tweets);
});
```

Then I had to create a way to make a chat based on the users input. I've created the chat structure and linked the server with the client.

Client.js
```
socket.on('new message', function(data) {
  var p = document.createElement("p");
  p.innerHTML = '<strong>' + data.nick + ': </strong>' + data.msg + '<br>';
  chat.appendChild(p);
});
```

Server.js
```
socket.on('send message', function(data) {
    io.sockets.emit('new message', {msg: data, nick: socket.nickname});
});
``` 

To make sure everybody had an original username i've added the following code

Client.js
``` 
socket.on('usernames', function(data) {
  var html = '';

  for (var i = 0; i < data.length; i++) {
    if (html.indexOf(data[i]) != -1) {
      return;
    }
    html += data[i] + '<br>';
  }
  users.innerHTML = '<strong>Online users:</strong> <br>' + html;
});

socket.emit('new user', nicknameInput.value, function(data) {
if (data) {
  nicknameWrapper.style.display = 'none';
  chat.style.display = 'block';
  users.style.display = 'block';
} else {
  nicknameWrapper.insertAdjacentHTML('afterbegin', '<p>Username is al in gebruik');
}
});
```

Server.js
```
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

```

### Wishlist
- Private rooms per subject
- Better UI styles

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
[live](https://rtw-twitter-app.herokuapp.com/)
