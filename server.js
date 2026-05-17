const express = require("express");

const app = express();
app.use(express.json());

const cors = require("cors");

const corsOptions = {
    origin : process.env.ORIGIN,
    methods : ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders : ['Content-Type', 'Authorization'],
    credentials : true,
    optionsSuccessStatus : 200
}

app.use(cors(corsOptions));

const dns = require("node:dns");

dns.setServers(["1.1.1.1"]);

const authRouter = require("./routes/authRoutes");
const leadRouter = require("./routes/leadRoutes");
const connectDB = require("./db/connectDB");

const errorHandler = require("./middlewares/errorMiddleware");

const dontenv = require("dotenv");
dontenv.config();

connectDB();


const PORT = process.env.PORT || 5000;

app.get("/health", (req, res)=>{
    res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/", leadRouter);

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is up & running on port ${PORT}`);
})