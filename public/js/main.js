var socket = io();

var tweetsHolder = document.querySelector('#tweetsHolder');
var countries = [];
var countryHolder = document.querySelector('#countryHolder');

socket.on('new tweet', newTweet);

// Create tweet shell and print it to the page
function newTweet(tweet) {
  tweetsHolder.insertAdjacentHTML('afterbegin', '<li><strong>' + tweet.user.screen_name + '</strong>: ' + tweet.text + '</li>');
  countries += tweet.lang + ',';
  countries = countries.split(",");

  count = 0;

  function containsEN() {
    if (countries.indexOf("en") > -1) {
      count = count + 1;
    }
  }
  containsEN();

}

// when the counter updates, update the counter by one
socket.on('update counter', function(counter) {
  var counterElement = document.querySelector('.counter')
  counterElement.innerHTML = 0;
  counterElement.innerHTML = counter;
});

// If the server is offline, alert the user.
socket.on('disconnect', function() {
  var h2 = document.querySelector('h2');
  h2.insertAdjacentHTML('afterend', '<div class="server-down">De server is offline en het is niet gelukt om te verbinden met de server.</div>');
});
