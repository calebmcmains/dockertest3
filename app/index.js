// npm modules brought in
const express = require("express");
const path = require("path");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

const User = require("./models/user");

mongoose
  .connect("mongodb://localhost:27017/docker-test-db")
  .then(() => {
    console.log("MONGO-DB CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGO-DB ERROR");
    console.log(err);
    process.exit(1);
  });

const app = express(); // initalized the express app

app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); // ejs is the main viewing engine since we will be templating with ejs
app.set("views", path.join(__dirname, "views")); // views folder is available from anywhere

app.use(express.static(path.join(__dirname, "public"))); // ability to use static documents like style sheets from the main directory
app.use(express.urlencoded({ extended: true })); // allows the app to take in form responses form client side
app.use(express.json());

// @desc    hero page
// @route   GET /
// @access  public
app.get("/", async (req, res) => {
  const pageTitle = "Docker Test";
  let findR;
  try {
    const allUsers = await User.find({});
    if (allUsers) {
      findR = allUsers;
    }
    console.log("Found document =>", allUsers);
  } catch (error) {
    console.log(error);
  }

  res.render("index", { pageTitle, findR });
});
// @desc    hero page
// @route   GET /
// @access  public
app.post("/dockerdata", async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, hobbies } = req.body;

  try {
    const user = new User({
      firstname,
      lastname,
      email,
      hobbies,
    });
    console.log("Inserted documents =>", user);
    await user.save();
  } catch (error) {
    console.log(error);
  }

  res.redirect("/");
});

// @desc    this error handler will be used anytime a 404 error status code is send. Most common reason for a 404 is a specific path defined in the web address doesnt exist.
// @route   GET/POST/PUT/DELETE *
// @access  public
app.all("*", (req, res, next) => {
  return res.status(404).send("Page not found")
});

// this is the default error handler for all other errors outside of 404 errors
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  // eslint-disable-next-line no-param-reassign
  if (!err.message) err.message = "Something Went Wrong!";

  if (err.type === "clientError") {
    console.log({ err });
    return res.status(statusCode).send(err);
  }

  if (err.statusCode === 404) {
    console.log({ err });
    return res.status(statusCode).send(err);
  }

  console.log({ err });
  return res.status(statusCode).send(err);
});
const port = 3000;
app.listen(port, () => {
  console.log(`SITE IS LISTENING ON PORT ${port}`);
});
