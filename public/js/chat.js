var socket = io();

  function scrollToBottom(){
    var message =  jQuery('#message')
    var newmessage = message.children('li:last-child');

    var clientHeight = message.prop('clientHeight');
    var scrollTop = message.prop('scrollTop');
    var scrollHeight = message.prop('scrollHeight');
    var newMessageHeight = newmessage.innerHeight();
    var lastMessageHeight = newmessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
            message.scrollTop(scrollHeight);
    }
  }


    socket.on('connect', function()  {
      var params = jQuery.deparam(window.location.search);

    socket.emit('join',params,function(err){
      if(err){
        alert(err);
              window.location.href='/';
      }else{

      }
    });      
    });

    socket.on('disconnect', function() {
      console.log('Disconnected from server');
    });

    socket.on('updateuserlist',function(users){
      // console.log('user list',users);
      var ol=jQuery('<ol></ol>');

      users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
      });
      jQuery('#users').html(ol);
    });

   socket.on('clientmessage',(message)=>{

    var formattime = moment(message.createdAt).format('h:mm a'); 
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
      from : message.from,
      text : message.text,
      createdAt : formattime
 
    });
    if(message){
        notifyMe(message.from,message.text);
      }
    // }
    jQuery('#messages').append(html);
    scrollToBottom();

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
    scrollToBottom();
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
        // from : 'user',
        text : messageinput.val()
      },function(){
        messageinput.val('');
      });
    });

function notifyMe(user,msg) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(user+': '+msg);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(user+': '+msg);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

Notification.requestPermission().then(function(result) {
  console.log(result);
});function spawnNotification(body, icon, title) {
  var options = {
      body: body,
      icon: icon
  };
  var n = new Notification(title, options);
}