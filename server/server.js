const express = require("express");
const cors = require("cors");
const mongo = require("mongodb");
const monk = require("monk");

const db = monk("localhost:27017/react-app");

db.get("users").createIndex({
    "username": 1,
}, {
    unique: true,
});

db.get("loginStatus").createIndex({
    "username": 1,
}, {
    unique: true,
});

const app = express();
const port = 3001;

app.use(cors());


// give the app the ability to parse JSON in req.body
app.use(express.json());

// app.use is middleware that is run on creation of the express server
// (when first navigating to the website and on page refresh)
// run on every single route
app.use((req, res, next) => {
    // initialize the db inside of req
    req.db = db;
    return next();
});

app.get("/hello", (req, res) => {
    return res.send({
        status: 200,
        message: "Hello World!",
    });
});

app.post("/createAccount", async(req, res) => {
    const userCollection = req.db.get("users");
    const loginStatusCollection = req.db.get("loginStatus");
    const user = req.body;

    let newUser;
    try {
        newUser = await userCollection.insert(user);
    } catch (error) {
        return res.send({
            status: 500,
            message: `Server Error: ${error}`,
        });
    }

    try {
        await loginStatusCollection.insert({
            user: user.username,
            hasLoggedIn: false,
        });
    } catch (error) {
        return res.send({
            status: 500,
            message: `Server Error: ${error}`,
        });
    }
    
    return res.send({
        status: newUser ? 200 : 400,
        message: newUser ? "user created" : "could not create user",
        user: newUser,
    });
});

app.post("/login", async(req, res) => {
    const userCollection = req.db.get("users");
    const loginStatusCollection = req.db.get("loginStatus");
    const user = req.body;

    let userObject;
    try {
        userObject = await userCollection.findOne({
            username: user.username,
        });
    } catch (error) {
        return res.send({
            status: 500,
            message: `Server Error: ${error}`,
        });
    }

    if (user.password !== userObject.password) {
        return res.send({
            status: 400,
            message: "incorrect password",
            user: null,
        });
    }

    try {
        await loginStatusCollection.update({
            user: user.username,
        }, {
            $set: {
                hasLoggedIn: true,
            }
        });
    } catch (error) {
        return res.send({
            status: 500,
            message: `Server Error: ${error}`,
        });
    }
    
    return res.send({
        status: userObject ? 200 : 400,
        message: userObject ? "user logged in" : "no user",
        user: userObject,
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});