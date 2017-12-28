var generatemessage = (from,text)=>{
return {
	from,
	text,
	createdAt: new Date().getTime()
   };
};

var generatelocationmessage = (from,lat,lng)=>{
return {
	from,
	url:`https://www.google.com/maps?q=${lat},${lng}`,
	createdAt: new Date().getTime()
   };
};



module.exports  ={
 generatemessage,
 generatelocationmessage
};