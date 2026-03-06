const express = require("express");
const session = require("express-session");
const User = require("./user");
require("./db");

const app = express();

app.use(express.json());

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));

// REGISTER
app.post("/register", async (req,res) => {

    const {username, password} = req.body;

    const user = new User(username, password);

    const result = await user.register();

    res.send(result);

});

// LOGIN
app.post("/login", async (req,res) => {

    const {username, password} = req.body;

    const user = new User(username, password);

    const result = await user.login();

    if(result){
        req.session.user = username;
        res.send("Login successful");
    } else {
        res.send("Invalid credentials");
    }

});

// AUTH MIDDLEWARE
function auth(req,res,next){

    if(req.session.user){
        next();
    } else {
        res.send("Please login first");
    }

}

// DASHBOARD
app.get("/dashboard", auth, (req,res) => {

    res.send("Welcome " + req.session.user);

});

// LOGOUT
app.get("/logout", (req,res) => {

    req.session.destroy();

    res.send("Logout successful");

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});