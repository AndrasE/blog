// requiring modules //
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

const homeStartingContent = "This project was part of my study when i had to create a blog site which uses a database in the background. This means whichever part of the world you reach this site from, the posts will remain unchanged. The cool part all off this that posts can be created/deleted by yourself and it will be stored in a cloud database (i think the free server is in N. Virginia). If you go to the compose section you can add anything you like which will be appearing on the home screen. If you click read more (obviously you can read more lol), but you also able to delete the chosen post. Later i might will add and update post button and also a sign-in section as at this point not just you an me, but anyone have the authority to write/delete.. But thats gonna be a hella of work, so be patient. Now i gotta move on, goodbye dear visitor! 😘";
const aboutContent = "Not much to say here, just trying to study. For this project i used Node.js with Ejs, Express, Bodyparser and Mongoose. The webpage built with Bootstap 3 and I styled it here and there. The page hosted deployed on Heroku via Github the database in the back on a Mongoose server. Its a small step for kitty, but a bloody long crawling for a snail. Content over, class dismissed. 🐌";

// ejs,bodyParser,css-public //
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//mongoose.connect//
mongoose.connect("mongodb+srv://andras:Eaeaea123@cluster0.zfr0d.mongodb.net/blogDB", {
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
