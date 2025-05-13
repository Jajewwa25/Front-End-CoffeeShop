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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "/public/views"));
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
  // store: ใช้ store จริงใน production เช่น connect-mongo, redis ฯลฯ
}));

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

app.get("/menu", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(base_url + "/menu");

    // ดึงข้อมูลตะกร้าจาก session
    const customer_id = req.session.user?.customer_id;
    const cart = req.session.carts?.[customer_id] || [];

    // คำนวณจำนวนสินค้าในตะกร้า
    const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    // ส่งข้อมูลไปยัง view
    res.render("menu", { Item: response.data, user: req.session.user, cartTotalQty });
  } catch (err) {
    console.error(err);
    return res.status(500).send("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
  }
});

app.post('/add-to-cart', (req, res) => {
    const { item_id, itemname, price, qty } = req.body;
    const customer_id = req.session.user?.customer_id;

    if (!customer_id) {
        return res.status(400).json({ success: false, message: "User not logged in" });
    }

    if (!req.session.carts) {
        req.session.carts = {};
    }

    if (!req.session.carts[customer_id]) {
        req.session.carts[customer_id] = [];
    }

    const cart = req.session.carts[customer_id];

    // ตรวจสอบว่ามีสินค้านี้อยู่ในตะกร้าหรือไม่
    const existingItem = cart.find(item => item.item_id === item_id);

    if (existingItem) {
        // หากมีสินค้าชิ้นนี้แล้ว, ให้เพิ่มจำนวนสินค้า
        existingItem.qty += parseInt(qty);
    } else {
        // หากไม่มี, เพิ่มสินค้านี้ไปในตะกร้า
        cart.push({ item_id, itemname, price, qty: parseInt(qty) });
    }

    // คำนวณจำนวนสินค้าในตะกร้าทั้งหมด
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    res.json({ success: true, totalQty });
});

//cart
app.get("/cart", authenticateUser, async (req, res) => {
  const customer_id = req.session.user?.customer_id;
  const cart = req.session.carts?.[customer_id] || [];
  
  // ประกาศและคำนวณ cartTotalQty 
  const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  
  res.render("cart", { cart, cartTotalQty });  // ส่ง cartTotalQty ไปด้วย
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



app.listen(5500, () => {
  console.log("server started on port 5500");
});