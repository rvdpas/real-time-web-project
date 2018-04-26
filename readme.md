# Real-time Web

## What's this repo about?
In this repository, you will find code to used for the end assignment of Real-time web. In this subject i've build real-time applications, which means that multiple users can visit the same url at the same time and see each others changes. An example of this is the chat application i've build in week 1.

## Sockets
WebSockets is an advanced technology that makes it possible to open an interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply. ~[mdn](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## Api
I've used the Twitter api to receive twitters stream of a users input. The first thing you need to do if you want to do this yourself is to create an app in the twitter settings on twitter.com. If you don't have an account yet, you can create it here. You will get an api and some tokens. To use this in our code we first need to require twitter.
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

To get the Tweets of a particular subject we can use the twitter steam function:
```
var stream = client.stream('statuses/filter', {track: 'javascript'});
stream.on('data', function(event) {
  console.log(event && event.text);
});
 
stream.on('error', function(error) {
  throw error;
});
 
// You can also get the stream in a callback if you prefer. 
client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
  stream.on('data', function(event) {
    console.log(event && event.text);
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});
```

## Data life cycle
1. The users fills in an subject he wants to see tweets about. 
2. This will load the results page.
3. At the same time a request is send to the Twitter api to receive data about the users input.
4. The data is printed on the page, starting at the top and loading the newest one at the bottom.\
5. Everytime a new tweet is loaded, the counter will go up by one.
6. The users see's new tweets about his input and see's how many tweets are giving back by the Api

### Wishlist
- Load newest tweets on top instead of below every tweet.
- Visualize the data in a graph with D3.js.
- Get multiple subjects at ones and update multiple counters to see which tweet is more popular.
- Get missed data after being offline.

### Tooling
- [Templating with EJS](http://www.embeddedjs.com/)
- [Twitter Api](https://www.npmjs.com/package/twitter)
- [Socket.io for real-time](https://socket.io/)

### Installation
Clone or download the repository  
```
git clone https://github.com/rvdpas/real-time-web.git
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
