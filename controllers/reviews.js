const Review=require("../models/review");
const Listing = require("../models/listing.js");

module.exports.createReview=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    console.log(req.body);
    const newReview = new Review(req.body);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review created!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//will remove thr rev id wala from rev ayyar
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
};