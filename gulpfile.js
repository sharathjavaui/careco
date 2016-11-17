"use strict"

var express = require("express");
var app = express();
var gulp = require("gulp")
var sass = require("gulp-sass");
var jade = require("gulp-jade");
var livereload = require("gulp-livereload");
var cssbeautify = require('gulp-cssbeautify');
var htmlbeautify = require('gulp-html-beautify');

app.use("/", express.static(__dirname+"/build"));
app.use("/", express.static(__dirname+"/images"));
app.use("/", express.static(__dirname+"/library"));

app.set("views",__dirname+"/dev/jade")
app.set("view engine", "jade")
gulp.task("sass", function(){
    gulp.src("./dev/sass/*.scss")
        .pipe(sass().on("error",sass.logError))
        .pipe(cssbeautify())
        .pipe(gulp.dest("./build/css"))
        .pipe(livereload())
})

gulp.task("jade", function() {
    var my_locals = {}
    gulp.src("./dev/jade/*.jade")
        .pipe(jade({
            locals:my_locals
        }))
        .pipe(jade().on("error",sass.logError))
        .pipe(htmlbeautify({}))
        .pipe(gulp.dest("./build/html/"))
        .pipe(livereload())
})

gulp.task("homepage", function() {
    gulp.src("index.html")
    .pipe(livereload());
})

app.set("port", process.env.PORT || 3000)
gulp.task("watch", function() {
    livereload.listen(app.get("port"), function(){
        console.log("app is runnong" + app.get("port"));
        gulp.watch("dev/jade/**/*.jade",["jade"]);
        gulp.watch("dev/sass/**/*.scss",["sass"]);
        gulp.watch("index.html",["homepage"]);
    })
})

app.get("/", function(req, res) {
    res.render("index")
})

app.get("/about", function(req, res) {
    res.render("about")
})

app.listen(app.get("port"), function(){
    console.log("app is running on "+ app.get("port"))
})

gulp.task("default",["jade","sass","watch"]);

