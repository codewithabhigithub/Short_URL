const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectToMongoDB} = require('./connect');
const {checkForAuthentication,restrictTo} = require('./middleware/auth');

const URL = require('./models/url');

const urlRoute = require ('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();
const PORT = 8001;

// database connectivity
connectToMongoDB(process.env.MONGODB ?? "mongodb://127.0.0.1:27017/shortURL").then(() => {
    console.log("Connected to database");
});

//for ui purpose
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

// data parsing main help krta h 
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url",restrictTo(["NORMAL","ADMIN"]),urlRoute);
app.use("/user",userRoute);
app.use("/",staticRouter);

app.get('/url/:shortId',async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        }, 
        {
        $push:{
            visitHistory:{
                timestamp: Date.now(),
            },  
        }
    });

    res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});