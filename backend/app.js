const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const ratelimit=require('express-rate-limit')
const session=require('express-session')
app.use(bodyParser.json());//this middleware essentially uses for parsing json data from requets,allows  application to interpret and work with that data. 
app.use(cookieParser());//cookie-parser middleware helps parse the cookies attached to incoming requests. It extracts the cookie data, making it accessible within  application, allowing you to read and manipulate cookie values if needed. 
app.use(
  session({
    secret:'hellohowareyou',//used to sign the session ID cookie or It is a string that helps in encrypting the session.
    resave:true,//determines whether the session should be saved back to the session store even if the session was not modified during the request.
    saveUninitialized:true,//determines whether a session should be saved in the session store if it's new but hasn’t been modified
    cookie:{secure:true},//means the session cookie will only be sent over secure (HTTPS) connections
  })
)
//sets up a rate limiter middleware, which restricts the number of requests a client can make to the server within a specified time window. 
const limiter=ratelimit({
  max:15000,
  windowMs:60*60*1000,
  message:'Site is too busy , check after some time'
})
app.use('/api',limiter);
module.exports=app;
