import express from "express"
import cors from "cors"
import urlRouter from "./routes/url.route.js"
import redirectRouter from "./routes/redirect.route.js"
import {errorMiddleware} from "./middlewares/error.middleware.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Linklytics is running!")
});

app.use("/api/v1/urls",urlRouter)
app.use("/", redirectRouter);

app.use(errorMiddleware)

export default app

