const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");
const { clearConfigCache } = require("prettier");

//const base_url = "http://node59553-env-5865143.proen.app.ruk-com.cloud:11485";
const base_url = "http://localhost:3000";
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

app.get("/customer", async(req, res) => {
  try {
    const response = await axios.get(base_url + "/customer")
    console.log(response.data);
    res.render("customer", {customer:response.data});
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/customer/:id", async(req, res) => {
  try {
    const response = await axios.get(base_url + "/customer/" + req.params.id)
    res.render("onecustomer", {customer:response.data});
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/updatecustomer/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/customer/" + req.params.id);
    res.render("updatecustomer", { customer: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/updatecustomer/:id", async (req, res) => {
  try {
    const data = { username: req.body.username, tel: req.body.tel,
      email:req.body.email,date:req.body.date };
    await axios.put(base_url + "/customer/" + req.params.id, data);
    res.redirect("/customer/" + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/deletecustomer/:id", async (req, res) => {
  try {
    await axios.delete(base_url + "/customer/" + req.params.id);
    res.redirect("/customer");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});






app.listen(5500, () => {
  console.log("server started on port 5500");
});