if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLAS_DB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("coneected to DB");
})
    .catch((err) => {
        console.log(err);
    })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);// This allows you to create dynamic HTML pages easily with features like partials and layouts.
app.use(express.static(path.join(__dirname, "/public")));



// app.get("/", (req, res) => {
//     res.send("i am root");
// });

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions= {
    store,
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie:{
        expires: Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mw to display flash abhi storing it in local cariable
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

/*app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"delta-student",
    });

   const registeredUser=await User.register(fakeUser,"helloworld");//static mthd
   res.send(registeredUser);
});*/

//this is a function

app.use("/listings",listingsRouter);//whenever /lisitngs is called use listings
app.use("/listings/reviews/:id",reviewsRouter);
app.use("/",userRouter);



//if didn't match with any existing route then will come here
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!!!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "some error ocurred bro" } = err;
    res.render("error.ejs", { err });
    // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening");
});

