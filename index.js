const express = require("express");
const path = require("path")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");

//Routes are all linked here
const staticRouter = require("./routes/staticRouter")
const urlRouter = require("./routes/url")
const userRoute = require("./routes/user")
const {restrictToLoggedInUserOnly} = require("./middlewares/auth")


const app = express();
const PORT = 8001;


app.use(express.json());

/*

                Always use these two lines, they are responsible for connecting html page to your backend

                app.set("view engine" , "ejs")
                app.set("views" , path.resolve("./veiws"))

                These two lines are essential to connect the "home.ejs" file 


*/

app.set("view engine" , "ejs")
app.set("views" , path.resolve("./veiws"))

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use("/url", urlRouter)
app.use("/user" , userRoute)
app.use('/' , staticRouter)

mongoose.connect("mongodb://127.0.0.1:27017/url-shortener")
.then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`🚀 Server started on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});
