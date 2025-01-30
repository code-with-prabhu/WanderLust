const User = require("../models/user.js");

module.exports.signUp = (req, res) => {
    res.render("Authentication/signup.ejs");
};

module.exports.logIn = (req,res)=> {
    res.render("Authentication/login.ejs");
};


module.exports.signupForm = async (req, res)=> {
    try{
        let {username, email, password} = req.body;
    const newUser = new User({
        username,
        email,
    });
    await User.register(newUser, password);
    req.login(newUser, (err, next) => {
        if (err) {
            return next(err);
        }
        req.flash("Sucess", "Welcome to our page.");
        res.redirect("/listings");
    });
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
};

module.exports.loginForm = async(req,res)=> {
    req.flash("Sucess","Welcome Back to our Website.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut =  (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
    });
    req.flash("Sucess", "Logged Out Successfully.");
    res.redirect("/listings");
};
