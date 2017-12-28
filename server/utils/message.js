const moment = require('moment');

var generatemessage = (from,text)=>{
return {
	from,
	text,
	createdAt: moment().valueOf()
   };
};

var generatelocationmessage = (from,lat,lng)=>{
return {
	from,
	url:`https://www.google.com/maps?q=${lat},${lng}`,
	createdAt: moment().valueOf()
   };
};



module.exports  ={
 generatemessage,
 generatelocationmessage
};