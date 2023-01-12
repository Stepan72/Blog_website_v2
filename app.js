// jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const port = process.env.PORT || 3000;
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

////// ============= Server initials
app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//// ================== Mongoose
mongoose.connect("mongodb://localhost:27017/webPosts", {
  useNewUrlParser: true,
});
mongoose.set("strictQuery", true);
//// schema Mongoose
const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Add title"],
  },
  postContent: {
    type: String,
    required: [true, "Add post"],
  },
});
const Post = mongoose.model("Post", postsSchema);

//// ==================

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];
let postShow;

app.get("/", function (req, res) {
  Post.find({}, (err, results) => {
    if (!err) {
      console.log(results);
      res.render("home", {
        homeStartingContentEJS: homeStartingContent,
        postsEJS: results,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContentEJS: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContentEJS: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

// app.post("/compose", function (req, res) {
//   const postMessage = {
//     title: req.body.title,
//     content: req.body.post,
//   };
//   posts.push(postMessage);
//   res.redirect("/");
// });
/// Внесение нового поста в dB
app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.title,
    postContent: req.body.post,
  });

  Post.insertMany(post, (err, results) => {
    if (!err) {
      console.log(results);
    }
  });
  res.redirect("/");
});

//// Routing params!!! автоматом создает
app.get("/posts/:random", (req, res) => {
  let insert = _.lowerCase(req.params.random);
  // console.log(insert);

  posts.forEach((el) => {
    if (_.lowerCase(el.title) == insert) {
      // console.log(`Match found`);
      postShow = insert;
      res.render(`post`, {
        postTitleEJS: el.title,
        postContentEJS: el.content,
      });
    }
  });
});
