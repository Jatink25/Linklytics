import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Url } from "../models/url.model.js";
import { nanoid } from "nanoid";

const createShortUrl = asyncHandler(async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        throw new ApiError(400, "URL is required!");
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(originalUrl);
    } catch {
        throw new ApiError(400, "Invalid URL format!");
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new ApiError(400, "Only HTTP and HTTPS URLs are allowed!");
    }

    const shortCode = nanoid(7);

    const url = await Url.create({
        originalUrl,
        shortCode
    });

    return res.status(201).json(
        new ApiResponse(201, url, "Short URL created successfully")
    );
});

const getAllUrls = asyncHandler(async (req, res) => {
    const urls = await Url.find();

    return res.status(200).json(
        new ApiResponse(
            200,
            urls,
            "URLs fetched successfully"
        )
    );
});

const redirectUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
        throw new ApiError(404, "Short URL not found");
    }

    url.clickCount += 1;
    await url.save();

    return res.redirect(url.originalUrl);
});
export { createShortUrl, getAllUrls, redirectUrl };