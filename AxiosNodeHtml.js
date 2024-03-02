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

app.get("/order", async(req, res) => {
  try {
    const response = await axios.get(base_url + "/order")
    console.log(response.data);
    res.render("order", {order:response.data});
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/home",(req, res) => {
  try {
    res.render("home");
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
    res.render("about");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/menu",async (req, res) => {
  try {
    const response = await axios.get(base_url + "/menu")
    console.log(response.data);
    res.render("menu", {Item:response.data});
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/menu1",async (req, res) => {
  try {
    const response = await axios.get(base_url + "/menu1")
    console.log(response.data);
    res.render("menu1", {Item:response.data});
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

//--------------------------------------

app.get("/employee", async(req, res) => {
  try {
    const response = await axios.get(base_url + "/employee")
    console.log(response.data);
    res.render("employee", {employee:response.data});
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/employee/:id", async(req, res) => {
  try {
    const response = await axios.get(base_url + "/employee/" + req.params.id)
    res.render("employee", {employee:response.data});
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});


app.get("/updatemenu", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/Item/" + req.params.id);
    res.render("updatemenu", { Item: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/updatemenu/:id", async (req, res) => {
  try {
    const data = { itemname: req.body.itemname, price: req.body.price };
    await axios.put(base_url + "/Item/" + req.params.id, data);
    res.redirect("/Item/" + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/deletemenu/:id", async (req, res) => {
  try {
    await axios.delete(base_url + "/Item/" + req.params.id);
    res.redirect("/Item");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/cart",(req, res) => {
  try {
    res.render("cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

/*app.get("/updatemenu",async (req, res) => {
  try {
    const response = await axios.get(base_url + "/updatemenu")
    console.log(response.data);
    res.render("updatemenu", {Item:response.data});
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});*/

app.listen(5500, () => {
  console.log("server started on port 5500");
});