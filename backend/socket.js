/* eslint-disable no-unused-vars */
import React from "react";
module.exports=function Socket(io){
  io.on('connection',(socket)=>{
    const id=socket.id;//Fetches the unique id of the connecting socket
    socket.join(id);//Joins the specific room/channel identified by the socket's ID
    console.log('someone joined' + id);
    socket.on(
      'send-message',//Handles the 'send-message' event when received from a client
      ({recipients,type,content,createdAt,roomId,sender})=>{}
    );
    const rooms=[];
    //handle room creation 
    socket.on('createRoom',(roomId)=>{
      const roomId=generateRoomCode();
      //if the room doesn't exist create it and add creator to it
      if(!rooms[roomId]){
        rooms[roomId]=[socket.id];
        socket.join(roomId);
        console.log(`Room ${roomId} created by ${socket.id}`);
      }else{
        ///already exist
        socket.emit('roomError','Room with this ID already exist');
      }

    })
    //handle joining a room
    socket.on('joinRoom',(roomId)=>{
      if(!rooms[roomId]){
        //doesnt exist
        socket.emit('roomError','Room with this ID doesnt exist')
      }else if(rooms[roomId].length>=6){
        //room is already full
        socket.emit('roomError','Room is already full')
      }else{
        //add participant to room 
        rooms[roomId].push(socket.id)
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`)
      }
    })
  })
}