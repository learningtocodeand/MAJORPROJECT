const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema} = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    //console.log(req.path,"..",req.originalUrl);//req.useru can check if u r logged in or not thus can be used in styling
    if(!req.isAuthenticated()){
        //redirectUrl save
        
        req.session.redirectUrl = req.originalUrl;
       // console.log(req.session.redirectUrl,"in log");
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}
//in order to save re.se.red which will be undefined as ligon resets the value

module.exports.saveRedirectUrl=(req,res,next)=>{
    console.log(req.session.redirectUrl,"in save");
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        //console.log(res.locals.redirectUrl);
    }
    next();
}
//to implement authorisation in listings ......
module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of tthis listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}