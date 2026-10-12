import {Router} from 'express';
import { createShortUrl, getAllUrls, redirectUrl } from '../controllers/url.controller.js';
const router = Router()

router.route("/").post(createShortUrl)

router.route("/").get(getAllUrls)


export default router