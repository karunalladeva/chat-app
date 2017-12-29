const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generatemessage,generatelocationmessage} = require('./utils/message');
const {isRealSting} = require('./utils/validation');
const {Users} = require('./utils/user');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3001;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  	//console.log('New user connected');

  

  	socket.on('join',(params,callback)=>{
  		if(!isRealSting(params.name) || !isRealSting(params.room)){
  			return callback('name or room name require');
  		}

  		
      socket.join(params.room);
      users.removeuser(socket.id);
      users.adduser(socket.id,params.name,params.room);

      io.to(params.room).emit('updateuserlist',users.getuserbyroom(params.room));
      socket.emit('clientmessage',generatemessage('Admin','Welcome to chat app'));
   		socket.broadcast.to(params.room).emit('clientmessage',generatemessage('Admin', `${params.name} has joined`));

  		callback();
  	});


	socket.on('createlocationmsg',(coords) =>{
    var user = users.getuser(socket.id);
    if(user){
 		   io.to(user.room).emit('clientlocationmessage',generatelocationmessage(user.name,coords.latitude,coords.longitude));
	   }
  });


  socket.on('message',(message,callback)=>{
   // console.log('you have a new message:',message);
    var user = users.getuser(socket.id);

    if(user && isRealSting(message.text))
    {
    io.to(user.room).emit('clientmessage',generatemessage(user.name,message.text));
    }

    callback();

  });

  socket.on('disconnect', () => {
    // console.log('User was disconnected');
    var user = users.removeuser(socket.id);
    
    if(user)
    {
      io.to(user.room).emit('updateuserlist',users.getuserbyroom(user.room));
      io.to(user.room).emit('clientmessage',generatemessage('Admin',`${user.name} has left.`));
    }

  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

