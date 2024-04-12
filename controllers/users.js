const User = require("../models/user.js");

module.exports.renderSignup=(req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password} = req.body;
        //console.log(username,email,password);
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        //did to keep the user looged in whi signed in  -but not workin
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        });
       // req.flash("success", "Welcome to Wanderlust!");
        //res.redirect("/listings");
        //res.redirect(req.session.redirectUrl);
    }
    catch (err) {

        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin=(req, res) => {
    res.render("./users/login.ejs");
};

module.exports.login=async (req, res) => {
    req.flash("success","Welcome to Wanderlust!!");
    //res.redirect("/listings");
   // console.log(res.locals.redirectUrl);
   let redirectUrl=res.locals.redirectUrl||"/listings";
   res.redirect(redirectUrl);
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    });
};