const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundResults) {
            console.log(foundResults)
            res.send(foundResults);
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles")
            } else {
                res.send(err);
            }
        })
    });

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article match title found")
            }
        })
    })
    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle, },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Update success")
                }
            }
        )
    })
    .patch(function (req, res) {
        Article.update(
            { title: req.params.articleTitle, },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send('Succefully update')
                } else {
                    res.send(err)
                }
            }
        )
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Delete successfully");
                } else {
                    res.send(err);
                }
            }
        )
    });

app.listen(3000, function () {
    console.log("Server started at port 3000")
});