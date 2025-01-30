const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
    let { q } = req.query;
    let listing;

    if (q) {
        listing = await Listing.find({
            title: { $regex: q, $options: 'i' }
        });

        if (listing.length === 0) {
            req.flash("error", `No listing found for "${q}"`);
            return res.redirect("/listings"); // Prevents further execution
        }
    } else {
        listing = await Listing.find({});
    }

    // Render the page with the listings
    res.render("listingpages/home.ejs", { listing });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listingpages/add.ejs");
};

module.exports.addNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(req.file);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("Sucess", "New listing created.");
    res.redirect("/listings");
};

module.exports.showAllListing =  async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(`${id}`)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if (!listing) {
        req.flash("error", "Sorry, listing not existed.");
        res.redirect("/listings");
    }
    res.render("listingpages/show.ejs", {listing});
};

module.exports.editList = async (req, res) => {
    let {id} = req.params;
    const info = await Listing.findById(`${id}`);
    if (!info) {
        req.flash("error", "Sorry, listing not existed.");
        res.redirect("/listings");
    }
    let originalUrl = info.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250");
    
    res.render("listingpages/edit.ejs", {info, originalUrl});
};

module.exports.editDetails = async (req, res) => {
    
    if(! req.body.listing){
        throw new ExpressError(400, "Please fill out the form");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("Sucess", "Listing updated.");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("Sucess", "Listing deleted Successfully.");
    res.redirect("/listings");
};
