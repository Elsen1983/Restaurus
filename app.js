//this part based on the book Express.js in Action (Chapter 8 )
//this is the main server file (index)

//dependencies
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");

//dependency for login part
var setUpPassport = require("./setuppassport");

//declare connection to routes
var routes = require("./routes");

//starting the express application here
var app = express();

//connection to mongoDB database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test", {useMongoClient:true});

//call setupPassport function
setUpPassport();

//declare the port as a variable
app.set("port", process.env.PORT || 3000);

//allows to use views directory
app.set("views", path.join(__dirname, "views"));

//setting the ejs as a templating engines (like Pug, HandlerBars ...etc)
app.set("view engine", "ejs");

//allows to use public folders
app.use(express.static(path.join(__dirname, "public")));

//node.js body parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//for password part
app.use(session({
    secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
    resave: true,
    saveUninitialized: true
}));

//flash dependency
app.use(flash());

//initializing the passport middleware
app.use(passport.initialize());
//starts the passport process
app.use(passport.session());

//allow to use routes for express.js application
app.use(routes);

//listens on port and starts the server application
app.listen(app.get("port"), function () {
   console.log("Server started on port " + app.get("port"));
});
