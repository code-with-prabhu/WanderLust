const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listingControl.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.addNewListing));



router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showAllListing))
  .patch(
    upload.single("listing[image]"),
    validateListing,
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editDetails)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editList)
);

module.exports = router;
