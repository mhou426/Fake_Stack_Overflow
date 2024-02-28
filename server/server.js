// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors');
const session = require("express-session");
const MongoStore = require("connect-mongo");
//const cookieParser = require('cookie-parser');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const Question = require('./models/questions');
const Answer = require('./models/answers');
const Tag = require('./models/tags');
const User = require('./models/users');
const Comment = require('./models/comments');

const app = express();
const port = 8000;
const secret_ = process.argv[2];
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
//const temp = await db.collection('questions').find();
//console.log(temp);
db.on('error', (err) => {
    console.error('Database connection error:', err);
  });

db.once('open', () => {
    console.log('Connected to the database');
  
});


//      secure: true,
//maxAge: 2 * 60 * 60 * 1000, // Set the cookie to expire in 2 hrs (milliseconds)
//httpOnly: true
//cookie
app.use(
  session({
    secret: `${secret_}`,
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/sessions'})
  })
);

// Define routes here
const router = require('./routers');
app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});