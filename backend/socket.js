/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const findRoomIdBySocketId = require('./lib/getRoomIdBySocketId');
const {db}=require('./utils/firebase');
const {generateRoomCode}=require('./utils/generateRoomCode');
module.exports=function Socket(io){
  io.on('connection',(socket)=>{
    const id=socket.id;//Fetches the unique id of the connecting socket
    socket.join(id);//Joins the specific room/channel identified by the socket's ID
    console.log('someone joined' + id);
    //handle room creation
    socket.on('createRoom',async(user)=>{
      const roomId=generateRoomCode();
      const existingRoom=await db.collection('rooms').doc(roomId).get();
      if(!existingRoom.exists){
        await db.collection('rooms').doc(roomId).set({owner:socket.id});
        console.log(`Room ${roomId} created by ${socket.id}`);
        socket.join(roomId);
    
        //store user data with socket.id as as the document key
       
        socket.emit('roomCreated',roomId);
        //emit the list of active users in the room
        

      }else{
        //room with this id already exist
        socket.emit('roomError','Room with this id already exist');
      }
    });
    //handle joining a room
    socket.on('joinRoom',async({roomId,user})=>{
      const existingRoom=await db.collection('rooms').doc(roomId).get();
        //room with this id doesn't exist
        if(!existingRoom.exists){
          socket.emit('roomError','room with this id doesnt exist');

        }
        
     
        else{
        //add participants to room
        const roomData=existingRoom.data();
        const roomUsersSnapshot=await db.collection('rooms').doc(roomId).collection('users').get();
        const roomUsers=roomUsersSnapshot.docs.map((doc)=>doc.data());
        
        if(roomUsers.length>=6){
          //room is already full//
          socket.emit('roomError','Room is already full');

        }else{
          //add the particpant to room
          if(!roomUsers.some((u)=>u.socketId===socket.id)){
            await db.collection('rooms').doc(roomId).collection('users').doc(socket.id).set(user);
            socket.join(roomId);
            console.log(`${socket.id} joined room ${roomId}`);
          }
          //update the list of all active users in room 
          const updateUsersSnapshot=await db.collection('rooms').doc(roomId).collection('users').get();
          const updateUsers=updateUsersSnapshot?.docs?.map((doc)=>doc?.data());
          const owner=await (await db.collection('rooms').doc(roomId).get()).data().owner;
          //console.log(owner);
          //emit the list of all active users to all users in the room
          io.to(roomId).emit('activeUsers',updateUsers);
          io.to(roomId).emit('setOwner',owner)
        }  
        

      }
    });
    try {
      await db
        .collection('rooms')
        .doc(roomId)
        .collection('users')
        .doc(socket.id)
        .delete();
    } catch (error) {
      console.error(error);
    }

      console.log(`${socket.id} left room ${roomId}`);

      try {
        const roomUsersSnapshot = await db
          .collection('rooms')
          .doc(roomId)
          .collection('users')
          .get();

        const updatedUsers = roomUsersSnapshot.docs.map((doc) => doc.data());

        if (updatedUsers.length === 0) {
          // If there are no users left in the room, delete the entire room
          await db.collection('rooms').doc(roomId).delete();
        } else {
          // If there are still users in the room, emit the updated list of users
          io.to(roomId).emit('activeUsers', updatedUsers);
        }
      } catch (error) {
        console.error(error);
      }
    });
    socket.on('gameStatus',(data)=>{
      const {roomId,status,timer,paragraph}=data;
      console.log(`Room ${roomId} game sttaus changes to ${status}`)
      io.to(roomId).emit('gameStatus',{status,timer,paragraph});
    })
    //handle progress update
    socket.on('progressUpdate',({roomId,progress})=>{
     
      io.to(roomId).emit('progressUpdate',{socketId:socket.id,progress});


    });
    //handle disconnection
    const handleDisconnect=async(socketId)=>{
      console.log(`User with ${socketId} disconnected`);
      //find the room where user was located
      const roomId = await findRoomIdBySocketId(socketId, db);

      try {
        await db
          .collection('rooms')
          .doc(roomId)
          .collection('users')
          .doc(socket.id)
          .delete();
      } catch (error) {
        console.error(error);
      }

      console.log(`${socket.id} left room ${roomId}`);

      // Get the updated list of active users in the room
      try {
        const roomUsersSnapshot = await db
          .collection('rooms')
          .doc(roomId)
          .collection('users')
          .get();

        const updatedUsers = roomUsersSnapshot.docs.map((doc) => doc.data());

        if (updatedUsers.length === 0) {
          // If there are no users left in the room, delete the entire room
          await db.collection('rooms').doc(roomId).delete();
        } else {
          // If there are still users in the room, emit the updated list of users
          io.to(roomId).emit('activeUsers', updatedUsers);
        }
      } catch (error) {
        console.error(error);
      }
    };
    //set up disconnection listener
    socket.on('disconnect',()=>{
      handleDisconnect(socket.id);
    })
  });
};

      
          