const express	= require('express');
const app		= express();
const http		= require('http');
const server	= http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const LISTEN_PORT = 8080;
const ABS_STATIC_PATH	= __dirname + '/public';

let playerNumber = 0;
//set our routes
app.get('/', function(req, res) {
	res.sendFile('index.html', {root:ABS_STATIC_PATH});
});

io.on('connection', (socket) => {
	console.log('a user connected');
	
	playerNumber++;
	io.sockets.emit('new_player', playerNumber);

	socket.on('disconnect', () =>{
		playerNumber--;
		console.log('a user disconnected');
	});

	socket.on('floor', (data, color) => {
		console.log('wall event received');
		io.sockets.emit('wall_make', data, color);
	});

	socket.on('join_team', (data) => {
		io.sockets.emit('set_team', data);
	});
});

server.listen(LISTEN_PORT);
app.use(express.static(ABS_STATIC_PATH));
console.log("Listening on port:" + LISTEN_PORT);

//let over var
