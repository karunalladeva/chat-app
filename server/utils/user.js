
class Users{
	constructor(){
		this.users = [];
	}
	adduser(id,name,room)
	{
		var user ={id,name,room};
		this.users.push(user);
		return user;
	}
	removeuser(id)
	{
		var user =this.getuser(id);

		if(user){
	        this.users = this.users.filter((user)=>user.id !== id);
		}

        return user;
	}
	getuser(id)
	{
		 return this.users.filter((user)=> user.id === id)[0];
	}
	getuserbyroom(room)
	{
      var user=this.users.filter((user)=> user.room === room);
      var nameArray = user.map((user)=>user.name);
      return nameArray;
	}
}

module.exports={
	Users
}