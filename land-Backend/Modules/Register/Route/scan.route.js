// src/routes/scan.route.js
import { Router } from "express";
import { scanAndCheckIn } from "../Controller/scan.controller.js";

const router = Router();

// POST /api/scan
// body: { reservationId?: string, qrText?: string, checkedInBy?: string }
router.post("/", scanAndCheckIn);

export default router;
