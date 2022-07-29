var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apiRouter = require('./routes/api');
var app = express();
var cors = require('cors')
const io = require('socket.io')();

  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if (!origin) return callback(null,true)
    if(['http://localhost:3000', 'http://localhost:3006'].includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
} 

app.use(cors(corsOptions));
app.use('/api', apiRouter);
app.use(function(req, res, next){
  res.sendStatus(404);
});


module.exports = app;
