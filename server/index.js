const express = require('express');
const mongoose = require('mongoose');
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

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.MONGO_URI;
console.log("MONGO_URI =>", databaseURL);

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads/posts', express.static('uploads/posts'));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", apiRouter);
app.use("/api/post", postRouter);
app.use("/api/search", searchRouter);
app.use("/api/saved", saveRouter);
app.use("/api/connection", connectionRouter);

// ✅ Connect DB first, then start server
mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ Database connected successfully.");

    const server = app.listen(port, () => {
        console.log(`🚀 Server is running at http://localhost:${port}`);
    });

    // setup socket after server starts
    setUpSocket(server);

}).catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1); // stop app if DB fails
});
