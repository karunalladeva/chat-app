var socket = io();

    socket.on('connect', function()  {
      console.log('Connected to server');

      
    });

    socket.on('disconnect', function() {
      console.log('Disconnected from server');
    });

   socket.on('clientmessage',(message)=>{

   	var formattime = moment(message.createdAt).format('h:mm a'); 
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
    	from : message.from,
    	text : message.text,
    	createdAt : formattime
 
    });
    jQuery('#messages').append(html);


   	// console.log('you have a new message:',message);
   	// var formattime = moment(message.createdAt).format('h:mm a'); 
   	// var li = jQuery('<li></li>');
   	// li.text(`${message.from} ${formattime} : ${message.text}`);
   	// jQuery('#messages').append(li);
   
   });
   
   socket.on('clientlocationmessage',(message)=>{

   	var formattime = moment(message.createdAt).format('h:mm a'); 
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
    	from : message.from,
    	url : message.url,
    	createdAt : formattime
 
    });
    jQuery('#messages').append(html);

   	// var li = jQuery('<li></li>');
   	// var a = jQuery('<a target="_blank">My Current Location </a>');
   	// li.text(`${message.from} ${formattime} : `);
   	// a.attr('href',message.url);
    // li.append(a);
   	// jQuery('#messages').append(li);
    
   });
    

    var locationbtn= jQuery('#send-location');
    locationbtn.on('click',function(){
     if(! navigator.geolocation){
     	return alert('browser not supported')
     }

     locationbtn.attr('disabled','disabled').text('Send Location ...');
     navigator.geolocation.getCurrentPosition(function(position){
        locationbtn.removeAttr('disabled').text('Send Location');
        socket.emit('createlocationmsg',{
         latitude : position.coords.latitude,
         longitude : position.coords.longitude
        });

     },function(){
     	alert('unable to fetch the location');
     	locationbtn.removeAttr('disabled').text('Send Location');
     });
    });

   var messageinput = jQuery('[name=message]');
     
    jQuery('#message-form').on('submit',function(e){
    	e.preventDefault();

    	socket.emit('message',{
    		from : 'user',
    		text : messageinput.val()
    	},function(){
    		messageinput.val('');
    	});
    });