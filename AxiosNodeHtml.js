const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

const base_url = "http://localhost:3000";
//"body-parser": "^1.20.2",

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {

      const response = await axios.get(base_url + "/Customers");
      res.render("login", {Customer : response.data});
  
});

app.listen(5500, () => {
  console.log("server started on port 5500");
});