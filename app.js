const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { Schema } = mongoose;



const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser : true});

const articleSchema = new Schema({
    title : String,
    content :  String
});

const Article = mongoose.model('Article',articleSchema);

app.route("/articles")
.get(function(req,res)
{
    Article.find({}).then(articles => {
        // console.log(articles);
        res.send(articles);
      }).catch(err => {
        res.send(err);
      });
})
.post(function(req,res)
{
    const article  = new Article({
        title:req.body.title,
        content:req.body.content
    });
    article.save().then(docs=>{
        res.send("Successfully Added the record to the Database!!!");
    }).catch(err=>{
        res.send(err);
        })
})
.delete(function(req,res)
{
    Article.deleteMany({}).then(docs=>{
        res.send("Successfully Deleted all the records");
    }).catch(err=>{
        res.send(err);
    });

});
//////////////////////////Specific articles////////////////

app.route("/articles/:articleTitle")
.get(function(req,res)
{
    Article.findOne({title:req.params.articleTitle}).then(article => {
        // console.log(articles);
        if(article)
        {
            res.send(article);
        }
        else
        {
            res.send("No articles were found");
        }
      }).catch(err => {
        res.send(err);
      });
})
.put(function(req,res)
{
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title,
        content:req.body.content})
        .then(doc=>
            {
                res.send("Sucessfully updated the article");
            })
         .catch(err=>
            {
                res.send(err);
            });

})
.patch(function(req,res)
{
    Article.findOneAndUpdate({title:req.params.articleTitle},{$set:req.body})
    .then(doc=>
        {
            res.send("Sucessfully updated the article");
        })
     .catch(err=>
        {
            res.send(err);
        });
})
.delete(function(req,res)
{
    Article.deleteOne({title:req.params.articleTitle})
    .then(doc=>
        {
            res.send("Sucessfully deleted the article");
        })
     .catch(err=>
        {
            res.send(err);
        });

});



app.listen(3000,function()
{ 
    console.log("Server started on port 3000");
});

