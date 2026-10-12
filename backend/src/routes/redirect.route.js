import { Router } from "express";
import { redirectUrl } from "../controllers/url.controller.js";

const router = Router();

router.route("/:shortCode").get(redirectUrl);

export default router;