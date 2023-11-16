/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const {db}=require('./utils/firebase');
const {generateRoomCode}=require('./utils/generateRoomCode');
module.exports=function Socket(io){
  io.on('connection',(socket)=>{
    const id=socket.id;//Fetches the unique id of the connecting socket
    socket.join(id);//Joins the specific room/channel identified by the socket's ID
    console.log('someone joined' + id);
    socket.on('send-message',({recipients,type,createdAt,roomId,sender})=>{});
   
    //handle room creation 
    const rooms={};
    socket.on('createRoom',({name,image})=>{
      const roomId=generateRoomCode();
      //if the room doesn't exist create it and add creator to it
      if(!rooms[roomId]){
        rooms[roomId]=[];//create an empty array for new room
        socket.join(roomId);
        console.log(`Room ${roomId} created by ${socket.id}`);

        //create a user with object,image and name
        const user={id:socket.id,name,image};
        //add users to list of active users in room
        rooms.roomId.push(user);
        socket.emit('roomCreated',roomId);
        //emit the list of active users in the room
        io.to(roomId).emit('activeUsers',rooms[roomId]);

      }else{
        //room with this id already exist
        socket.emit('roomError','Room with this id already exist');
      }
    });
    //handle joining a room
    socket.on('joinRoom',({roomId,name,image})=>{
      if(!rooms[roomId]){
        //room with this id doesn't exist
        socket.emit('roomError','room with this id doesnt exist');
      }else if(rooms[roomId].length>=6){
        //room is already full(max. of 6 participants)
        socket.emit('roomError','Room is full(6 participants)');
      }else{
        //add participants to room
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
        //create a object with name,image and id
        const user={id:socket.id,name,image};
        //add users to active list of users in room
        rooms.roomId.push(user);     
        //emit list of active users in room to all users in room
        io.to(roomId).emit('activeUsers',rooms[roomId]);

      }
    });
    //handle progress update
    socket.on('progressUpdate',(data)=>{
      const {roomId,progress}=data;
      //broadcast the progress to all active users in same room
      io.to(roomId).emit('progressUpdate',{userId:socket.id,progress});


    });
    //handle disconnection
    socket.on('disconnect',()=>{
      console.log(`User with ${socket.id} disconnected`);
      //remove the user from list of active users in the room
      for(const roomId in rooms){
        const index=rooms[roomId].findIndex((user)=>user.id===socket.id);
        if(index!==-1){
          rooms[roomId].splice(index,1);
          //emit the list of all active users in the room
          io.to(roomId).emit('activeUsers',rooms[roomId]);
          break;
        }
      }
    });
    //handle client request for active users in the room
    socket.on('getActiveUsers',(roomId)=>{
      //send the list of all active users in the requested room back to client
      if(rooms[roomId]){
        io.to(socket.id).emit('activeUsers',rooms[roomId]);
      }
      else{
        io.to(socket.id).emit('activeUsers',[]);
      }
    });
  });
};
