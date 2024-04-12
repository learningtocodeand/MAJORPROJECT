const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");
const user = require("../models/user.js");

//signup
router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));


router.route("/login")
.get( userController.renderLogin)
.post(saveRedirectUrl,
passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);


router.get("/logout",userController.logout);

module.exports = router;