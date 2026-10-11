import express from "express"
import cors from "cors"
import connectDB from "./db.js"
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Linklytics is running!")
});

const PORT = process.env.PORT||8000

const startServer = async ()=>{
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer();