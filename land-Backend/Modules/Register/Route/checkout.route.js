import { Router } from "express";
import { checkoutAndGenerateQR } from "../Controller/checkout.controller.js";

const router = Router();

// POST /api/checkout
router.post("/", checkoutAndGenerateQR);

export default router;
