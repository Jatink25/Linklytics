import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err,req,res,next)=>{
    const statusCode = err.statusCode||500

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        data : null,
        errors: err.errors || []
    })
};

export {errorMiddleware};