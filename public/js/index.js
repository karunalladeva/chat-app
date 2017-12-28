var socket = io();

    socket.on('connect', function()  {
      console.log('Connected to server');

      
    });

    socket.on('disconnect', function() {
      console.log('Disconnected from server');
    });

    socket.on('clientmessage',(message)=>{
   console.log('you have a new message:',message);
   var li = jQuery('<li></li>');
   li.text(`${message.from} : ${message.text}`);
   jQuery('#messages').append(li);
  });

    jQuery('#message-form').on('submit',function(e){
    	e.preventDefault();

    	socket.emit('message',{
    		from : 'user',
    		text : jQuery('[name=message]').val()
    	},function(){

    	});
    });