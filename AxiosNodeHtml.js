const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
const multer = require("multer");
var bodyParser = require("body-parser");
const { clearConfigCache } = require("prettier");
const session = require("express-session");
const cookieParser = require("cookie-parser");

//const base_url = "http://10.104.4.179";
const base_url = "http://localhost:3000";
//"body-parser": "^1.20.2";

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "/public/views"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploaded_img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname + "/public"));

const authenticateUser = (req, res, next) => {
  if (req.cookies && req.cookies.userSession) {
    next();
  } else {
    res.redirect("/");
  }
};

//Home
app.get("/", (req, res) => {
  try {
    res.render("home");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/home", (req, res) => {
  try {
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

//order for Admin
app.get("/order1", authenticateUser, async (req, res) => {
  try {
    // ดึงข้อมูลการสั่งซื้อจากเซิร์ฟเวอร์
    const response = await axios.get(base_url + "/Order");
    // ส่งข้อมูลการสั่งซื้อไปยังเทมเพลต "order1" เพื่อแสดงผลบนหน้าเว็บไซต์
    console.log(response.data[0]);
    res.render("order1", {
      Order: response.data[0],
      Item: response.data[1],
      Customer: response.data[2],
    });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/deleteorder/:id", authenticateUser, async (req, res) => {
  try {
    await axios.delete(base_url + "/order/" + req.params.id);
    res.redirect("/order1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    // ดึงข้อมูล customer จากฐานข้อมูลหรือที่เก็บข้อมูล
    const data = {
      username: req.body.username,
      password: req.body.password,
    };
    const response = await axios.post(base_url + "/login", data);
    if (response.data.message == true) {
      res.cookie("userSession", response.data.customer.username, {
        httpOnly: true,
      });
      console.log(response.data.customer.username, "Login Successful");

      if (response.data.customer.username == "Admin") {
        req.session.user = {
          customer_id: response.data.customer.customer_id,
          username: response.data.customer.username,
        };
        return res.redirect("menu1");
      }

      req.session.user = {
        customer_id: response.data.customer.customer_id,
        username: response.data.customer.username,
      };

      res.redirect("menu");
    } else if (response.data.message == "User_not_found") {
      console.log("User Not Found");
      res.redirect("login");
    } else if (response.data.message == "Wrong_Password") {
      console.log("Wrong Password");
      res.redirect("login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

//logout
app.get("/logout", (req, res) => {
  req.session.user = null;
  res.clearCookie("userSession");
  res.redirect("/");
});

//register
app.get("/register", (req, res) => {
  try {
    res.render("Register");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/register", async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      tel: req.body.tel,
      email: req.body.email,
    };
    console.log(data);
    await axios.post(base_url + "/register", data);

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("error in /register");
    res.redirect("/");
  }
});

//about coffee shop
app.get("/about", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/about");
    console.log(response.data);
    res.render("about", { Employee: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

//menu for customer
app.get("/menu", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/menu");

    if (!req.session.user) {
      console.log("Logged in");
      req.session.user = {
        customer_id: "0",
      };
    }

    res.render("menu", { Item: response.data, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/add-to-cart", authenticateUser, async (req, res) => {
  let { item_id, itemname, price, qty } = req.body;

  console.log("Request Body:", req.body);


  // ตรวจสอบว่า item_id, itemname, price, qty ถูกส่งมาหรือไม่
  if (!item_id || !itemname || isNaN(price) || isNaN(qty)) {
    return res.status(400).send("Invalid product details.");
  }

  // ในกรณีนี้ไม่จำเป็นต้องใช้ [0] เพราะเราได้รับค่าของ itemname เป็น string
  item_id = item_id[0];  // ใช้ [0] หากค่าที่ส่งมาเป็น array
  itemname = itemname;    // ไม่ต้องใช้ [0] ถ้าเป็น string
  price = parseFloat(price);
  qty = parseInt(qty);

  console.log('Received values:', req.body);

  if (!req.session.cart) {
    req.session.cart = [];
  }

  // หาว่าสินค้าเคยถูกเพิ่มไว้แล้วหรือไม่
  const existingItem = req.session.cart.find(item => item.item_id === item_id);

  if (existingItem) {
    // ถ้ามีสินค้าแล้วเพิ่มจำนวน
    existingItem.qty += qty;
  } else {
    // ถ้ายังไม่มีสินค้าในตะกร้า
    req.session.cart.push({
      item_id,
      itemname,
      price,
      qty,
    });
  }

  // เมื่อเพิ่มสินค้าแล้ว redirect ไปที่หน้า cart
  res.redirect("/cart");
});


//menu for Admin
app.get("/menu1", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/menu1");
    console.log(response.data);
    res.render("menu1", { Item: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

//customer
app.get("/customer", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/customer");
    console.log(response.data);
    res.render("customer", { customer: response.data });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/customer/:id", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/customer/" + req.params.id);
    res.render("onecustomer", { customer: response.data });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

//updatecustomer
app.get("/updatecustomer/:id", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/customer/" + req.params.id);
    res.render("updatecustomer", { customer: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/updatecustomer/:id", authenticateUser, async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      tel: req.body.tel,
      email: req.body.email,
      date: req.body.date,
    };
    await axios.put(base_url + "/customer/" + req.params.id, data);
    res.redirect("/customer/" + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

//deletecustomer
app.get("/deletecustomer/:id", authenticateUser, async (req, res) => {
  try {
    await axios.delete(base_url + "/customer/" + req.params.id);
    res.redirect("/customer");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

//employee

app.get("/employee", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/employee");
    console.log(response.data);
    res.render("employee", { Employee: response.data });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/employee/:id", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/employee/" + req.params.id);
    res.render("oneemployee", { Employee: response.data });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/updateemployee/:id", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/employee/" + req.params.id);
    res.render("updateemployee", { Employee: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/updateemployee/:id", upload.single("img"), authenticateUser, async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
      position: req.body.position,
      img: req.file.filename,
    };
    await axios.put(base_url + "/Employee/" + req.params.id, data);
    res.redirect("/employee");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}
);

app.get("/deleteemployee/:id", authenticateUser, async (req, res) => {
  try {
    await axios.delete(base_url + "/Employee/" + req.params.id);
    res.redirect("/employee");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

//item
app.get("/item", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/item");
    console.log(response.data);
    res.render("item", { Item: response.data });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/item/:id", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/item/" + req.params.id);
    res.render("onemenu", { Item: response.data });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

//updatemenu
app.get("/updatemenu/:id", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/item/" + req.params.id);
    res.render("updatemenu", { Item: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/updatemenu/:id", upload.single("img"), authenticateUser, async (req, res) => {
  try {
    const data = {
      itemname: req.body.itemname,
      price: req.body.price,
      img: req.file.filename,
    };
    await axios.put(base_url + "/item/" + req.params.id, data);
    return res.redirect("/Item"); // เมื่ออัปเดตเสร็จแล้วให้ redirect ไปยังหน้า "/item"
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}
);

//deletemenu
app.get("/deletemenu/:id", authenticateUser, async (req, res) => {
  try {
    await axios.delete(base_url + "/item/" + req.params.id);
    res.redirect("/item");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/delete/:id", authenticateUser, async (req, res) => {
  try {
    await axios.delete(base_url + "/Item/" + req.params.id);
    res.redirect("/menu1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// Add menu
app.get("/addmenu", authenticateUser, (req, res) => {
  try {
    res.render("addmenu");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/addmenu", upload.single("img"), authenticateUser, async (req, res) => {
  try {
    const data = {
      itemname: req.body.itemname,
      price: req.body.price,
      img: req.file.filename,
    };
    await axios.post(base_url + "/Items", data);
    res.redirect("/item");
    //await axios.put(base_url + "/item/" + req.params.id, data);
    // res.redirect("/item"); // เมื่ออัปเดตเสร็จแล้วให้ redirect ไปยังหน้า "/item"
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}
);

// addemployee
app.get("/addemployee", authenticateUser, (req, res) => {
  try {
    res.render("addemployee");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/addemployee", upload.single("img"), authenticateUser, async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
      position: req.body.position,
      img: req.file.filename,
    };
    await axios.post(base_url + "/Employee", data);
    res.redirect("/employee");
    //await axios.put(base_url + "/item/" + req.params.id, data);
    // res.redirect("/item"); // เมื่ออัปเดตเสร็จแล้วให้ redirect ไปยังหน้า "/item"
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}
);

//cart
app.get("/cart", async (req, res) => {
  const cart = req.session.cart || [];
  res.render("cart", { cart });
})

app.listen(5500, () => {
  console.log("server started on port 5500");
});