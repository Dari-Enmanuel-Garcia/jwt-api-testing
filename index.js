const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require("path")

const { PORT, MONGODB } = process.env;

const userRouter = require("./router/user")
const app = express();

async function connectDB() {
    try {
        await mongoose.connect(MONGODB);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1); 
    }
}

app.use(express.json());
app.use(cors({ origin: "https://svelte-auth-chi.vercel.app",credentials:true }));
app.use(cookieParser())
app.use("/api",userRouter)

app.get("/", (req, res) => {
    return res.status(200).json("Server is Running in vercel")
});

(async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Servidor iniciado en http://192.168.1.7:${PORT}`);
    });
})();
