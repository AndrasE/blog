// requiring modules //
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const favicon = require('serve-favicon')

const homeStartingContent = "Please feel free to compose and share your blogposts. The site is very simple and self-explanatory. Please be polite!";
const aboutContent = "This project was part of my studies on Udemy. It uses Node, Express, Bodyparser, Ejs. The webpage designed with Bootstap 3 and I styled it here and there. The page deployed on Heroku via Github the database is located on AWS North-Virginia using mongoDB. ";

// ejs,bodyParser,css-public //
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


//mongoose.connect//
mongoose.connect("mongodb+srv://andras:" + process.env.MONGOOSE_PASS + "@cluster0.zfr0d.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// schema for blogposts //
const postSchema = {
  title: String,
  content: String
};

// schema definition model //
const Post = mongoose.model(`Post`, postSchema);

//basic rendering but looking for objects//
//in blogDB/posts collection to load them//
//by pass it through to home.ejs where a//
//forEach method called on them//
app.get("/", function(req, res) {

  Post.find({}, function(err, foundPosts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts
    });
  });
});

//basic rendering//
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});
//basic rendering//
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});
//basic rendering//
app.get("/compose", function(req, res) {
  res.render("compose");
});

//on compose.ejs name="postTitle" name="postBody"//
//using post schema to create new object//
app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //save before redirect, before it wasn`t always loading straight after//
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

//at home clicking the Read More will go to "/posts/:postId" stored in const, this will be used to render a page with the required content found from DB//
app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function(err, foundPost) {
    console.log(foundPost);
    res.render("post", {
      title: foundPost.title,
      content: foundPost.content,
      postId: requestedPostId
    });
  });
});

//deleting post using the findbyid postID passed just above//
app.post("/delete", function(req, res) {
  const delPost = req.body.button;
  Post.findByIdAndRemove({
    _id: delPost
  }, function(err) {
    if (!err) {
      console.log("Item deleted");
      res.redirect("/")
    }
  });
});

//heroku//
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
