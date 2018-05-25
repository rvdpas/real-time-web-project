# Real-time Web

## What's this repo about?
In this repository, you will find code used for the end assignment of Real-time web. In this subject i've build real-time applications, which means that multiple users can visit the same url at the same time and see each others changes. An example of this is the chat application i've build in week 1.

## The app
The application that i've build is a discussion platform. The user must select a username and a topic they would like to chat about. 

![Login screen](https://github.com/rvdpas/real-time-web-project/blob/master/public/img/login.png)

After they have logged in, they will join a room based on the given interest. On the left you will see the users that also joined the chat. On the right side it will load a few tweets about your interest and this you could start a discussion about the topic and / or the tweets.

![Chat screen](https://github.com/rvdpas/real-time-web-project/blob/master/public/img/chat.png)

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
client.get('search/tweets', {q: 'Subject'}, function(err, tweets, res) {
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

I created a basic starter package with the Express.js. The step I took next was trying to connect with the Twitter API. In the Twitter docs i've found a lot of information and followed their guide on how to connect to the API. I had to create some keys to get the API key from Twitter. To keep them save so nobody else can use them I used the dotenv package.

To use the dotenv package, you have to install it

```
npm install dotenv
```

Then you have to require it in your server
```
require('dotenv').config();
```

You can use the dotenv as shown below. Create a .env file in your root and save the actual values there.
```
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
```

The Twitter results were based on a query that went along with the get request. I wanted to make it dynamic and based on the users input.
I created the form in the index.html

```
<form action="/chat.html">
  <div class="form-field">
    <h3>Join a chat</h3>
  </div>
  <div class="form-field">
    <label>Display name</label>
    <input type="text" name="name" autofocus />
  </div>
  <div class="form-field">
    <label>Topic name</label>
    <input type="text" name="room" />
  </div>
  <div class="form-field">
    <button>Join</button>
  </div>
</form>
``` 

```
$('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val('');
  });
});
```

After submitting the form the data would be printed in the url and would look like this:
```
?name=Rob&room=Trump
```

This isn't very usefull so I used a librairy to make it easer to structure the data.
```
/**
 * jQuery.deparam - The oposite of jQuery param. Creates an object of query string parameters.
 *
 * Credits for the idea and Regex:
 * http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
*/
(function($){
  $.deparam = $.deparam || function(uri){
    if(uri === undefined){
      uri = window.location.search;
    }
    var queryString = {};
    uri.replace(
      new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"),
        function($0, $1, $2, $3) {
          queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
        }
      );
      return queryString;
    };
})(jQuery);
```
This would make it so i could use it in an object form
```
var params = $.deparam(window.location.search);
```
The line above would make the data look like this:
 ```
 {name: "Rob", room: "Trump"}
```
Now I could get the data in the server to make an request to the Twitter api.
```
client.get('search/tweets', {q: params.room}, function(err, tweets, res) {

});
```

The next step was to actually print the tweets based on the users input, so I created the newTweet function and used a socket to make it real time so multiple users could do the same search result.

Client:
```
socket.on('new tweet', newTweet);

function newTweet(tweet) {
  if ($('#users ul li').length > 1) {
    $('.tweetsHolder ul li').remove();
  };

  var sortedTweets = tweet.statuses.filter(function(val) {
    return val.metadata.iso_language_code == 'en' || val.metadata.iso_language_code == 'nl';
  });
  sortedTweets = sortedTweets.slice(0, 3);

  sortedTweets.forEach(function(tweet) {
    var html = {
      text: tweet.text,
      user: tweet.user.screen_name
    };

    tweetsHolder.append($(`<li><span>${html.user}</span>${html.text}</li>`));
  });
};
```

Server.js
```
client.get('search/tweets', {q: userInput}, function(err, tweets, res) {
    io.emit('new tweet', tweets);
});
```

When this worked I created the socket connection to make it able to for multiple user to send messages.
Client:
```
io.on('connection', (socket) => {
    socket.on('newMessage', function(message) {
      var formattedTime = moment(message.createdAt).format('HH:mm');
      var template = $('#message-template').html();
      var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
      });
    
      $('#messages').append(html);
    });
}
```

I used a librairy called moment to format the time. And a another librairy to dynamic print to the page called Mustache.

To check if the text that they entered was valid, I wrote a function to check if it was a string and it wasn't all spaces.
```
var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {isRealString};
````

To use this in the server.js I had to require it
```
const {isRealString} = require('./utils/validation');

socket.on('createMessage', (message, callback) => {
  var user = users.getUser(socket.id);

  if (user && isRealString(message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  }
  
  callback();
});
```

### Users
I created a few methods to make it easier to work with users
```
class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};
```

### Rooms
To use Socket.io rooms I first had to setup the following:
```
socket.on('join', (params, callback) => {
    socket.join(params.room);
}
```

To make sure the user is send to the correct room you need to define the room before emiting:
```
io.to(params.room).emit('updateUserList', users.getUserList(params.room));
```

To show when a new user joined a room the admin will show a welcome message
```
socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
```

If there is allready someone in the room, it will show the person who joined first that someone has joined
```
socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));
```

### Disconnecting
If a user disconnects because of the server, the user will be removed from the userlist. It will show a message to the other users in the chat that the user left the room.

### Wishlist
- Unique names for users

### Tooling
- [Jquery](https://jquery.com/)
- [Mustache](https://github.com/janl/mustache.js/)
- [Moment](https://momentjs.com/)
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
npm start
```

### Live
[live](https://rtw-herk-app.herokuapp.com/)