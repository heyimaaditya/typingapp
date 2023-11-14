/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
module.exports=function Socket(io){
  io.on('connection',(socket)=>{
    const id=socket.id;//Fetches the unique id of the connecting socket
    socket.join(id);//Joins the specific room/channel identified by the socket's ID
    console.log('someone joined' + id);
    socket.on(
      'send-message',//Handles the 'send-message' event when received from a client
      ({recipients,type,content,createdAt,roomId,sender})=>{}
    );
    const rooms={};
    //handle room creation 
    socket.on('createRoom',({name,image})=>{
      const roomId=generateRoomCode();
      //if the room doesn't exist create it and add creator to it
      if(!rooms[roomId]){
        rooms[roomId]=[];//create an empty array for new room
        socket.join(roomId);
        console.log(`Room ${roomId} created by ${socket.id}`);
        // Create a user object with socket ID, name, and image
        const user = { id: socket.id, name, image };

        // Add user to the list of active users in the room
        rooms.roomId.push(user);
        socket.emit('roomCreated',roomId);
        // Emit the list of active users in the room to all users in the room
        io.to(roomId).emit('activeUsers', rooms[roomId]);
      }else{
        ///already exist
        socket.emit('roomError','Room with this ID already exist');
      }

    })
    //handle joining a room
    socket.on('joinRoom',({roomId,name,image,})=>{
      if(!rooms[roomId]){
        //doesnt exist
        socket.emit('roomError','Room with this ID doesnt exist')
      }else if(rooms[roomId].length>=6){
        //room is already full
        socket.emit('roomError','Room is already full')
      }else{
        //add participant to room 
       
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`)
        // Create a user object with socket ID, name, and image
        const user = {id:socket.id,name ,image};
        // Add user to the list of active users in the room
        rooms.roomId.push(user);
        // Emit the list of active users in the room to all users in the room
        io.to(roomId).emit('activeUsers', rooms[roomId]);
      }
    });
    //handle progress
    socket.on('progressUpdate',(data)=>{
      const {roomId,progress}=data;
      //broadcast the progress to all other users in the same room
      io.to(roomId).emit('progressUpdate',{userId:socket.id,progress});


    })
    //handle disconnection
    socket.on('disconnect',()=>{
      console.log(`User with ${socket.id} disconnected`);
      //remove the users form the list of users
      for(const roomId in rooms){
        const index=rooms[roomId].findIndex((user)=>user.id===socket.id);
        if(index!==-1){
          rooms[roomId].splice(index,1);
          //emit the list of all active users in the room to all users in the room
          io.to(roomId).emit('activeUsers',rooms[roomId]);
        }
      }
    });
    //handle client's request for active users in room
    socket.on('getActiveUsers',(roomId)=>{
      //send the list of all active users in the requested room back to client
      if(rooms[roomId]){
        io.to(socket.id).emit('activeUsers',rooms[roomId]);
      }else{
        io.to(socket.id).emit('activeUsers',[]);
      }
    })
  })
  //join online request handle
  //first define an array of rooms,where each room will be an object of duration and difficulty and room Id
  const onlineRooms=[];
  socket.on('joinRoom',({difficulty,duration})=>{
    //check if a room with same difficulty and duration exist or not 
    const existingRoom=onlineRooms.find((onlineRooms)=>onlineRooms.difficulty===difficulty && onlineRooms.duration===duration);
    if(existingRoom&&existingRoom.participants.length<existingRoom.size){
      //if there is an available room with available slots then add user to it
      existingRoom.participants.push(socket.id);
      socket.join(existingRoom.id);
      io.to(existingRoom.id).emit('roomJoined',{room:existingRoom});

    }else{
      //if there is no avilable rooms then add one 
      const newRoom={
        id : socket.id ,
        difficulty,
        duration,
        size :6,
        participants : [socket.id],
       }
       rooms.push(newRoom);
       socket.join(newRoom.id); // Join the new room on the socket.io level
       io.to(newRoom.id).emit('roomJoined', { room: newRoom });
      }
    });
    //handle disconnection 
    socket.on('disconnect', () => {
      console.log('User disconnected');
      // Remove the disconnected user from all rooms
      rooms.forEach((room) => {
        room.participants = room.participants.filter((participant) => participant !== socket.id);
      });
    });
  };


      