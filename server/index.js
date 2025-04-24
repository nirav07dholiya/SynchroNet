const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const apiRouter = require('./routes/auth');
const bodyParser = require('body-parser');
const postRouter = require('./routes/post');
const searchRouter = require('./routes/search');
const saveRouter = require('./routes/save');
const setUpSocket = require('./socket');
const connectionRouter = require('./routes/connection');
const path = require('path')

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

const _dirname = path.resolve()

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials:true,
}))

app.use('/uploads/profiles',express.static('uploads/profiles'))
app.use('/uploads/posts',express.static('uploads/posts'))
// app.use('/uploads/files',express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth",apiRouter)
app.use("/api/post",postRouter)
app.use("/api/search",searchRouter)
app.use("/api/saved",saveRouter)
app.use("/api/connection",connectionRouter)

app.use(express.static(path.join(_dirname, "/client/dist")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname, "client","dist","index.html"))
})

const server = app.listen(port, ()=>{
    mongoose.connect(databaseURL).then(()=>{
        console.log("Database connect successfully.")
    }).catch((err)=>{
        console.log("Database Error: ", err);
    })
    console.log(`Server is running at http://localhost:${port}`);
})

setUpSocket(server)