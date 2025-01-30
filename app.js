if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}


const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const port = 3000;
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash = require("connect-flash");
const dbUrl = process.env.ATLAS_DB_URL;


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 3600*24,
});

store.on("error", () => {
  console.log("session store error");
});

const sessionData = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};


// authentication rewuirements.
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");

app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then(() => {
    console.log("connection Sucessful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//   res.send("welcome to home.");
// });

app.use(session(sessionData));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // for serializing the user into the session
passport.deserializeUser(User.deserializeUser()); // after the work user have to deserialize from the session

app.use((req, res, next) => {
  res.locals.success = req.flash("Sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


// router concept
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found! :("));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "some internal server error." } = err;
  res.render("error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
