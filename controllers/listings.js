const Listing = require("../models/listing");
const Review = require("../models/review");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requestd for does not exist");
        res.redirect("/listings");
    }
    //const reviews=listing.reviews;
    const data = [];
    for (review of listing.reviews) {
        data.push(await Review.findById(review._id));
    }
    console.log(data);
    let reviews = data.filter(item => item !== null);
    res.render("listings/show.ejs", { listing, reviews });
};

module.exports.createListing = async (req, res, next) => {
    // console.log(req.body);
    //    let result=listingSchema.validate(req.body);
    //    if(result.error){
    //     throw new ExpressError(400,result.error);
    //    }
    // geocoding in structured input mode
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.location,//takes the location//"goa,india"
        limit: 1
    })
        .send();
   
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;//has current users id
    newListing.image = { url, filename };

    newListing.geometry= response.body.features[0].geometry;

    console.log(await newListing.save());
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requestd for does not exist");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_200,w_250/e_blur");//to blurr the preview image
    res.render("listings/edit.ejs", { listing, originalImage });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully deleted");
    res.redirect("/listings");
};