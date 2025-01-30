const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/userControl.js");

router
  .route("/signup")
  .get(userController.signUp)
  .post(wrapAsync(userController.signupForm));

router
  .route("/login")
  .get(userController.logIn)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    wrapAsync(userController.loginForm)
  );

  
router.get("/logout", userController.logOut);

module.exports = router;

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "demo1@gmail.com",
//         username: "demo1-user"
//     });

//     let regUser = await User.register(fakeUser, "demo1@123");
//    res.send(regUser);
// })
