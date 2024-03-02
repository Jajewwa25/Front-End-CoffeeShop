const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

//const base_url = "http://node59553-env-5865143.proen.app.ruk-com.cloud:11485";
const base_url = "http://localhost:3000/";
//"body-parser": "^1.20.2",

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "/public/views"));

app.use(express.static(__dirname + "/public"));

app.get("/order",(req, res) => {
  try {
    res.render("order");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/login",(req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/Register",(req, res) => {
  try {
    res.render("Register");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/about",(req, res) => {
  try {
    console.log("hello");
    res.render("about");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/menu",(req, res) => {
  try {
    res.render("menu");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});


app.listen(5500, () => {
  console.log("server started on port 5500");
});