const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });//will store in cloudinary storage
//const {saveRedirectUrl}=require("../middleware.js");

//index route-create route
router.route("/")
.get( wrapAsync(listingController.index))//
.post( isLoggedIn,upload.single("image"),validateListing,  wrapAsync(listingController.createListing));


//new lisitng route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show-update-delete
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner, upload.single("image"),validateListing, wrapAsync(listingController.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));


module.exports = router;