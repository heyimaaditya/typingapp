/* eslint-disable no-global-assign */
const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');

//code for CORS(croos-origin resource sharing)
//defining a middleware 'allowcrossdomain' which handle req,res and next (middleware function) 
var allowcrossdomain=function(req,res,next){
  let allowedOrigins=['http://localhost:3000','http://localhost:5000'];
  origin=req.headers.origin;
  if(allowedOrigins.includes(origin)){
    res.header('Access-Control-Allow-Orign',origin);

  }
  res.header('Access-Control-Allow-Methods','GET,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers','Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
}
app.use(allowcrossdomain);

module.exports=app;
