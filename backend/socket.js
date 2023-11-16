/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
        await db.collection('rooms').doc(roomId).set({});
        console.log(`Room ${roomId} created by ${socket.id}`);
        socket.join(roomId);
    
        //store user data with socket.id as as the document key
        await db.collection('rooms').doc(roomId).collection('users').doc(socket.id).set(user);
        const usersSnapshot=await db.collection('rooms').doc(roomId).collection('users').get();
        const users=usersSnapshot.docs.map((doc)=>doc.data());
        socket.emit('roomCreated',roomId);
        //emit the list of active users in the room
        io.to(roomId).emit('activeUsers',users);

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
        socket.join(roomId);
        if(roomUsers.length>=6){
          //room is already full//
          socket.emit('roomError','Room is already full');

        }else{
          //add the particpant to room
          if(!roomUsers.some((u)=>u.id===user.id)){
            await db.collection('rooms').doc(roomId).collection('users').doc(socket.id).set(user);
            console.log(`${socket.id} joined room ${roomId}`);
          }
          //update the list of all active users in room 
          const updateUsersSnapshot=await db.collection('rooms').doc(roomId).collection('users').get();
          const updateUsers=updateUsersSnapshot.docs.map((doc)=>doc.data());
          //emit the list of all active users to all users in the room
          io.to(roomId).emit('activeUsers',updateUsers);
        }  
        

      }
    });
    //handle progress update
    socket.on('progressUpdate',(data)=>{
      const {roomId,progress}=data;
      //broadcast the progress to all active users in same room
      io.to(roomId).emit('progressUpdate',{userId:socket.id,progress});


    });
    //handle disconnection
    const handleDisconnect=async(socketId)=>{
      console.log(`User with ${socketId} disconnected`);
      //find the room where user was located
      const roomsRef=db.collection('rooms');
      const snapshot=await roomsRef.where(`users.${socketId}`,'!=',null);
      snapshot.forEach(async(doc)=>{
        const roomId=doc.id;
        //remove user from disconnection
        await db.collection('rooms').doc(roomId).collection('users').doc(socketId).delete();
        //get the updated list of all active users in the room
        const roomUsersSnapshot=await db.collection('rooms').doc(roomId).collection('users').get();
        const updateUsers=roomUsersSnapshot.docs.map((doc)=>doc.data());
        //emit the list of all active users in the same room
        io.to(roomId).emit('activeUsers',updateUsers);

      })
    };
    //set up disconnection listener
    socket.on('disconnect',()=>{
      handleDisconnect(socket.id);
    })
  });
};

      
          