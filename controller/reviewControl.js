const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let {id} = req.params;
    let list = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();
    req.flash("Sucess", "New review created.");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req,res) => {

    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("Sucess", "Review deleted successfully.");
    res.redirect(`/listings/${id}`);
};
