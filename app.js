const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// creating a new mongodb and establishing connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/postDB');
}

// creating SCHEMA for our posts
const postSchema = {
  title: String, 
  content: String
};

// create a MODEL
const Post = mongoose.model("Post", postSchema);

// create a DOCUMENTs to populate the database:
const createdPost1 = new Post ({
  name: "Day1",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
});

const createdPost2 = new Post ({
  name: "Day2",
  content: "Ullamcorper a lacus vestibulum sed. Enim blandit volutpat maecenas volutpat blandit. In cursus turpis massa tincidunt dui ut. Pellentesque habitant morbi tristique senectus et. Turpis tincidunt id aliquet risus feugiat in. Eu volutpat odio facilisis mauris sit amet massa. Senectus et netus et malesuada fames ac. Tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Amet purus gravida quis blandit turpis cursus in. Sapien et ligula ullamcorper malesuada. Leo duis ut diam quam nulla porttitor. Etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum. Blandit aliquam etiam erat velit scelerisque in dictum non. In hendrerit gravida rutrum quisque non. Maecenas sed enim ut sem viverra aliquet."
});

const createdPost3 = new Post ({
  name: "Day3",
  content: "Fermentum et sollicitudin ac orci. Tortor at risus viverra adipiscing. Ut eu sem integer vitae justo eget magna fermentum. Nec ultrices dui sapien eget mi proin sed libero. Fringilla est ullamcorper eget nulla facilisi. Porta nibh venenatis cras sed felis eget velit. Volutpat est velit egestas dui id ornare arcu odio. Elit sed vulputate mi sit amet mauris commodo. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Orci nulla pellentesque dignissim enim sit. Tellus cras adipiscing enim eu. Dui sapien eget mi proin sed libero enim sed faucibus. Consequat id porta nibh venenatis cras. Iaculis nunc sed augue lacus viverra vitae congue eu. Mauris ultrices eros in cursus. Id velit ut tortor pretium viverra suspendisse potenti nullam. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Magna sit amet purus gravida quis blandit turpis cursus in. Ac tincidunt vitae semper quis lectus nulla at volutpat diam. Faucibus interdum posuere lorem ipsum dolor sit."
});

const defaultPosts = [createdPost1, createdPost2, createdPost3];

// insert documents into local db: 
Post.insertMany(defaultPosts, function (err) {
  if (!err) {
    console.log("Successfully added to the db")
  }
})

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
