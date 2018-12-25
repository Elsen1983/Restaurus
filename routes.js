//necessary dependencies
var express = require("express");
var app = express();
var User = require("./models/user");
var Restaurants = require("./models/restaurant");
var passport = require("passport");

// response to client request
var router = express.Router();

//for use local images from folder
//https://www.quora.com/How-do-I-call-an-image-from-the-existing-folder-using-Node-JS-and-display-on-the-front-end
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

/*
 ---------- USER -----------
*/

//check the user logged in
function ensureAuthenticated(req, res, next) {
    //if user is logged in
    if (req.isAuthenticated()) {
        //do the next "job"
        next();
    }
    //user not logged in
    else {
        //show error message
        req.flash("info", "You must be logged in to see this page");
        //and redirect to login page
        res.redirect("/login");
    }
}

//prepare the possible flashes containers
router.use(function (req, res, next) {
    //allows to use current username as a variable
    res.locals.currentUser = req.user;
    //notifications about flashes
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

//router for login
router.get("/login", function (req, res) {
    //renders login page
    res.render("login");
});

//POST route for login redirection
router.post("/login", passport.authenticate("login", {
    //when user is logged in redirect to home (/)
    successRedirect: "/",
    //or when user login details are wrong (or one from them) then load the login page again
    failureRedirect: "/login",
    //enable the error flash container (failureFlash build in middleware)
    failureFlash: true
}));

//router for logout a user
router.get("/logout", function (req, res) {
    //logs out the user (build in function)
    req.logout();
    //then redirect to home page
    res.redirect("/");
});

//router for signUp page
router.get("/signup", function (req, res) {
    //renders the setUp page
    res.render("signup");
});

//POST route for signUp
router.post("/signup", function (req, res, next) {
    //declare a local variable (username) and assign the text from the body username field to this variable
    var username = req.body.username;
    //declare a local variable (password) and assign the text from the body password field to this variable
    var password = req.body.password;

    var nickname = req.body.nickname;

    //using the build in findOne function from the User model
    //SHOW pic showCollectionOfUsersInMongoDB.jpg
    User.findOne({username: username}, function (err, user) {
        //if any unexpected error happening ...
        if (err) {
            return next(err);
        }
        //if username is in the database
        if (user) {
            //then that mean duplication, so error message display
            req.flash("error", "User already exists");
            //and reload the signUp page
            return res.redirect("/signup");
        }

        //if user is not in the database then create a new user
        var newUser = new User({
            username: username,
            password: password,
            displayName: nickname
        });

        //save the new user into the currently used database
        newUser.save(next);
    });
    //then now go to ...
}, passport.authenticate("login", {
    // to home page
    successRedirect: "/",
    //or if any error happened then to signUp page
    failureRedirect: "/signup",
    //enable the error flash container (failureFlash build in middleware)
    failureFlash: true
}));

//list all the users in the database
router.get("/users", function (req, res, next) {
    //so it is sorting the users based on registering date
    User.find().sort({username: "descending"}).exec(function (err, users) {
        if (err) {
            return next(err);
        }
        //rendering the users page
        res.render("users", {users: users});
    });
});

//GET profile route
router.get("/users/:_id", function (req, res, next) {
    //using the build in findOne function from the User model
    User.findOne({_id: req.params._id}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(404);
        }
        res.render("profile", {user: user})
    });
});


//get the edis page
router.get("/edit", ensureAuthenticated, function (req, res) {
    res.render("edit");
});

//post route for updating the user personal profile
//add bio and/or change displayed name
router.post("/edit", ensureAuthenticated, function (req, res, next) {
    req.user.username = req.body.username;
    req.user.displayName = req.body.displayName;
    req.user.bio = req.body.bio;
    req.user.save(function (err) {
        if (err) {
            next(err);
            return;
        }
        req.flash("info", "Profile updated!");
        res.redirect("/");
    });
});
//for save restaurant as favourite
router.post("/edit/favourite", ensureAuthenticated, function (req, res, next) {
    req.user.favourite = req.body.favourite;

    req.user.update(
        { "$push": { "favourite" : req.body.favourite } },function (err, numAffected) {
            if (err) throw err;
            console.log("updated n docs: %s", numAffected);
        }
    );
        req.flash("info", "Restaurant saved as favourite");
        //redirect to same page where the post used
        res.redirect(req.get('referer'));
});

router.get("/", function (req, res, next) {
    res.render("index");
});


/*
 ---------- RESTAURANT -----------
*/
//restaurants by name ordering
router.get("/restaurants/name", function (req, res) {
    console.log("Name called");
    Restaurants.find().sort({name: "ascending"}).exec(function (err, restaurants) {
        if (err) {
            return next(err);
        }
        //rendering the users page
        res.render("restaurants", {restaurants: restaurants});
    });
});
//restaurants by neighbourhood
router.get("/restaurants/neighborhood", function (req, res) {
    console.log("Neighborhood called");
    Restaurants.find().sort({neighborhood: "ascending"}).exec(function (err, restaurants) {
        if (err) {
            return next(err);
        }
        //rendering the users page
        res.render("restaurants", {restaurants: restaurants});
    });
});
//restaurants by cuisine
router.get("/restaurants/cuisine", function (req, res) {
    console.log("Cuisine called");
    Restaurants.find().sort({cuisine_type: "ascending"}).exec(function (err, restaurants) {
        if (err) {
            return next(err);
        }
        //rendering the users page
        res.render("restaurants", {restaurants: restaurants});
    });
});
//restaurants by search regexp
router.post("/restaurants/regexSearch", function (req, res, next) {
    console.log("regexSearch called");
    let regName = req.body.searchResult;
    //https://xuguoming.wordpress.com/2015/02/11/using-variable-regex-with-mongodb-query-in-node-js/
    //https://docs.mongodb.com/manual/reference/operator/query/regex/
    Restaurants.find( {name: {$regex: new RegExp(regName, 'i')}}).exec(function (err, restaurants) {
        if (err) {
            return (err);
        }
        //rendering the users page
        res.render("restaurants", {restaurants: restaurants});
    });
});

router.get("/restaurants/:name", function (req, res, next) {
    //using the build in findOne function from the User model
    Restaurants.findOne({name: req.params.name}, function (err, restaurant) {
        if (err) {
            return next(err);
        }
        if (!restaurant) {
            return next(404);
        }
        res.render("restaurant", {restaurant: restaurant})
    });
});

router.get("/about", function (req, res) {
    res.render("about");
});


//WORKS
//push the textArea value into the review array
router.post("/restaurants/:id", function (req, res) {
    //create the new array what we want to push into the database as review
    let rev = {
        rating: req.body.rating,
        comments: req.body.comment,
        name: req.body.name,
        date: new Date(Date.now()).toLocaleString()
    };
    //update the selected restaurant (by id) --> $push new into reviews
    Restaurants.updateOne(
        {"id": req.params.id},
        {"$push": {"reviews": rev} },
        function (err, numAffected) {
            if (err) throw err;
            console.log("updated n docs: %s", numAffected);
        }
    );
    req.flash("info", "Review added!");
    res.redirect("/restaurants/name");
});


//exporting the routes and make it available for other files
module.exports = router;