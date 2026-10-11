import dotenv from "dotenv/config"
import connectDB from "./db.js"

import app from "./app.js"

const PORT = process.env.PORT||8000

connectDB()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server is running at Port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.error("Database connection failed:",error)
    });



