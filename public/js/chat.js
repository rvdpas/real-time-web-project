var socket = io();
var tweetsHolder = $('.tweetsHolder ul')

function scrollToBottom () {
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	$('.chat__main .server-down').hide();
	$('.tweetsHolder ul li').remove();
	var params = $.deparam(window.location.search);

	socket.emit('join', params, function(err) {
		if (err) {
			alert(err)
			window.location.href = '/';
		}
	});
});

socket.on('disconnect', function() {
	$('.tweetsHolder ul li').remove();
	console.log(tweetsHolder)
	console.log('Disconnected from server');
	$('.chat__main').append('<div class="server-down">De server is offline en het is niet gelukt om te verbinden met de server.</div>');
});

socket.on('updateUserList', function(users) {
	var ol = $('<ul></ul>');

	users.forEach(function (user) {
		ol.append($('<li></li>').text(user));
	});

	$('#users').html(ol);
});

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('HH:mm');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

socket.on('new Tweet', newTweet);

// Create tweet shell and print it to the page
function newTweet(tweet) {
	if ($('#users ul li').length > 1) {
		$('.tweetsHolder ul li').remove();
	};

	var sortedTweets = tweet.statuses.filter(function(val) {
		return val.metadata.iso_language_code == 'en' || val.metadata.iso_language_code == 'nl';
	});
	sortedTweets = sortedTweets.slice(0, 3);

	sortedTweets.forEach(function(tweet) {
		console.log(tweet)

		var html = {
			text: tweet.text,
			user: tweet.user.screen_name
		};

		console.log(html)

		tweetsHolder.append($(`<li><span>${html.user}</span>${html.text}</li>`));
	});
};

$('#message-form').on('submit', function(e) {
	e.preventDefault();

	var messageTextbox = $('[name=message]');

	socket.emit('createMessage', {
		text: messageTextbox.val()
	}, function() {
		messageTextbox.val('');
	});
});