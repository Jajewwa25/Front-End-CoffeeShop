const express = require("express");
const axios = require("axios");
const app = express();
var bodyParser = require("body-parser");

//const base_url = "http://node59553-env-5865143.proen.app.ruk-com.cloud:11485";
const base_url = "http://localhost:3000/";
//"body-parser": "^1.20.2",

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

//Address
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/Address");
    res.render("home", { Address: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  try {
    const data = { : req.body.title, author: req.body.author };
    await axios.post(base_url + "/create", data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/update/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/Address/" + req.params.id);
    res.render("update", { Address: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const data = { title: req.body.title, author: req.body.author };
    await axios.put(base_url + "/Address/" + req.params.id, data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await axios.delete(base_url + "/Address/" + req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

//Customer
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/Customer");
    res.render("Customer", { Customer: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/Customer/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/Customer/" + req.params.id);
    res.render("Customer", { Customer: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  try {
    const data = { title: req.body.title, author: req.body.author };
    await axios.post(base_url + "/Customer", data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/update/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/Customer/" + req.params.id);
    res.render("update", { Customer: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const data = { title: req.body.title, author: req.body.author };
    await axios.put(base_url + "/Customer/" + req.params.id, data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await axios.delete(base_url + "/Customer/" + req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});


//Employee
app.get("/", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Employee");
      res.render("Employee", { Employee: response.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/Employee/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Employee/" + req.params.id);
      res.render("Employee", { Employee: response.data });
    } catch (err) {
      console.log(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/create", (req, res) => {
    res.render("create");
  });
  
  app.post("/create", async (req, res) => {
    try {
      const data = { title: req.body.title, author: req.body.author };
      await axios.post(base_url + "/Employee", data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/update/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Employee/" + req.params.id);
      res.render("update", { Employee: response.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.post("/update/:id", async (req, res) => {
    try {
      const data = { title: req.body.title, author: req.body.author };
      await axios.put(base_url + "/Employee/" + req.params.id, data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/delete/:id", async (req, res) => {
    try {
      await axios.delete(base_url + "/Employee/" + req.params.id);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });

//Item
app.get("/", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Item");
      res.render("Employee", { Item: response.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/Item/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Item/" + req.params.id);
      res.render("Item", { Employee: response.data });
    } catch (err) {
      console.log(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/create", (req, res) => {
    res.render("create");
  });
  
  app.post("/create", async (req, res) => {
    try {
      const data = { title: req.body.title, author: req.body.author };
      await axios.post(base_url + "/Item", data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/update/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Item/" + req.params.id);
      res.render("update", { Item: response.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.post("/update/:id", async (req, res) => {
    try {
      const data = { title: req.body.title, author: req.body.author };
      await axios.put(base_url + "/Item/" + req.params.id, data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/delete/:id", async (req, res) => {
    try {
      await axios.delete(base_url + "/Item/" + req.params.id);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });

  //Order
app.get("/", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Item");
      res.render("Employee", { Order: response.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/Order/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Item/" + req.params.id);
      res.render("Item", { Order: response.data });
    } catch (err) {
      console.log(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/create", (req, res) => {
    res.render("create");
  });
  
  app.post("/create", async (req, res) => {
    try {
      const data = { title: req.body.title, author: req.body.author };
      await axios.post(base_url + "/Order", data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/update/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/Order/" + req.params.id);
      res.render("update", { Item: response.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.post("/update/:id", async (req, res) => {
    try {
      const data = { title: req.body.title, author: req.body.author };
      await axios.put(base_url + "/Order/" + req.params.id, data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });
  
  app.get("/delete/:id", async (req, res) => {
    try {
      await axios.delete(base_url + "/Order/" + req.params.id);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("error");
    }
  });

app.listen(5500, () => {
  console.log("server started on port 5500");
});