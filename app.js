// requiring modules //
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
var favicon = require('serve-favicon');

const landingContent = "";
const homeStartingContent = "Please feel free to compose and share your blogposts. The site is very simple and self-explanatory. Please be polite!";
const aboutContent = "This project was part of my studies on Udemy. It uses Node, Express, Bodyparser, Ejs. The webpage was designed with Bootstrap 3 and I styled it here and there. The page deployed on Heroku via Github the database is using mongoDB.";
const aboutContent2 ="Although it may not seem much for me personally it was a great achievement. It uses EJS Embedded JavaScript Templating. EJS lets us embed JavaScript code into HTML. It can come very handy in many different ways. It can reduce the repetition of the code."; 
const aboutContent3 = "Let's say you have a website with 2-3 redirects to different sections of the page. You can simply write the header/footer or any other parts of the webpage only once and inject it to your HTML. Or it also can also be used to allocate the content to the site. In this App`s case it gets the data from the backend using MongoDB and runs a forEach loop to display all the blog-posts line by line. This enables us to display content that is not hard-coded, something that changes and does all this automatically. When you add or delete a post, the App will send this information back to the back-end database, make the changes and as soon as the page refreshes, these changes will be visible to you as the loop re-run using the updated database.";
const aboutContent4 = "This was the first time I actually could truly engage with my own creation, which took everything to a whole new and very exciting level for me. Furthermore the database is located on Amazon`s free tier server in West-Virginia. Any changes you make actually will get sent there and back to you. Even now looking back to this project, it's nothing shy of amazing."


// ejs,bodyParser,css-public //
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(favicon(__dirname + '/public/favicon.ico'));

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

app.get("/", function(req, res) {
  res.render("landing", {
  });
});

//basic rendering but looking for objects//
//in blogDB/posts collection to load them//
//by pass it through to home.ejs where a//
//forEach method called on them//
app.get("/home", function(req, res) {

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
    aboutContent: aboutContent,
    aboutContent2: aboutContent2,
    aboutContent3: aboutContent3,
    aboutContent4: aboutContent4
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
      res.redirect("/home");
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
      res.redirect("/home")
    }
  });
});

//local + heroku/cyclic//
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
