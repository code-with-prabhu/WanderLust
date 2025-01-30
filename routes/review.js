const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateReview,isAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviewControl.js");


router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isAuthor, isOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;