var express=require("express");
var app= express();
var methodOverride= require("method-override")
var bodyParser= require("body-parser");
var mongoose= require("mongoose");

mongoose.connect("mongodb://localhost/blog",{useNewUrlParser: true , useUnifiedTopology: true});
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true}));

//schemas for all 

var blogschema= new mongoose.Schema({
title: String,
image: String,
body: String,
created : { type: Date, default: Date.now}

});

var blog=mongoose.model("blog",blogschema);
 
 
//routes
app.get("/", function(req,res){
	res.redirect("/blogs");

})

//index
 app.get("/blogs", function(req,res){
 blog.find({}, function(err,blogs){
if (err) {
	console.log(err);
}else{
	res.render("allBlogs",{blogs: blogs});
}
 });
});

//new
app.get("/blogs/new",function(req,res){
	res.render("newBlog");
})

//create
app.post("/blogs",function(req,res){
    blog.create(req.body.blog,function(err,newBlog){
		if (err) {
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	});
});

//show page

app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id, function(err, blog){
		if (err) {
			res.redirect("/blogs")
		}else{
			res.render("showBlog", {blog: blog});
		}

	});
});

	//edit route
app.get("/blogs/:id/edit", function(req,res){
	blog.findById(req.params.id,function(err,blog){
		if (err) {
			res.redirect("/blogs");
		}else{
			res.render("editBlog", {blog: blog});
		}
	});
});

	//update

app.put("/blogs/:id",function(req,res){
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if (err) {
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});

//DELETE REQ
app.delete("/blogs/:id", function(req,res){
	blog.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
})




app.listen(3000,function(){
	console.log("server started");
});