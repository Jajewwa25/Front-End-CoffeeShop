const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
const multer = require("multer");
var bodyParser = require("body-parser");
const { clearConfigCache } = require("prettier");

//const base_url = "http://node59554-env-5865143.proen.app.ruk-com.cloud";
const base_url = "http://localhost:3000";
//"body-parser": "^1.20.2";

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "/public/views"));

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

app.get("/register",(req, res) => {
  try {
    res.render("Register");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/login", async (req, res) => {
  try {
    // ดึงข้อมูล customer จากฐานข้อมูลหรือที่เก็บข้อมูล
    const customers = await axios.get(base_url + "/customer");
    const { username, password } = req.body;

    // เช็คว่ามี customer ที่มี username และ password ตรงกับที่รับเข้ามาหรือไม่
    const matchedCustomer = customers.data.find(
      (customer) => customer.username == username && customer.password == password
    );

    if (matchedCustomer) {
      // ถ้า username คือ 'Admin' ให้ไปที่หน้า menu1
      if (username === 'Admin') {
       return res.redirect("/menu1");
      } else{
        // ถ้าไม่ใช่ 'Admin' ให้ไปที่หน้า menu
        return res.redirect("/menu");
      }
    } else {
      // หากไม่พบข้อมูล customer ในฐานข้อมูลหรือไม่สามารถตรวจสอบได้
      // สามารถเพิ่มการจัดการข้อผิดพลาดเพื่อแจ้งให้ผู้ใช้รู้ว่าข้อมูลไม่ถูกต้อง
      // หรือทำการเข้าสู่ระบบใหม่อีกครั้งได้ตามต้องการ

      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/login");
});

app.post("/register", async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      tel: req.body.tel,
      email:req.body.email
    };
    console.log(data)
    await axios.post(base_url + "/register", data);

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("error in /register");
    res.redirect("/");
  }
});

app.get("/about",async (req, res) => {
  try {
    const response = await axios.get(base_url + "/about")
    console.log(response.data);
    res.render("about", {Employee:response.data});
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
    res.render("employee", {Employee:response.data});
  } catch (err) { 
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/employee/:id", async(req, res) => {
  try {
    const response = await axios.get(base_url + "/employee/" + req.params.id)
    res.render("oneemployee", {Employee:response.data});
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/updateemployee/:id", async (req, res) => { 
  try {
    const response = await axios.get(base_url + "/employee/" + req.params.id);
    res.render("updateemployee", { Employee: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/updateemployee/:id",upload.single("img"), async (req, res) => {
  try {
    const data = { username: req.body.username,
      password: req.body.password,
      age: req.body.age,
      position: req.body.position,
      img:req.file.filename
    };
    await axios.put(base_url + "/Employee/" + req.params.id, data);
    res.redirect("/employee");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/deleteemployee/:id", async (req, res) => {
  try {
    await axios.delete(base_url + "/Employee/" + req.params.id);
    res.redirect("/employee");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

//
app.get("/item", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/item");
    console.log(response.data);
    res.render("item", { Item: response.data });
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.get("/item/:id", async(req, res) => {
  try {
    const response = await axios.get(base_url + "/item/" + req.params.id)
    res.render("onemenu", {Item:response.data});
  } catch (err) {
    res.status(500).send("error");
    res.redirect("/");
  }
});


app.get("/updatemenu/:id", async (req, res) => { 
  try {
    const response = await axios.get(base_url + "/item/" + req.params.id);
    res.render("updatemenu", { Item: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});


app.post("/updatemenu/:id",upload.single("img"), async (req, res) => {
  try {
    const data = {
      itemname: req.body.itemname,
      price: req.body.price,
      img:req.file.filename
    };
    await axios.put(base_url + "/item/" + req.params.id, data);
    return res.redirect("/Item"); // เมื่ออัปเดตเสร็จแล้วให้ redirect ไปยังหน้า "/item"
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});




app.get("/deletemenu/:id", async (req, res) => {
  try {
    await axios.delete(base_url + "/item/" + req.params.id);
    res.redirect("/item");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});



app.get("/delete/:id", async (req, res) => {
  try{
      await axios.delete(base_url + '/Item/'+ req.params.id);
      res.redirect("/menu1");
  } catch (err){
      console.error(err);
      res.status(500).send('Error');
  }
});
// Add menu

app.get("/addmenu", (req, res) => {
  try {
    res.render("addmenu");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/addmenu",upload.single("img"), async (req, res) => {
  try {
    const data = {
      itemname: req.body.itemname,
      price: req.body.price,
      img:req.file.filename
    };
    await axios.post(base_url + '/Items' , data);
    res.redirect("/item");
    //await axios.put(base_url + "/item/" + req.params.id, data);
   // res.redirect("/item"); // เมื่ออัปเดตเสร็จแล้วให้ redirect ไปยังหน้า "/item"
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});
// addemployee
app.get("/addemployee", (req, res) => {
  try {
    res.render("addemployee");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/addemployee",upload.single("img"), async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
      position: req.body.position,
      img:req.file.filename
    };
    await axios.post(base_url + '/Employee' , data);
          res.redirect("/employee");
    //await axios.put(base_url + "/item/" + req.params.id, data);
   // res.redirect("/item"); // เมื่ออัปเดตเสร็จแล้วให้ redirect ไปยังหน้า "/item"
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});


app.get("/cart",async(req, res) => {
  try {
    const response = await axios.get(
      base_url + "/cart"
    );
    console.log(response.data);
    res.render("cart",{cart:response.data});
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
    res.redirect("/");
  }
});

app.post("/cart", async (req, res) => {
  try {
    const data = {
      item_id:req.body.item_id,
      customer_id:1,
      qty:req.body.qty
    };
    console.log(data)
    const response = await axios.post(base_url + "/cart", data);
    console.log(response)
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("error in /cart");
    res.redirect("/");
  }
});




app.listen(5500, () => {
  console.log("server started on port 5500");
});