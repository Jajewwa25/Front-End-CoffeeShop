const express = require("express");
const axios = require("axios");
const app = express();
var bodyParser = require("body-parser");

const base_url = "http://node59553-env-5865143.proen.app.ruk-com.cloud";
//"body-parser": "^1.20.2",

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

/*app.get("/", async (req, res) => {
  try {
      const response = await axios.get(base_url + "/product/" + req.params.id);
      res.render("menu", { shop: product.data});
  } catch (err) {
      console.error(err);
      res.status(500).send('Error menu')
  }
});*/

app.listen(5500, () => {
  console.log("server started on port 5500");
});