const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generatemessage,generatelocationmessage} = require('./utils/message');
const {isRealSting} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3001;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  	//console.log('New user connected');

  

  	socket.on('join',(params,callback)=>{
  		if(!isRealSting(params.name) || !isRealSting(params.room)){
  			callback('name or room name require');
  		}
  		socket.join(params.room);

  		socket.emit('clientmessage',generatemessage('Admin','Welcome to chat app'));
  
  		socket.broadcast.to(params.room).emit('clientmessage',generatemessage('Admin', `${params.name} has joined`));

  		callback();
  	});


	socket.on('createlocationmsg',(coords) =>{
 		io.emit('clientlocationmessage',generatelocationmessage('Admin',coords.latitude,coords.longitude));
	});


  socket.on('message',(message,callback)=>{
   console.log('you have a new message:',message);
  
  	io.emit('clientmessage',generatemessage(message.from,message.text));
    callback();

  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

