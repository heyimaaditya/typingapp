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
    )
  })
}