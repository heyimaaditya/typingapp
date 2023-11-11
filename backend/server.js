import React from "react";
require('dotenv').config({path:'.env'});
// sets up an event listener for the 'uncaughtException' event in the Node.js .
process.on('uncaughtException',(error)=>{
  console.log('uncaught Exception=>shutting down...')
  console.log(error.name,error.message);
  process.exist(1);// method immediately terminates the Node.js process with an exit code of 1
})
const app=require('./app')
let http=require('http')
const server=http.createServer(app)// create an HTTP server that will be used to handle HTTP requests
const {Server}=require('socket.io')
//This code below ensures that the Socket.IO server only accepts WebSocket connections from the origin (http://localhost:3000) and restricts allowed HTTP methods to GET and POST for these WebSocket connections.
const io= new Server(server,{
  cors:{
    origin:'http://localhost:3000',
    methods:['GET','POST'],
  }
})
require('./socket')(io);
const port=process.env.PORT||5000;
server.listen(port,()=>{
  console.log(`server is running on ${port}`)
})
//// handle Globaly  the unhandle Rejection Error which is  outside the express
process.on('unhandledRejection', (error) => {
  // it uses unhandledRejection event
  // using unhandledRejection event
  console.log(' Unhandled Rejection => shutting down..... ');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1); //  emidiatly exists all from all the requests sending OR pending
  });
});