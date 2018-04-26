var socket = io();

var tweets = document.querySelector('.tweets');
var tweetsHolder = document.querySelector('#tweetsHolder');
var tweetInterest = document.querySelector('#newHash');
var nicknameForm = document.querySelector('#setNickname');
var nicknameInput = document.querySelector('#nickname');
var nicknameWrapper = document.querySelector('.nicknameWrapper');
var users = document.querySelector('.users')
var messageForm = document.querySelector('#send-message');
var messageBox = document.querySelector('#message');
var chat = document.querySelector('#chat');

messageForm.addEventListener("submit", function(e) {
  e.preventDefault();

  socket.emit('send message', messageBox.value);
  console.log(messageBox);
  messageBox.value = '';
  console.log(messageBox)
});

socket.on('new message', function(data) {
  var p = document.createElement("p");
  p.innerHTML = '<strong>' + data.nick + ': </strong>' + data.msg + '<br>';
  chat.appendChild(p);
});

nicknameForm.addEventListener("submit", function(e) {
  e.preventDefault();

  socket.emit('new user', nicknameInput.value, function(data) {
    if (data) {
      nicknameWrapper.style.display = 'none';
      chat.style.display = 'block';
      users.style.display = 'block';
    } else {
      nicknameWrapper.insertAdjacentHTML('afterbegin', '<p>Username is al in gebruik');
    }
  });
  nicknameInput.value = '';
});

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

// If the server is offline, alert the user.
socket.on('disconnect', function() {
  var h2 = document.querySelector('.tweets');
  h2.innerHTML = '<div class="server-down">De server is offline en het is niet gelukt om te verbinden met de server.</div>';
});
